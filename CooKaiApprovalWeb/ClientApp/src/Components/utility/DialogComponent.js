import React, { Component } from 'react';
import {
  Dialog,
  DialogType,
  DialogFooter
} from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { getId } from 'office-ui-fabric-react/lib/Utilities';
import { Icon } from 'office-ui-fabric-react';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import * as CustomDialogType from '../../enum/dialogType';

const successIconClass = mergeStyles({
  fontSize: 12,
  height: 19,
  width: 10,
  margin: '0px',
  color: 'green',
  paddingRight: 8,
  fontWeight: 'bold',
  display: 'inline-table',
  paddingBottom: '19px'
});

const errorIconClass = mergeStyles({
  fontSize: 12,
  height: 19,
  width: 10,
  margin: '0px',
  color: 'red',
  paddingRight: 8,
  fontWeight: 'bold'
});

const textContainerStyle = {
  display: 'flex',
};

class DialogComponent extends Component {
  state = {
    hideDialog: true,
    dialogTitle: '',
    dialogText: ''
  };

  componentWillReceiveProps(props) {
    const { dialogVisibility, dialogTitle, dialogText, dialogType } = props;
    if (dialogVisibility) {
      this.setState({
        hideDialog: !dialogVisibility,
        dialogTitle,
        dialogText: this.formatedText(dialogType, dialogText)
      });
    }
  }

  _subTextId = getId('subTextLabel');

  render() {
    const { hideDialog, dialogText, dialogTitle } = this.state;
    const { hideControls, blocking } = this.props;
    return (
      <div>
        <Dialog
          hidden={hideDialog}
          onDismiss={this._closeDialog}
          dialogContentProps={{
            type: blocking ? DialogType.largeHeader : DialogType.normal,
            title: dialogTitle,
            closeButtonAriaLabel: 'Close',
            subText: dialogText
          }}
          modalProps={{
            titleAriaId: this._labelId,
            subtitleAriaId: this._subTextId,
            isBlocking: blocking,
            styles: { main: { maxWidth: 450 } }
          }}
        >
          {!hideControls && <DialogFooter>
            <PrimaryButton onClick={this._closeDialog} text="Ok" />
          </DialogFooter>}
        </Dialog>
      </div>
    );
  }

  formatedText(dialogType = DialogType.SUCCESS_TYPE, dialogText) {
    let iconName = '';
    let iconClass = successIconClass;
    switch (dialogType) {
      case CustomDialogType.ERROR_TYPE:
        iconName = 'ErrorBadge';
        iconClass = errorIconClass;
        break;
      default:
        iconName = 'Completed';
        iconClass = successIconClass;
        break;
    }
    return (
      <span style={textContainerStyle}>
        <span>
          <Icon iconName={iconName} className={iconClass} />
        </span>
        <span>{dialogText}</span>
      </span>
    );
  }

  _closeDialog = () => {
    if (this.props.onCloseDialog) {
      this.props.onCloseDialog(true);
    }
    this.setState({ hideDialog: true });
  };
}

export default DialogComponent;
