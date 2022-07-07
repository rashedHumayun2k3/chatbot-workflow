import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ListPeoplePicker, ValidationState } from 'office-ui-fabric-react/lib/Pickers';
import { getUsersFromGraphAPIReturnsPromise } from '../../actions/auth-request-actions';
import { CURRENTUSER } from '../../constants/types';
import Laguage from './Language';

const suggestionProps = {
  suggestionsHeaderText: Laguage.jap.SuggestedPeople, // 'Suggested People',
  mostRecentlyUsedHeaderText: Laguage.jap.SuggestedContacts, // 'Suggested Contacts',
  noResultsFoundText: Laguage.jap.NoResultsFound, // 'No results found',
  loadingText: Laguage.jap.Loading, // 'Loading',
  showRemoveButtons: false,
  suggestionsAvailableAlertText: Laguage.jap.PeoplePickerSuggestionsavailable, // 'People Picker Suggestions available',
  suggestionsContainerAriaLabel: Laguage.jap.SuggestedContacts, // 'Suggested contacts',
};
export const TeamPeoplePickerV2 = (props) => {
  const { onItemsChange, placeholder, selectedPeopleList } = props;
  const picker = useRef(null);
  const [selectedLang] = useState(Laguage.jap);
  function listContainsPersona(persona, personas) {
    if (!personas || !personas.length || personas.length === 0) {
      return false;
    }
    return personas.filter((item) => item.text === persona.text).length > 0;
  }
  function removeDuplicates(personas, possibleDupes) {
    return personas.filter((persona) => !listContainsPersona(persona, possibleDupes));
  }
  function getTextFromItem(persona) {
    return persona.text;
  }
  function validateInput(input) {
    if (input.indexOf('@') !== -1) {
      return ValidationState.valid;
    }
    if (input.length > 1) {
      return ValidationState.warning;
    }

    return ValidationState.invalid;
  }
  const { isTemplateCreating } = useSelector((state) => state.template);
  const [isTemplateSelected, setIsTemplateSelected] = useState(false);
  useEffect(() => {
    if (isTemplateCreating) {
      setIsTemplateSelected(isTemplateCreating);
    }
  }, [isTemplateCreating]);

  const onFilterChanged = (filterText, currentPersonas, limitResults) => {
    if (filterText && filterText.length > 1) {
      return getUsersFromGraphAPIReturnsPromise(filterText).then((processedData) => {
        if (processedData) {
          let filteredPersonas = processedData;
          filteredPersonas = removeDuplicates(filteredPersonas, currentPersonas);
          // remove current user from list
          if (isTemplateSelected === false) {
            const currentUser = JSON.parse(localStorage.getItem(CURRENTUSER));
            filteredPersonas = filteredPersonas.filter((user) => user.secondarytext !== currentUser.currentLoggedInUserPrincipal);
          }
          // setPeopleList(filteredPersonas);
          return filteredPersonas;
        }
      }).catch((error) => {
        setErrorMessage(selectedLang.GenericError);// 'エラーが発生しました。');// An error occured
      });
    }
    return [];
  };
  const [errorMessage, setErrorMessage] = useState('');
  const checkPeoplePickerErrorMessage = () => {
    const varErrorMessage = '';
    // if (peopleList && !peopleList.length) {
    //   varErrorMessage = this.props.varErrorMessage;
    // }
    setErrorMessage(errorMessage);
  };
  const onBlurPeoplePicker = () => {
    checkPeoplePickerErrorMessage();
  };

  const onFocusPeoplePicker = () => {
    // const isDirtyPeoplePicker = true;
    // this.setState({
    //   isDirtyPeoplePicker,
    // });
  };
  const onchange = (items) => {
    if (items) {
      // if some user does not have spid that means invalid
      const criteria = (user) => user.spid == null;
      if (!items.some(criteria)) {
        onItemsChange(items);
      }
    }
  };

  return (<div>
    <ListPeoplePicker
      onResolveSuggestions={onFilterChanged}
      getTextFromItem={getTextFromItem}
      className='ms-PeoplePicker'
      pickerSuggestionsProps={suggestionProps}
      key='list'
      onValidateInput={validateInput}
      inputProps={{
        onBlur: (event) => onBlurPeoplePicker(event),
        onFocus: (event) => onFocusPeoplePicker(event),
        'aria-label': 'People Picker',
        placeholder,
      }}
      componentRef={picker}
      resolveDelay={300}
      onChange={onchange}
      defaultSelectedItems={selectedPeopleList}
       />
    {errorMessage ? (
      <div role="alert">
        <p className="ms-TextField-errorMessage validationErrorMessage">
          <span data-automation-id="error-message">{errorMessage}</span>
        </p>
      </div>
    ) : null}
  </div>);
};
