import React, { Component } from 'react';
import {
  NormalPeoplePicker,
  ValidationState,
  CompactPeoplePicker
} from 'office-ui-fabric-react/lib/Pickers';

const suggestionProps = {
  suggestionsHeaderText: 'Suggested People',
  mostRecentlyUsedHeaderText: 'Suggested Contacts',
  noResultsFoundText: 'No results found',
  loadingText: 'Loading',
  showRemoveButtons: false,
  suggestionsAvailableAlertText: 'People Picker Suggestions available',
  suggestionsContainerAriaLabel: 'Suggested contacts',
};

class TeamPeoplePicker extends Component {
  _picker = React.createRef();

  constructor(props) {
    super(props);
    const {
      peopleList = [],
      mostRecentlyUsed = [],
      isCompactPeoplePicker = false,
      displayErrorMessageExplicitly = false,
      selectedPeopleList = [],
      placeholder = 'add user',
    } = props;

    this.state = {
      currentPicker: 1,
      delayResults: false,
      peopleList,
      mostRecentlyUsed,
      isPickerDisabled: false,
      decisionResult: false,
      showSpinner: false,
      errorMessage: '',
      isCompactPeoplePicker,
      isDirtyPeoplePicker: false,
      displayErrorMessageExplicitly, // if true, text field will ignore dirty field and force to display error only if text field is empty
      selectedPeopleList,
      placeholder
    };
    this.onBlurPeoplePicker = this.onBlurPeoplePicker.bind(this);
    this.onFocusPeoplePicker = this.onFocusPeoplePicker.bind(this);
  }

  componentDidUpdate(previousProps) {

    if (this.props.peopleList.length > 0) {
      if (this.state.peopleList.length === 0) {
        this.setState({ peopleList: this.props.peopleList });
        this.setState({ mostRecentlyUsed: this.props.peopleList });

      }
    }
    const { displayErrorMessageExplicitly, selectedPeopleList } = this.props;
    if (previousProps.selectedPeopleList !== selectedPeopleList) {
      this.setState({ selectedPeopleList }, () => this.checkPeoplePickerErrorMessage());
      this.props.onItemsChange(selectedPeopleList);
    }

    if (
      displayErrorMessageExplicitly !==
      previousProps.displayErrorMessageExplicitly
    ) {
      this.setState({
        displayErrorMessageExplicitly,
        errorMessage: displayErrorMessageExplicitly
          ? this.props.errorMessage
          : ''
      });
    }
  }

  render() {
    const {
      errorMessage,
      isPickerDisabled,
      isCompactPeoplePicker,
      selectedPeopleList,
      placeholder,
    } = this.state;

    return (
      <div>
        {isCompactPeoplePicker ? (
          <CompactPeoplePicker
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
              onBlur: event => this.onBlurPeoplePicker(event),
              onFocus: event => this.onFocusPeoplePicker(event),
              'aria-label': 'People Picker'
            }}
            componentRef={this._picker}
            onInputChange={this._onInputChange}
            resolveDelay={300}
            disabled={isPickerDisabled}
            onChange={this._onItemsChange}
            // itemLimit={5}
            // defaultSelectedItems={selectedPeopleList}
            selectedItems={selectedPeopleList}
          />
        ) : (
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
                onBlur: event => this.onBlurPeoplePicker(event),
                onFocus: event => this.onFocusPeoplePicker(event),
                'aria-label': 'People Picker',
                placeholder: placeholder,
              }}
              componentRef={this._picker}
              onInputChange={this._onInputChange}
              resolveDelay={300}
              disabled={isPickerDisabled}
              onChange={this._onItemsChange}
              // itemLimit={5}
              // defaultSelectedItems={selectedPeopleList}
              selectedItems={selectedPeopleList}
            />
          )}
        {errorMessage ? (
          <div role="alert">
            <p className="ms-TextField-errorMessage validationErrorMessage">
              <span data-automation-id="error-message">{errorMessage}</span>
            </p>
          </div>
        ) : null}
      </div>
    );
  }

  onBlurPeoplePicker(event) {
    this.checkPeoplePickerErrorMessage();
  }

  onFocusPeoplePicker(event) {
    const isDirtyPeoplePicker = true;
    this.setState({
      isDirtyPeoplePicker
    });
  }

  _getTextFromItem(persona) {
    return persona.text;
  }

  checkPeoplePickerErrorMessage() {
    let errorMessage = '';
    const { selectedPeopleList } = this.state;
    if (selectedPeopleList && !selectedPeopleList.length) {
      errorMessage = this.props.errorMessage;
    }
    this.setState({
      errorMessage,
    });
  }

  _onItemsChange = items => {
    this.setState({ selectedPeopleList: items }, () => { this.checkPeoplePickerErrorMessage() });
    this.props.onItemsChange(items);
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

export default TeamPeoplePicker;
