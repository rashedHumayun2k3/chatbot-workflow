import React from 'react';
import { Button } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import { makeStyles } from '@material-ui/core/styles';
import Laguage from '../utility/Language';

const useStyle = makeStyles(() => ({
  iconStyle: {
    color: 'white',
  },
  buttonPrimary: {
    backgroundColor: '#0e7bc6',
    '&:hover': {
      backgroundColor: '#0e7bc6',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: '#0e7bc6',
      },
    },
  },
  buttonRoot: {
    textTransform: 'none',
    minWidth: 300,
    height: 40,
  },
}));

const DownLoadButton = (props) => {
  const { onClick } = props;
  const [selectedLang] = React.useState(Laguage.jap);
  const classes = useStyle();
  return (
    <>
      <Button
        color="primary"
        startIcon={<GetAppIcon className={classes.iconStyle} />}
        onClick={onClick}
        variant="contained"
        classes={{
          containedPrimary: classes.buttonPrimary,
          root: classes.buttonRoot,
        }}
        disableElevation
      >
        {selectedLang.DownloadForm}
      </Button>
    </>
  );
};

export default DownLoadButton;
