import React, { Component } from 'react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import {
  PrimaryButton,
  DefaultButton
} from 'office-ui-fabric-react/lib/Button';
import { Stack } from 'office-ui-fabric-react';

class CommonDecisionButtons extends Component {
  constructor(props) {
    super(props);
    this.onClickConfirm = this.onClickConfirm.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
    const { primaryButtonText = 'Ok', defaultButtonText = 'Cancel' } = props;
    this.state = {
      showSpinner: props.showSpinner,
      primaryButtonText,
      defaultButtonText
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      const { showSpinner } = this.props;
      this.setState({ showSpinner });
    }
  }

  onClickConfirm() {
    this.props.onDecisionDone(true);
  }

  onClickCancel() {
    this.props.onDecisionDone(false);
  }

  render() {
    const { showSpinner, primaryButtonText, defaultButtonText } = this.state;
    const { hideCancel } = this.props;
    return (
      <Stack horizontal>
        <PrimaryButton text={primaryButtonText} onClick={this.onClickConfirm}>
          {showSpinner ? <Spinner size={SpinnerSize.xSmall} /> : null}
        </PrimaryButton>
        {!hideCancel && <span className="common-decision-margin-left">
          <DefaultButton
            text={defaultButtonText}
            onClick={this.onClickCancel}
          />
        </span>}
      </Stack>
    );
  }
}

export default CommonDecisionButtons;
