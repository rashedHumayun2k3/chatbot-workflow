import React, { useState, useEffect } from 'react';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';

const TeamDropDown = ({
  defaultSelectedKey,
  label,
  options,
  dropdownStyles,
  isRequired = false,
  errorMessage = null,
  placeholder = '',
  onSelectItem,
  autoFocusDropDown = false,
  displayErrorMessageExplicitly = false
}) => {
  const dropdownRef = React.createRef();
  const [
    teamDropDownDefaultSelectKey,
    setTeamDropDownDefaultSelectKey
  ] = useState(defaultSelectedKey);

  const [selectedOption, setSelectedOption] = useState(false);
  const [teamDropdownErrorMessage, setTeamDropdownErrorMessage] = useState(
    ''
  );

  useEffect(() => {
    updateDefaultSelectKey(defaultSelectedKey);
    if (autoFocusDropDown) {
      dropdownRef.current.focus(true);
    }
  }, [defaultSelectedKey]);

  useEffect(() => {
    showErrorMessageExplicitly(displayErrorMessageExplicitly);
  }, [displayErrorMessageExplicitly]);

  const updateDefaultSelectKey = defaultKey => {
    setTeamDropDownDefaultSelectKey(defaultKey);
  };

  const onSelectTeamDropDownItem = option => {
    onSelectItem(null, option);
    setSelectedOption(option);
    setTeamDropdownErrorMessage('');
  };

  const showErrorMessageExplicitly = displayErrorMessage => {
    if (displayErrorMessage && !selectedOption) {
      setTeamDropdownErrorMessage(errorMessage);
    }
  };

  return (
    <Dropdown
      componentRef={dropdownRef}
      required={isRequired}
      placeholder={placeholder}
      label={label}
      options={options}
      defaultSelectedKey={teamDropDownDefaultSelectKey}
      styles={dropdownStyles}
      onChanged={onSelectTeamDropDownItem}
      errorMessage={teamDropdownErrorMessage}
    />
  );
};

export default TeamDropDown;
