import React, { Component } from 'react';
import {
  NormalPeoplePicker,
  ValidationState
} from 'office-ui-fabric-react/lib/Pickers';
import CommonDecisionButtons from '../utility/CommonDecisionButtons';
import DialogComponent from '../utility/DialogComponent';
import * as DialogType from '../../enum/dialogType';
import { makeAssignment } from '../../actions/assign';
import { Label } from 'office-ui-fabric-react';
import * as cardFunctionalityType from '../../enum/cardFunctionalityType';

const suggestionProps = {
  suggestionsHeaderText: 'Suggested People',
  mostRecentlyUsedHeaderText: 'Suggested Contacts',
  noResultsFoundText: 'No results found',
  loadingText: 'Loading',
  showRemoveButtons: true,
  suggestionsAvailableAlertText: 'People Picker Suggestions available',
  suggestionsContainerAriaLabel: 'Suggested contacts'
};

class PeoplePicker extends Component {
  _picker = React.createRef();

  constructor(props) {
    super(props);
    const { people, mru, currentSelectedRow } = props;
    this.state = {
      currentPicker: 1,
      delayResults: false,
      peopleList: people,
      mostRecentlyUsed: mru,
      currentSelectedItems: [],
      isPickerDisabled: false,
      decisionResult: false,
      dialogTitle: 'title',
      dialogText: 'text',
      dialogVisibility: false,
      dialogType: DialogType.SUCCESS_TYPE,
      currentSelectedRow: currentSelectedRow,
      showSpinner: false
    };
    this.onDecisionDone = this.onDecisionDone.bind(this);
    this.onCloseDialog = this.onCloseDialog.bind(this);
  }

  onDecisionDone(decisionResult) {
    if (!decisionResult) {
      this._onClosePeoplePicker();
      return;
    }
    const { currentSelectedItems, currentSelectedRow, peopleList, showSpinner } = this.state;
    const selectedAssignee = currentSelectedItems[0];
    if (!selectedAssignee || showSpinner) {
      return;
    }

    this.setState({
      showSpinner: true
    });

    makeAssignment(selectedAssignee, currentSelectedRow, peopleList, (error, res) => {
      if (error || !res) {
        let errorMessage = '';
        if (error && error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
          errorMessage = error.response.data.error.message;
        } else if (error && error.message) {
          errorMessage = error.message;
        } else {
          errorMessage = 'Something went wrong, please try again!';
        }
        this.setState({
          dialogVisibility: true,
          dialogType: DialogType.ERROR_TYPE,
          dialogText: errorMessage,
          dialogTitle: 'Error',
          decisionResult,
          showSpinner: false
        });
        return;
      }

      const { id, ContentType } = currentSelectedRow.fields;
      const idTag = ContentType.toUpperCase() === 'INCIDENTS' ? 'IM' : 'SR';

      this.setState({
        dialogVisibility: true,
        dialogType: DialogType.SUCCESS_TYPE,
        dialogText: `The assignee "${selectedAssignee.text}" is set successfully for the ticket ${idTag} ${id}`,
        dialogTitle: 'Success',
        decisionResult,
        showSpinner: false
      });
    });
  }

  onCloseDialog() {
    this.setState(
      {
        dialogVisibility: false
      },
      () => {
        this._onClosePeoplePicker();
      }
    );
  }

  render() {
    const {
      dialogTitle,
      dialogText,
      dialogVisibility,
      dialogType,
      showSpinner
    } = this.state;
    return (
      <div>
        <DialogComponent
          dialogTitle={dialogTitle}
          dialogText={dialogText}
          dialogVisibility={dialogVisibility}
          dialogType={dialogType}
          onCloseDialog={this.onCloseDialog}
        />
        <Label>Select People to Assign</Label>
        {this._renderNormalPicker()}
        <br />
        <CommonDecisionButtons
          onDecisionDone={this.onDecisionDone}
          showSpinner={showSpinner}
        />
      </div>
    );
  }

  _getTextFromItem(persona) {
    return persona.text;
  }

  _renderNormalPicker() {
    return (
      <NormalPeoplePicker
        onResolveSuggestions={this._onFilterChanged}
        onEmptyInputFocus={this._returnMostRecentlyUsed}
        getTextFromItem={this._getTextFromItem}
        pickerSuggestionsProps={suggestionProps}
        className={'ms-PeoplePicker'}
        key={'normal'}
        onRemoveSuggestion={this._onRemoveSuggestion}
        onValidateInput={this._validateInput}
        removeButtonAriaLabel={'Remove'}
        inputProps={{
          'aria-label': 'People Picker'
        }}
        componentRef={this._picker}
        onInputChange={this._onInputChange}
        resolveDelay={300}
        disabled={this.state.isPickerDisabled}
        onChange={this._onItemsChange}
        itemLimit={1}
      />
    );
  }

