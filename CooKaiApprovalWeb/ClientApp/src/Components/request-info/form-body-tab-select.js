import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Tab, AppBar, Tabs,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { mergeStyleSets, getTheme, FontWeights } from 'office-ui-fabric-react';
import { FontSizes } from '@uifabric/styling';
import * as moment from 'moment';
import Laguage from '../utility/Language';
import EditRequest from './edit-request';
import ShowDateTime from '../create-request/show-datetime';
import ShowOnlyDate from '../create-request/show-onlyDate';
import ShowUserAvatar from '../create-request/show-user-avatar';
import ApproverReaderUserList from './approver-reader-users';
import TabAttachmentRemarks from '../attachment-remarks/tab-attachment-remarks';
import { storeFileData, saveSelectedTemplateIntoRedux } from '../../actions/request-actions';
import ApprovalHistoryContainer from './approval-history-container';
import ConstantValue from '../utility/constantValue';
import { ExportCSV } from '../utility/ExportCSV';

function TabPanel(props) {
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

function a11yProps(index) {
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

const FormBodyTabsSelect = (props) => {
  const {
    requestInfo,
    userCurrentMode,
    userMode,
    requestCreator,
    requestAttachment,
    approvarListDetails,
    readerListDetails,
    totalAttachmentByte,
  } = props;
  const [tabValue, setTabValue] = useState(0);
  const [selectedLang] = useState(Laguage.jap);
  const [csvPreparedData, setCsvPreparedData] = useState([]);
  const [requestRemarks, setRequestRemarks] = useState([]);
  const [attachmentList, setAttachmentList] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const bindApproverAndViewer = (title, userList, isApprover) => (
    <ApproverReaderUserList
      userList={userList}
      title={title}
      isApprover={isApprover}
    />
  );

  const dispatch = useDispatch();
  const { requestDetails, templateList } = useSelector((state) => state.request);
  useEffect(() => {
    if (requestDetails) {
      const fileAttachmentForDetails = [];
      let attachmentListStr = '';
      if (requestDetails.Attachments && requestDetails.Attachments.length > 0) {
        requestDetails.Attachments.forEach((element) => {
          const {
            FileId,
            FileName,
            FileUrl,
            FileSize,
            IsDeletable,
            Created,
            CreatedBy,
          } = element;
          const fileObject = {
            uniqueId: FileId,
            id: FileId,
            name: FileName,
            webUrl: null,
            size: FileSize,
            BlobUrl: FileUrl,
            IsDeletable,
            Created,
            CreatedBy,
          };
          fileAttachmentForDetails.push(fileObject);
          const { Name } = CreatedBy;
          const formatedDateAtt = moment(CreatedBy.Created).format('YYYY年 MM月 D日 HH:mm');
          attachmentListStr = `${Name}(${formatedDateAtt}):${FileName} \r\n ${attachmentListStr}`;
        });
      }
      storeFileData(dispatch, fileAttachmentForDetails);
      let remarksListStr = '';
      if (requestDetails.RequestRemarks && requestDetails.RequestRemarks.length > 0) {
        requestDetails.RequestRemarks.forEach((element) => {
          const { Remark, CreatedBy } = element;
          const formatedDateRemarks = moment(CreatedBy.Created).format('YYYY年 MM月 D日 HH:mm');
          remarksListStr = `${CreatedBy.Name}(${formatedDateRemarks}):${Remark} \r\n ${remarksListStr}`;
        });
      }

      let finalApprovalStatus = selectedLang.PendingApproval;
      if (requestDetails.ApprovalStatus === true) {
        finalApprovalStatus = selectedLang.ApprovedApproval;
      } else if (requestDetails.ApprovalStatus === false) {
        finalApprovalStatus = selectedLang.RejectedApproval;
      }

      const prepareData = [{
        申請ID: requestDetails.Id,
        申請日時: requestDetails.RequestDate && moment(requestDetails.RequestDate).format('YYYY年 MM月 D日 HH:mm'),
        申請者: requestDetails.RequestCreator.Name,
        タイトル: requestDetails.Title,
        本文: requestDetails.Details,
        備考: remarksListStr,
        添付ファイル: attachmentListStr,
        ステータス: finalApprovalStatus,
        最終承認日時: requestDetails.CurrentLevelDetails.ResponseDate && moment(requestDetails.CurrentLevelDetails.ResponseDate).format('YYYY年 MM月 D日 HH:mm'),
      }];
      setCsvPreparedData(prepareData);
    }
  }, [requestDetails]);

  useEffect(() => {
    if (templateList && requestDetails && templateList.length > 0 && requestDetails.TemplateId !== ConstantValue.emptyGuid) {
      const selectedItem = templateList.find(
        (element) => element.Id === requestDetails.TemplateId,
      );
      saveSelectedTemplateIntoRedux(dispatch, selectedItem);
    }
  }, [templateList, requestDetails]);

  return (
    <>
      <AppBar position="static" className="tab-header">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="simple tabs example"
        >
          <Tab label={selectedLang.AppBarBody} {...a11yProps(0)} />
          <Tab
            label={selectedLang.AppBarAttachementRemarks}
            {...a11yProps(1)}
          />
          <Tab label={selectedLang.ApproverHistory} {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <div className="details-form-body-parent">
          <div className="details-form-body-child ">
            <div style={{ display: 'flex' }}>
              <div style={{ width: '75%' }}>
                <div style={{ paddingRight: '40px' }}>
                  <div style={{ width: '100%', display: 'flex' }}>
                    <div className="hundred-percent detail-title-container">
                      <Label className={contentStyles.title}>
                        {requestInfo.Title}
                      </Label>
                    </div>
                    <div>
                      {userCurrentMode === userMode.ONLY_EDIT
                      || userCurrentMode === userMode.EDIT_OR_DELETE ? (
                        <EditRequest requestInfoId={requestInfo.Id} />
                        ) : null}
                    </div>
                  </div>
                  <div className="flex details-area-container">
                    <div className="hundred-percent">
                      <div style={{ paddingRight: 24 }}>
                        <div style={{ paddingBottom: 24, paddingTop: 24 }}>
                          <div className="group-container flex">
                            <div className="detail-label width-seventyPx">
                              {selectedLang.RequestId}
                            </div>
                            <div className="detail-label-content">
                              {requestInfo.Id}
                            </div>
                          </div>
                          <div className="group-container flex">
                            <div className="detail-label width-seventyPx">
                              {' '}
                              {selectedLang.Requestedon}
                            </div>
                            <div className="detail-label-content">
                              <ShowDateTime
                                dateTimeValue={requestInfo.RequestDate}
                              />
                            </div>
                          </div>
                          <div className="group-container flex">
                            <div className="detail-label width-seventyPx">
                              {' '}
                              {selectedLang.DesiredCompletionDate}
                            </div>
                            <div className="detail-label-content">
                              {
                                requestInfo.DesiredCompletionDate &&
                                <ShowOnlyDate dateTimeValue={requestInfo.DesiredCompletionDate}/>
                              }
                            </div>
                          </div>
                          <div className="flex">
                            <div className="detail-label width-seventyPx">
                              {' '}
                              {selectedLang.ApplicantName}
                            </div>
                            <ShowUserAvatar requestCreator={requestCreator} />
                          </div>
                        </div>

                        <div
                          className={`label-biger details-text-area ${
                            requestAttachment.length > 0
                              ? 'label-with-attachment'
                              : ''
                          }`}
                          style={{
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {requestInfo.Details}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ width: '25%' }}>
                <div className="right-side-child">
                  <div className="title-bolder">{selectedLang.Approver}</div>
                  <div className="user-list-container">
                    {requestInfo.CurrentLevelDetails && requestInfo.CurrentLevelDetails.IsSingleApprover === true ? (
                      <div className="gap-approval-status">
                        {' '}
                        {selectedLang.justASingleApprovalForDetails}{' '}
                      </div>
                    ) : (
                      <div className="gap-approval-status">
                        {' '}
                        {selectedLang.needEveryOneApprovalForDetails}{' '}
                      </div>
                    )}
                  </div>
                  {bindApproverAndViewer(
                    selectedLang.Approver,
                    approvarListDetails,
                    true,
                  )}
                  <div className="title-bolder">
                    {readerListDetails && readerListDetails.length > 0
                      ? selectedLang.Reader
                      : null}
                  </div>
                  {bindApproverAndViewer(
                    selectedLang.Reader,
                    readerListDetails,
                    false,
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom-div">
          <div className="bottom-div-child">
             <ExportCSV csvData={csvPreparedData}
                fileName={`RequestDetails_ ${moment(new Date()).format('DD-MMM-YYYY-hh-mm-ss')}.CSV`}/>
          </div>
        </div>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <TabAttachmentRemarks
          requestAttachment={requestAttachment}
          totalAttachmentByte={totalAttachmentByte}
        />
      </TabPanel>
      <TabPanel index={2} value={tabValue}>
        <ApprovalHistoryContainer />
      </TabPanel>
    </>
  );
};

export default FormBodyTabsSelect;
