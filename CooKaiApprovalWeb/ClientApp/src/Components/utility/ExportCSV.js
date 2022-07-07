import React, { useState } from 'react';
import { CSVLink } from 'react-csv';
import GetAppIcon from '@material-ui/icons/GetApp';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import Language from './Language';

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
    minWidth: 150,
    height: 40,
  },
}));

export const ExportCSV = ({ csvData, fileName }) => {
  const [selectedLang] = useState(Language.jap);
  const classes = useStyle();
  return (
        <CSVLink filename={fileName} className="no-decoration" data={csvData}>
          <Button
            color="primary"
            type="submit"
           variant="contained"
          classes={{
            containedPrimary: classes.buttonPrimary,
            root: classes.buttonRoot,
          }}
        disableElevation
           startIcon={<GetAppIcon className={classes.iconStyle} />} >
            {selectedLang.DownloadForm}
          </Button>
        </CSVLink>
  );
};