  _onItemsChange = items => {
    this.setState({
      currentSelectedItems: items
    });
  };

  _onSetFocusButtonClicked = () => {
    if (this._picker.current) {
      this._picker.current.focusInput();
    }
  };

  _onClosePeoplePicker = () => {
    this.props.onCompletedCardFunctionality(
      cardFunctionalityType.ASSIGN,
      this.state.currentSelectedItems
    );
  };

  _renderFooterText = () => {
    return <div>No additional results</div>;
  };

  _onRemoveSuggestion = item => {
    const { peopleList, mostRecentlyUsed: mruState } = this.state;
    const indexPeopleList = peopleList.indexOf(item);
    const indexMostRecentlyUsed = mruState.indexOf(item);

    if (indexPeopleList >= 0) {
      const newPeople = peopleList
        .slice(0, indexPeopleList)
        .concat(peopleList.slice(indexPeopleList + 1));
      this.setState({ peopleList: newPeople });
    }

    if (indexMostRecentlyUsed >= 0) {
      const newSuggestedPeople = mruState
        .slice(0, indexMostRecentlyUsed)
        .concat(mruState.slice(indexMostRecentlyUsed + 1));
      this.setState({ mostRecentlyUsed: newSuggestedPeople });
    }
  };

  _onItemSelected = item => {
    const processedItem = { ...item };
    processedItem.text = `${item.text} (selected)`;
    return new Promise((resolve, reject) =>
      setTimeout(() => resolve(processedItem), 250)
    );
  };

  _onFilterChanged = (filterText, currentPersonas, limitResults) => {
    if (filterText) {
      let filteredPersonas = this._filterPersonasByText(filterText);

      filteredPersonas = this._removeDuplicates(
        filteredPersonas,
        currentPersonas
      );
      filteredPersonas = limitResults
        ? filteredPersonas.splice(0, limitResults)
        : filteredPersonas;
      return this._filterPromise(filteredPersonas);
    } else {
      return [];
    }
  };

  _returnMostRecentlyUsed = currentPersonas => {
    let { mostRecentlyUsed } = this.state;
    mostRecentlyUsed = this._removeDuplicates(
      mostRecentlyUsed,
      currentPersonas
    );
    return this._filterPromise(mostRecentlyUsed);
  };

  _returnMostRecentlyUsedWithLimit = currentPersonas => {
    let { mostRecentlyUsed } = this.state;
    mostRecentlyUsed = this._removeDuplicates(
      mostRecentlyUsed,
      currentPersonas
    );
    mostRecentlyUsed = mostRecentlyUsed.splice(0, 3);
    return this._filterPromise(mostRecentlyUsed);
  };

  _onFilterChangedWithLimit = (filterText, currentPersonas) => {
    return this._onFilterChanged(filterText, currentPersonas, 3);
  };

  _filterPromise(personasToReturn) {
    if (this.state.delayResults) {
      return this._convertResultsToPromise(personasToReturn);
    } else {
      return personasToReturn;
    }
  }

  _listContainsPersona(persona, personas) {
    if (!personas || !personas.length || personas.length === 0) {
      return false;
    }
    return personas.filter(item => item.text === persona.text).length > 0;
  }

  _filterPersonasByText(filterText) {
    return this.state.peopleList.filter(item =>
      this._doesTextStartWith(item.text, filterText)
    );
  }

  _doesTextStartWith(text, filterText) {
    return text.toLowerCase().indexOf(filterText.toLowerCase()) === 0;
  }

  _convertResultsToPromise(results) {
    return new Promise((resolve, reject) =>
      setTimeout(() => resolve(results), 2000)
    );
  }

  _removeDuplicates(personas, possibleDupes) {
    return personas.filter(
      persona => !this._listContainsPersona(persona, possibleDupes)
    );
  }

  _validateInput = input => {
    if (input.indexOf('@') !== -1) {
      return ValidationState.valid;
    } else if (input.length > 1) {
      return ValidationState.warning;
    } else {
      return ValidationState.invalid;
    }
  };

  _onInputChange(input) {
    const outlookRegEx = /<.*>/g;
    const emailAddress = outlookRegEx.exec(input);

    if (emailAddress && emailAddress[0]) {
      return emailAddress[0].substring(1, emailAddress[0].length - 1);
    }

    return input;
  }
}

export default PeoplePicker;
