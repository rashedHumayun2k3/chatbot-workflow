import React from 'react';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  buttonStyle: {
    backgroundColor: '#db0000',
    color: '#ffffff',
    '&:hover': {
      textDecoration: 'none',
      backgroundColor: '#db0000',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
  },
}));

const ConfirmDialog = (props) => {
  const {
    open, handleClose, contentText, handleOk, dialogTitle,
  } = props;
  const classes = useStyles();

  const dialogContentProps = {
    type: DialogType.normal,
    subText: contentText,
    title: dialogTitle,
    className: 'confirmation-dialog',
  };

  return (
    <div className="deleteModal">
      <Dialog
        hidden={!open}
        onDismiss={handleClose}
        dialogContentProps={dialogContentProps}
        modalProps={{
          styles: {
            main: {
              maxWidth: '500px !important',
            },
          },
        }}
      >
        <DialogFooter>
          <Button
            className="longer-width-0 btn-cancel"
            variant="contained"
            onClick={handleClose}
          >
            キャンセル
          </Button>
          <Button
            className="longer-width-0 btn-okay"
            classes={{
              root: classes.buttonStyle,
            }}
            variant="contained"
            onClick={handleOk}
          >
           変更
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ConfirmDialog;
