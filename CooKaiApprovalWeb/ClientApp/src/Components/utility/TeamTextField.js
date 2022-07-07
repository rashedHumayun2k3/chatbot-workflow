import React, { useState, useEffect } from 'react';
import { TextField } from 'office-ui-fabric-react';

const TeamTextField = ({
  label,
  placeholder = '',
  value = '',
  onChangeTextField,
  errorMessage = '',
  isRequired = false,
  isMultiline = false,
  noOfRows = 1,
  isResizable = false,
  displayErrorMessageExplicitly = false, // if true, text field will ignore dirty field and force to display error only if text field is empty
  ...otherProps
}) => {
  const [isTeamTextFieldDirty, setIsTeamTextFieldDirty] = useState(false);
  const [teamTextFieldErrorMessage, setTeamTextFieldErrorMessage] = useState(
    false,
  );

  const onFocusTeamTextField = () => {
    setIsTeamTextFieldDirty(true);
  };

  const onBlurTeamTextField = () => {
    if (!value.length) {
      setTeamTextFieldErrorMessage(errorMessage);
    }
  };

  const onChangeTeamTextField = (event, textFieldValue) => {
    onChangeTextField(event, textFieldValue);
    if (isTeamTextFieldDirty && !textFieldValue.trim().length) {
      setTeamTextFieldErrorMessage(errorMessage);
    } else {
      setTeamTextFieldErrorMessage('');
    }
  };

  const showErrorMessageExplicitly = (displayErrorMessage) => {
    if (displayErrorMessage && !value) {
      setTeamTextFieldErrorMessage(errorMessage);
    }
  };

  useEffect(() => {
    showErrorMessageExplicitly(displayErrorMessageExplicitly);
  }, [displayErrorMessageExplicitly]);

  return (
    <TextField
      label={label}
      placeholder={placeholder}
      multiline={isMultiline}
      rows={noOfRows}
      resizable={isResizable}
      value={value}
      onChange={onChangeTeamTextField}
      required={isRequired}
      onFocus={onFocusTeamTextField}
      onBlur={onBlurTeamTextField}
      errorMessage={teamTextFieldErrorMessage}
      maxLength={1000}
      {...otherProps}
    />
  );
};

export default TeamTextField;
