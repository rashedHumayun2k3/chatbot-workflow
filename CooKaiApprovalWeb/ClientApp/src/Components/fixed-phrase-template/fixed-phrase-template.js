// @flow
import { FontSizes } from '@uifabric/styling';
import {
  FontWeights,
  getTheme,
  Label,
  mergeStyleSets,
  Modal,
} from 'office-ui-fabric-react';
import { getId } from 'office-ui-fabric-react/lib/Utilities';
import * as React from 'react';
import { useState } from 'react';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import {
  AppBar,
  Box,
  Button,
  Grid,
  makeStyles,
  Tab,
  Tabs,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import Laguage from '../utility/Language';
import TeamTextField from '../utility/TeamTextField';
import ApprovovalSteps from '../approval-steps/approval-steps';
import { setTemplateCreatingMode } from '../../actions/template-actions';
import { a11yProps, TabPanel } from '../create-request/form-body-tabs';
import TemplateListContainer from './template-list/template-list-container';

type Props = {
  open: boolean,
  setOpen: (((boolean) => boolean) | boolean) => void,
  saveTemplate: Function,
  templateName: string,
  onChangeTitle: Function,
  botContext: any,
  templateBody: string,
  onChangeTemplateBody: Function,
  invalid: boolean,
  showApproverReaderModal: boolean,
  setShowApproverReaderModal: Function,
  totalStepList: number,
};

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

const FixedPhraseRegistration = (props: Props): React.Node => {
  const {
    open,
    setOpen,
    saveTemplate,
    templateName,
    botContext,
    onChangeTitle,
    templateBody,
    onChangeTemplateBody,
    invalid,
    showApproverReaderModal,
    setShowApproverReaderModal,
    totalStepList,
  } = props;
  const titleId = getId('FixedPhraseModal');
  const subtitleId = getId('FixedPhraseModalSubText');
  const [selectedLang] = React.useState(Laguage.jap);
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // style
  const theme = getTheme();
  const contentStyles = mergeStyleSets({
    container: {
      display: 'flex',
      flexFlow: 'column nowrap',
      alignItems: 'stretch',
      borderRadius: 3,
      height: 'auto',
      maxHeight: 600,
      width: 850,
      selectors: {
        '@media only screen and (max-device-width: 1600px) and (max-device-height: 900px)': {
          maxHeight: 600,
          width: 995,
        },
        '@media only screen and (max-device-height: 800px)': {
          maxHeight: 520,
          width: 995,
        },
        '@media only screen and (max-device-width: 1366px) and (max-device-height: 768px)': {
          maxHeight: 520,
          width: 995,
        },
      },
    },
    header: [
      theme.fonts.xLargePlus,
      {
        flex: '1 1 auto',
        borderTop: `4px solid ${theme.palette.themePrimary}`,
        color: theme.palette.neutralPrimary,
        display: 'flex',
        fontSize: FontSizes.xLarge,
        alignItems: 'center',
        fontWeight: FontWeights.semibold,
        padding: '12px 12px 14px 24px',
      },
    ],
    body: {
      flex: '4 4 auto',
      padding: '0 24px 24px 24px',
      overflowY: 'hidden',
      selectors: {
        p: {
          margin: '14px 0',
        },
        'p:first-child': {
          marginTop: 0,
        },
        'p:last-child': {
          marginBottom: 0,
        },
      },
    },
    labelStyle: {
      fontWight: 'normal',
      fontSize: '14px',
      fontFamily: 'Roboto',
      fontWeight: 400,
      color: '#828282',
    },
    titleTextField: {
      borderColor: 'red',
      borderWidth: '0px 0px 2px',
      color: 'red',
    },
    templateBody: {
      border: '1px solid #e5e5e5 !important',
    },
  });

  const dispatch = useDispatch();
  const hideModal = () => {
    setOpen(false);
    setTemplateCreatingMode(dispatch, false);
  };
  return (
    <>
      <Modal
        titleAriaId={titleId}
        subtitleAriaId={subtitleId}
        isOpen={open}
        isBlocking={false}
        containerClassName={contentStyles.container}
        dragOptions={undefined}
        allowTouchBodyScroll={false}
        className={!botContext ? 'general-modal' : 'bot-context-modal'}
      >
        <div className={`modal-header ${!botContext ? 'show-header' : 'hide'}`}>
          <span className="modal-title" id={titleId}>
            {selectedLang.TemplateManagement}
          </span>
          {!botContext && (
              <div
                  className="close-icon-text flex text-with-icon"
                  onClick={hideModal}
              >
                <div className="top-close-button">
                  <Icon iconName="Cancel" />
                </div>
                <span className="close-text">{selectedLang.Close}</span>
              </div>
          )}
        </div>
        <AppBar position="static" className="tab-header">
          <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="simple tabs example"
          >
            <Tab label={selectedLang.CreateTemplate} {...a11yProps(0)} />
            <Tab label={selectedLang.TemplateList} {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={tabValue} index={0}>
          <div className="create-form-body-parent template-modal-body">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={3}>
                    <Box display="flex">
                      <Label className={contentStyles.labelStyle}>
                        {selectedLang.templateName}
                      </Label>
                      <div className="required">
                        {selectedLang.RequiredWithUnicode}
                      </div>
                    </Box>
                  </Grid>
                  <Grid item xs={9}>
                    <TeamTextField
                        value={templateName}
                        onChangeTextField={onChangeTitle}
                        placeholder={selectedLang.TitlePlaceHolder}
                        className={contentStyles.titleTextField}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={3}>
                    <Box>
                      <Label className={contentStyles.labelStyle}>
                        {selectedLang.TemplateBody}
                      </Label>
                    </Box>
                  </Grid>
                  <Grid item xs={9}>
                    <TeamTextField
                        value={templateBody}
                        onChangeTextField={onChangeTemplateBody}
                        placeholder={selectedLang.TemplateBodyPlaceholder}
                        styles={{
                          root: contentStyles.templateBody,
                        }}
                        isMultiline={true}
                        noOfRows={6}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={3}>
                    <Box display="flex">
                      <Label className={contentStyles.labelStyle}>
                        {selectedLang.TemplateApprover}
                      </Label>
                      <div className="required">
                        {selectedLang.RequiredWithUnicode}
                      </div>
                    </Box>
                  </Grid>
                  <Grid item xs={9}>
                    <div className="display-inline">
                      <input
                          className={clsx([
                            'modal_create_button',
                            'longer-width-0 ',
                            'margin-top-5',
                            { 'button-active-blue': totalStepList < 5 },
                            { 'button-inactive': totalStepList >= 5 },
                          ])}
                          type="button"
                          value={selectedLang.BtnAddApprover}
                          title={selectedLang.BtnAddApprover}
                          onClick={() => setShowApproverReaderModal(true)}
                          disabled={totalStepList >= 5}
                      />
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  <ApprovovalSteps
                      isMobileLayout={false}
                      fromCreateRequest={false}
                      showApproverReaderModal={showApproverReaderModal}
                      setShowApproverReaderModal={setShowApproverReaderModal}
                  />
                </Grid>
              </Grid>
            </Grid>
          </div>
          <Box pb={1.25} />
          <Box
              display="flex"
              justifyContent="flex-end"
              alignContent="flex-end"
              py={1.25}
              pr={1.25}
              borderTop={1.2}
              borderColor="#e5e5e5"
          >
            <Button
                className="longer-width-0 red-button button-active"
                classes={{
                  root: classes.buttonStyle,
                }}
                variant="contained"
                disabled={invalid}
                onClick={() => saveTemplate()}
            >
              {selectedLang.TemplateRegistration}
            </Button>
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
           <TemplateListContainer />
        </TabPanel>
      </Modal>
    </>
  );
};

export default FixedPhraseRegistration;
