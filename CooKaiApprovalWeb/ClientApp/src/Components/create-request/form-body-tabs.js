import React, { useState, useEffect } from 'react';
import {
  Box, Tab, AppBar, Tabs,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import clsx from 'clsx';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { mergeStyleSets, getTheme, FontWeights } from 'office-ui-fabric-react';
import { FontSizes } from '@uifabric/styling';
import Laguage from '../utility/Language';
import TeamTextField from '../utility/TeamTextField';
import ShowDateTime from './show-datetime';
import ShowUserAvatar from './show-user-avatar';
import TemplateDropdownList from './template-dropdown';
import FileUploader from './file-upload';
import ApprovovalSteps from '../approval-steps/approval-steps';
import ConstantValue from '../utility/constantValue';
import { saveSelectedTemplateIntoRedux } from '../../actions/request-actions';

export function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className="padding-0" p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}
export function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const theme = getTheme();
const contentStyles = mergeStyleSets({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
    borderRadius: 3,
    height: '100%',
    maxHeight: 566,
    width: 990,
    selectors: {
      '@media only screen and (max-device-width: 1600px) and (max-device-height: 900px)': {
        maxHeight: 624,
        width: 990,
      },
      '@media only screen and (max-device-height: 800px)': {
        maxHeight: 490,
        width: 990,
      },
      '@media only screen and (max-device-width: 1366px) and (max-device-height: 768px)': {
        maxHeight: 490,
        width: 990,
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
});

const FormBodyTabs = (props) => {
  const {
    setTitleName,
    // setSelectedTemplate,
    setDetails,
    ddlTemplateOptions,
    showApproverReaderModal,
    setShowApproverReaderModal,
    // setFileDatalist,
    titleName,
    requestCreator,
    templateList,
    details,
    selectedTemplate,
    remarksValue,
    setDesiredCompletionDate,
  } = props;
  const { selectApproverReaderTemp, selectedTemplateFromUser } = useSelector(
    (state) => state.request,
  );
  const [tabValue, setTabValue] = useState(0);
  const [selectedLang] = useState(Laguage.jap);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const onChangeTitle = (event, value) => {
    setTitleName(value);
  };
  const dispatch = useDispatch();
  const setSelectedTemplateFromDDL = (item) => {
    if (item.key === ConstantValue.emptyGuid) {
      saveSelectedTemplateIntoRedux(dispatch, null);
    } else if (templateList && templateList.length > 0) {
      const selectedItem = templateList.find(
        (element) => element.Id === item.key,
      );
      saveSelectedTemplateIntoRedux(dispatch, selectedItem);
    }
  };

  const onChangeDetails = (event, value) => {
    setDetails(value);
  };


  const onRemarksValueChanged = (remarksText) => {
    props.onRemarksValueChangeFinished(remarksText);
  };
  const { requestDetails } = useSelector((state) => state.request);
  useEffect(() => {
    if (requestDetails) {
      const selectedItem = {
        key: requestDetails.TemplateId,
      };
      setSelectedTemplateFromDDL(selectedItem);
    }
  }, [requestDetails]);

  const showAddApproverButton = () => {
    if (!isEmpty(selectedTemplateFromUser)) {
      return false;
    }
    return true;
  };

  const [startdate, setStartdate] = React.useState(new Date());
  const onFormatDate = (date) => `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  const setDesiredDateFromDatePicker = (date) => {
    setDesiredCompletionDate(date);
    setStartdate(date);
  };
  const DayPickerStrings = {
    months: [
      '1 /',
      '2 /',
      '3 /',
      '4 /',
      '5 /',
      '6 /',
      '7 /',
      '8 /',
      '9 /',
      '10 /',
      '11 /',
      '12 /',
    ],

    shortMonths: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],

    days: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],

    shortDays: [
      selectedLang.Sunday,
      selectedLang.Monday,
      selectedLang.Tuesday,
      selectedLang.Wednessday,
      selectedLang.Thursday,
      selectedLang.Friday,
      selectedLang.Saturday,
    ],

    goToToday: 'Go to today',
    prevMonthAriaLabel: 'Go to previous month',
    nextMonthAriaLabel: 'Go to next month',
    prevYearAriaLabel: 'Go to previous year',
    nextYearAriaLabel: 'Go to next year',
  };
  return (
    <>
      <AppBar position="static" className="tab-header">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="simple tabs example"
        >
          <Tab label={selectedLang.AppBarBody} {...a11yProps(0)} />
          <Tab label={selectedLang.AppBarAttachementRemarks} {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <div className="create-form-body-parent">
          <div className="create-form-body-child">
            <div style={{ display: 'flex' }}>
              <div style={{ width: '60%' }}>
                <div style={{ paddingRight: '40px' }}>
                  <div>
                    <div>
                      <div className="flex">
                        <Label className={contentStyles.labelStyle}>
                          {selectedLang.Title}
                        </Label>
                        <div className="required">
                          {selectedLang.RequiredWithUnicode}
                        </div>
                      </div>
                      <TeamTextField
                        value={titleName}
                        onChangeTextField={onChangeTitle}
                        placeholder={selectedLang.TitlePlaceHolder}
                        className={contentStyles.titleTextField}
                      />
                    </div>
                    <div>
                      <div className="group-container">
                        <div className="common-title-value flex">
                          <div className="detail-label width-100px">
                            <Label className={contentStyles.labelStyle}>
                              {selectedLang.RequestCreateDate}
                            </Label>
                          </div>
                          <div className="non-editable-color date-container width-calc-100px">
                            <ShowDateTime dateTimeValue={new Date()} />
                          </div>
                        </div>
                        <div className="common-title-value flex">
                          <div className="detail-label width-100px">
                            <Label className={contentStyles.labelStyle}>
                              {selectedLang.RequestCreator}
                            </Label>
                          </div>
                          <ShowUserAvatar
                            requestCreator={requestCreator}
                            IsNonEditable={true}
                          />
                        </div>
                        <div className="common-title-value flex margin-bottom-5px">
                          <div className="detail-label width-100px">
                            <Label className={contentStyles.labelStyle}>
                              {selectedLang.DesiredCompletionDate}
                            </Label>
                          </div>
                          <div className='calendar-container'>
                            <div className='requestSearchContainer'>
                              <DatePicker
                                  className="dateControl"
                                  firstWeekOfYear={1}
                                  showMonthPickerAsOverlay={true}
                                  placeholder="start date"
                                  ariaLabel="start date"
                                  value={startdate}
                                  showGoToToday={false}
                                  formatDate={onFormatDate}
                                  strings={DayPickerStrings}
                                  // onSelectDate={(date) => setStartdate(date)}
                                  onSelectDate={(date) => setDesiredDateFromDatePicker(date)}
                                />
                            </div>
                          </div>

                        </div>
                        <TemplateDropdownList
                          contentStyles={contentStyles}
                          getSelectedTemplate={setSelectedTemplateFromDDL}
                          ddlTemplateOptions={ddlTemplateOptions}
                          selectedTemplate={selectedTemplate}
                        />
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <div className="details-text-area hundred-percent text-area-create-page">
                      <TeamTextField
                        className="request-details-text-area"
                        isMultiline={true}
                        noOfRows={13}
                        isResizable={false}
                        value={details}
                        onChangeTextField={onChangeDetails}
                        placeholder={selectedLang.DetailsPlaceHolder}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ width: '40%' }}>
                {showAddApproverButton() && (
                  <div className="display-inline">
                    <input
                      className={clsx([
                        'modal_create_button button-blue',
                        'longer-width-0',
                        {
                          'button-active-blue':
                            selectApproverReaderTemp.length < 5,
                        },
                        {
                          'button-inactive':
                            selectApproverReaderTemp.length >= 5,
                        },
                      ])}
                      type="button"
                      value={selectedLang.BtnAddApprover}
                      title={selectedLang.BtnAddApprover}
                      onClick={() => setShowApproverReaderModal(true)}
                      disabled={selectApproverReaderTemp.length >= 5}
                    />
                  </div>
                )}
                <ApprovovalSteps
                  isMobileLayout={true}
                  fromCreateRequest={true}
                  showApproverReaderModal={showApproverReaderModal}
                  setShowApproverReaderModal={setShowApproverReaderModal}
                  selectedTemplate={selectedTemplate}
                />
              </div>
            </div>
          </div>
        </div>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <FileUploader
          // onFileUploadFinished={fileUploadFromChild}
          onRemarksValueChangeFinished={onRemarksValueChanged}
          remarksValue={remarksValue}
        />
      </TabPanel>
    </>
  );
};

export default FormBodyTabs;
