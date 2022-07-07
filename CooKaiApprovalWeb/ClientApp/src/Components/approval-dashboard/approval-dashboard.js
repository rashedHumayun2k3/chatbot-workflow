/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import * as moment from 'moment';
import {
  Dropdown,
  DropdownMenuItemType,
} from 'office-ui-fabric-react/lib/Dropdown';
// import { useHistory } from 'react-router-dom';
import CalendarIcon from '@material-ui/icons/Today';
import DropDownIcon from '@material-ui/icons/Subject';
import CreateRequest from '../create-request/create-request';
import RequestStatistics from '../request-statistics/request-statistics';
import RequestList from '../request-list/request-list';
import Laguage from '../utility/Language';
import {
  getLatestDropdownStatus,
  getRequestList,
  getStatsRequest,
  resetRequestListAction,
  setCurrentStatusIdInReducer,
} from '../../actions/dashboard-actions';
import {
  setRequestInsertActionStatus,
  saveSelectedTemplateIntoRedux,
  storeFileData,
} from '../../actions/request-actions';
import {
  setApprovedRequestStatusNull,
  setRejectedRequestStatusNull,
  setApprovedRejectedRequestStatusNull,
  setSelectedRequestTitleInReducer,
} from '../../actions/request-details-actions';
import FixedPhraseRegistrationContainer from '../fixed-phrase-template/fixed-phrase-template-container';
import { setTemplateCreatingMode } from '../../actions/template-actions';
import { ExportCSV } from '../utility/ExportCSV';

const ApprovalDashboard = () => {
  const {
    latestStatusId,
    requestList,
    // isLoading,
    successMsg,
    stopScrolling,
    isListLoading,
  } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();
  const [loggedInUser, setLoggedInUser] = useState([]);
  const [requestitems, setRequestitems] = useState([]);
  const [selectedLang] = useState(Laguage.jap);
  const [
    createRequestFormVisible,
    setCreateRequestFormVisible,
  ] = React.useState(false);
  const [startdate, setStartdate] = React.useState(
    new Date(new Date().setDate(new Date().getDate() - 30)),
  );
  const [enddate, setEnddate] = React.useState(new Date());
  const [selectedStatus, SetSelectedStatus] = React.useState();
  const [showSpinner, SetShowSpinner] = React.useState(false);
  const [pageIndex, SetPageIndex] = React.useState(1);

  const [successMessage, setSuccessMessage] = React.useState('');
  const [failedMessage, setFailedMessage] = React.useState('');
  const shouldUpdateTheRequetList = false;
  const toggleCreateRequestModal = () => {
    saveSelectedTemplateIntoRedux(dispatch, null);
    storeFileData(dispatch, []);
    setCreateRequestFormVisible(!createRequestFormVisible);
  };
  const [
    shouldOpenFixedPhraseModal,
    setShouldOpenFixedPhraseModal,
  ] = React.useState(false);
  // const history = useHistory();
  const onFormatDate = (date) => `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  const searchBydaterange = () => {
    resetRequestListAction(dispatch);
    setRequestitems([]);
    SetShowSpinner(true);
    SetPageIndex(1);
    getRequestList(
      dispatch,
      JSON.parse(loggedInUser).currentLoggedInUserPrincipal,
      onFormatDate(startdate),
      onFormatDate(enddate),
      selectedStatus,
      0,
    );
  };
  // const dropdownStyles = { dropdown: { width: 150, border: '1px solid #007CC6' } };
  const dropdownStyles = {
    dropdownItemHeader: {
      fontWeight: 'bold !important',
      fontSize: '14px',
      color: '#333333',
      lineHeight: '28px',
      height: '28px',
    },
    dropdown: {
      width: 180,
      color: '#828282',
      selectors: {
        '& :hover': {
          borderColor: '#087bc6 !important', // drop-down box hover
        },
        '&:active': {
          color: 'red !important', // drop-down box hover
        },
      },
    },
    dropdownItemsWrapper: { height: '314px' },
    dropdownItem: {
      fontWeight: 'normal !important',
      fontSize: '14px !important',
      color: '#333333',
      minHeight: '28px !important',
    },
    dropdownItems: {
      selectors: {
        '& :hover': {
          backgroundColor: '#E7F2FA !important', // item hover
        },
      },
    },
    dropdownItemSelected: {
      background: '#ffffff',
      color: '#0E7BC6',
      fontSize: '14px !important',
      minHeight: '28px',
    },
    title: { borderColor: '#e5e5e5', height: 40, paddingTop: 5 },
    caretDown: { paddingTop: 5, color: '#828282' },
  };

  const dropdownControlledExampleOptions = [
    {
      key: 'requesterHeader',
      text: selectedLang.MeAsApplication,
      itemType: DropdownMenuItemType.Header,
    },
    { key: 'divider_1', text: '-', itemType: DropdownMenuItemType.Divider },
    { key: '1', text: selectedLang.AllRequest, data: { icon: 'Memo' } },
    { key: '2', text: selectedLang.AwaitingApproval, data: { icon: 'Memo' } },
    { key: '3', text: selectedLang.ApprovedApproval, data: { icon: 'Memo' } },
    { key: '4', text: selectedLang.RejectedApproval, data: { icon: 'Memo' } },
    { key: 'divider_2', text: '-', itemType: DropdownMenuItemType.Divider },
    {
      key: 'approverHeader2',
      text: selectedLang.MeAsApprover,
      itemType: DropdownMenuItemType.Header,
    },
    { key: 'divider_3', text: '-', itemType: DropdownMenuItemType.Divider },
    { key: '5', text: selectedLang.AllRequestTome, data: { icon: 'Memo' } },
    { key: '6', text: selectedLang.PendingApproval, data: { icon: 'Memo' } },
    { key: '7', text: selectedLang.Responded, data: { icon: 'Memo' } },
    { key: 'divider_4', text: '-', itemType: DropdownMenuItemType.Divider },
    {
      key: 'approverHeader3',
      text: selectedLang.MeAsReader,
      itemType: DropdownMenuItemType.Header,
    },
    { key: 'divider_5', text: '-', itemType: DropdownMenuItemType.Divider },
    {
      key: '8',
      text: selectedLang.AllRequesterasReader,
      data: { icon: 'Memo' },
    },
  ];
  const [selectedItem, setSelectedItem] = React.useState();

  const onChange = (event, item) => {
    resetRequestListAction(dispatch);
    setRequestitems([]);
    SetShowSpinner(true);
    setSelectedItem(item);
    SetSelectedStatus(item.key);
    SetPageIndex(1);
    getRequestList(
      dispatch,
      JSON.parse(loggedInUser).currentLoggedInUserPrincipal,
      onFormatDate(startdate),
      onFormatDate(enddate),
      item.key,
      0,
    );
    setCurrentStatusIdInReducer(dispatch, Number(item.key));
  };

  const onRenderTitle = (options) => {
    const option = options[0];

    return (
      <div>
        {option.data && option.data.icon && (
          <DropDownIcon className="dropdownicon" />
          // <Icon style={{ marginRight: '4px' }} iconName='CheckListTextMirrored' aria-hidden="true" title='CheckListTextMirrored' />
        )}
        <span>{option.text}</span>
      </div>
    );
  };
  const getRequestListOnScrolling = (e) => {
    const element = e.target;
    if (
      element.scrollHeight - element.scrollTop - 2 < element.clientHeight
      && element.className === 'ms-DetailsList-contentWrapper'
      && !stopScrolling
      && !isListLoading
    ) {
      SetShowSpinner(true);
      SetPageIndex(pageIndex + 1);
      getRequestList(
        dispatch,
        JSON.parse(loggedInUser).currentLoggedInUserPrincipal,
        onFormatDate(startdate),
        onFormatDate(enddate),
        selectedStatus,
        pageIndex,
      );
    }
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

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    getLatestDropdownStatus(
      dispatch,
      JSON.parse(currentUser).currentLoggedInUserPrincipal,
    );
    setLoggedInUser(currentUser);
  }, []);

  useEffect(() => {}, [selectedStatus]);

  useEffect(() => {
    if (!isListLoading) {
      SetShowSpinner(false);
    }
  }, [isListLoading]);

  useEffect(() => {
    if (latestStatusId) {
      SetSelectedStatus(latestStatusId);
      SetPageIndex(1);
      getRequestList(
        dispatch,
        JSON.parse(loggedInUser).currentLoggedInUserPrincipal,
        onFormatDate(startdate),
        onFormatDate(enddate),
        latestStatusId,
        0,
      );
    }
  }, [latestStatusId]);

  useEffect(() => {
    if (requestList) {
      setRequestitems(requestList);
      SetShowSpinner(isListLoading);
    }
  }, [requestList]);
  const [csvPreparedData, setCsvPreparedData] = useState([]);
  const [isSuccessOperation, setIsSuccessOperation] = useState(false);
  const [showToaster, setShowToaster] = useState(false);
  const { requestInsertStatusCode } = useSelector((state) => state.request);
  const {
    approvedStatusCode,
    selectedRequestTitle,
    rejectedStatusCode,
    approvedRejectStatusCode,
  } = useSelector((state) => state.request);

  //
  // Delete Toast message
  //
  useEffect(() => {
    if (successMsg || successMsg === '') {
      getStatsRequest(
        dispatch,
        JSON.parse(loggedInUser).currentLoggedInUserPrincipal,
      );
      setShowToaster(true);
      if (successMsg === '') {
        const fullMessageToShow = selectedLang.MessagePrefix
          + selectedRequestTitle
          + selectedLang.MessagePostfix
          + selectedLang.WasDeleted;
        setSuccessMessage(fullMessageToShow);
        setIsSuccessOperation(true);
      } else {
        const fullMessageToShow = selectedLang.MessagePrefix
          + selectedRequestTitle
          + selectedLang.MessagePostfix
          + selectedLang.CouldNotApply;
        setFailedMessage(fullMessageToShow);
        setIsSuccessOperation(false);
      }
      setTimeout(() => {
        setShowToaster(false);
        setRequestInsertActionStatus(dispatch, null);
        setSelectedRequestTitleInReducer(dispatch, null);
      }, 3000);
    } else {
      setShowToaster(false);
    }
  }, [successMsg]);

  /* const routeForCreateRequest = () => {
    history.push('/create-request');
  }; */

  const hideToaster = () => {
    setShowToaster(false);
  };

  //
  // Toast message for Generic
  //
  const commonForShowToaster = (
    statusCode,
    toastSuccessMessage,
    toastFailedMessage,
  ) => {
    setShowToaster(true);
    if (statusCode === 200) {
      getStatsRequest(
        dispatch,
        JSON.parse(loggedInUser).currentLoggedInUserPrincipal,
      );
      setSuccessMessage(toastSuccessMessage);
      setIsSuccessOperation(true);
    } else {
      setFailedMessage(toastFailedMessage);
      setIsSuccessOperation(false);
    }
    setTimeout(() => {
      setShowToaster(false);
      setApprovedRequestStatusNull(dispatch);
      setRejectedRequestStatusNull(dispatch);
      setApprovedRejectedRequestStatusNull(dispatch);
      setSelectedRequestTitleInReducer(dispatch, null);
      setRequestInsertActionStatus(dispatch, null);
    }, 3000);
  };

  //
  // Create Request
  //
  useEffect(() => {
    if (requestInsertStatusCode) {
      const toastSuccessMessage = selectedLang.MessagePrefix
        + selectedRequestTitle
        + selectedLang.MessagePostfix
        + selectedLang.IAppliedForIt;
      const toastFailedMessage = selectedLang.MessagePrefix
        + selectedRequestTitle
        + selectedLang.MessagePostfix
        + selectedLang.CouldNotApply;
      commonForShowToaster(
        requestInsertStatusCode,
        toastSuccessMessage,
        toastFailedMessage,
      );
    } else {
      setShowToaster(false);
    }
  }, [requestInsertStatusCode]);

  //
  // Message Generate for toaster
  //
  const toasterMessageCreateAndShow = (
    approvedOrRejectStatusCode,
    commonMessage,
  ) => {
    const fullMessageToShow = selectedLang.MessagePrefix
      + selectedRequestTitle
      + selectedLang.MessagePostfix
      + commonMessage;
    commonForShowToaster(approvedOrRejectStatusCode, fullMessageToShow, null);
  };

  //
  // Approved Toaster
  //
  useEffect(() => {
    if (approvedStatusCode) {
      toasterMessageCreateAndShow(
        approvedStatusCode,
        selectedLang.ApprovalMessage,
      );
    } else {
      setShowToaster(false);
    }
  }, [approvedStatusCode]);

  //
  // Reject Toaster
  //
  useEffect(() => {
    if (rejectedStatusCode) {
      toasterMessageCreateAndShow(
        rejectedStatusCode,
        selectedLang.RejectedMessage,
      );
    } else {
      setShowToaster(false);
    }
  }, [rejectedStatusCode]);

  //
  // Approve-Reject Both failed
  //
  useEffect(() => {
    if (approvedRejectStatusCode && approvedRejectStatusCode !== 200) {
      const fullMessageToShow = selectedLang.MessagePrefix
        + selectedRequestTitle
        + selectedLang.MessagePostfix
        + selectedLang.ApproveRejectError;
      commonForShowToaster(approvedRejectStatusCode, null, fullMessageToShow);
    }
  }, [approvedRejectStatusCode]);

  const { requestEditStatusCode } = useSelector((state) => state.request);
  useEffect(() => {
    if (requestEditStatusCode === 200) {
      getStatsRequest(
        dispatch,
        JSON.parse(loggedInUser).currentLoggedInUserPrincipal,
      );
    }
  }, [requestEditStatusCode]);

  const openFixedPhraseTemplate = () => {
    setShouldOpenFixedPhraseModal(true);
    setTemplateCreatingMode(dispatch, true);
  };

  //FOR CSV
  useEffect(() => {
    if (requestitems && requestitems.length > 0) {
      const csvPreparedDataArray = [];
      requestitems.forEach((requestDetails) => {
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
          let previousApproverNameList = '';
          if (requestDetails.ApprovalStatus === true) {
            requestDetails.CurrentLevelDetails.ApproverList.sort((a, b) => (a.ResponseDate === null) - (b.ResponseDate === null) || -(a.ResponseDate > b.ResponseDate) || +(a.ResponseDate < b.ResponseDate)).forEach((approverObj, i) => {
              if (i === 0) {
                // console.log(requestDetails.Title, moment(approverObj.ResponseDate).format('YYYY年 MM月 D日 HH:mm'));
                previousApproverNameList = `${approverObj.Name}`;
              }
            });
          }

          const prepareData = {
            申請ID: requestDetails.Id,
            申請日時: requestDetails.RequestDate && moment(requestDetails.RequestDate).format('YYYY年 MM月 D日 HH:mm'),
            申請者: requestDetails.RequestCreator.Name,
            タイトル: requestDetails.Title,
            本文: requestDetails.Details,
            備考: remarksListStr,
            添付ファイル: attachmentListStr,
            ステータス: finalApprovalStatus,
            最終承認者: previousApproverNameList,
            最終承認日時: requestDetails.CurrentLevelDetails.ResponseDate && moment(requestDetails.CurrentLevelDetails.ResponseDate).format('YYYY年 MM月 D日 HH:mm'),
          };
          csvPreparedDataArray.push(prepareData);
        }
        console.log(csvPreparedDataArray);
        setCsvPreparedData(csvPreparedDataArray);
      });
      console.log(requestitems);
    }
  }, [requestitems]);

  return (
    <div>
      <Fabric>
        <div className="topControlsWrapper">
          <div>
            <div className="request-btn btn padding-right-10">
              <button
                className="vanilla-button card-button order-1 red-color-light"
                onClick={() => toggleCreateRequestModal(shouldUpdateTheRequetList)
                }
              >
                <span className="button-label">
                  <Icon iconName="CalculatorAddition" />
                  {selectedLang.CreateRequest}{' '}
                </span>
              </button>
            </div>
            <div className="request-btn btn">
              <button
                className="vanilla-button card-button order-1 red-color-light"
                onClick={() => openFixedPhraseTemplate()}
              >
                <span className="button-label">
                  {selectedLang.TemplateManagement}{' '}
                </span>
              </button>
            </div>
          </div>

          <div className="Dashboard-container">
            {' '}
            <span> {selectedLang.Dashboard}</span>{' '}
          </div>
        </div>
        {showToaster === true ? (
          <div
            className={`toaster ${
              isSuccessOperation ? 'toaster-success' : 'toaster-failed'
            }`}
          >
            <div className="toaster-child flex">
              <div className="text-inside-toaster">
                {isSuccessOperation ? successMessage : failedMessage}
              </div>
              <div className="toaster-cross-button-container">
                <Icon
                  className="toaster-cross-button"
                  iconName="Cancel"
                  onClick={() => hideToaster()}
                />
              </div>
            </div>
          </div>
        ) : null}

        {<RequestStatistics/>}
        <div className="requestListContainer">
          <div className="requestSearchContainer">
            {selectedStatus && (
              <div className="searchWrapper">
                <Dropdown
                  selectedKey={
                    selectedItem ? selectedItem.key : selectedStatus.toString()
                  }
                  onChange={onChange}
                  onRenderTitle={onRenderTitle}
                  options={dropdownControlledExampleOptions}
                  styles={dropdownStyles}
                />
              </div>
            )}
            <div className="searchbydaterangebox">
              <CalendarIcon className="calendar" />{' '}
              <label>{selectedLang.SearchByDateRange}</label>
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
                onSelectDate={(date) => setStartdate(date)}
              />
              <div className="to">~</div>
              <DatePicker
                className="dateControl endDateControl"
                firstWeekOfYear={1}
                showMonthPickerAsOverlay={true}
                showGoToToday={false}
                placeholder="end date"
                ariaLabel="end date"
                value={enddate}
                formatDate={onFormatDate}
                strings={DayPickerStrings}
                onSelectDate={(date) => setEnddate(date)}
              />
              <div className="search-btn btn">
                <button className="vanilla-button card-button">
                  <span
                    className="button-label"
                    onClick={() => searchBydaterange()}
                  >
                    {selectedLang.Search}
                  </span>
                </button>
              </div>
              <div className="export-button-container">
                  <ExportCSV csvData={csvPreparedData} fileName={`ApprovalHistory_ ${moment(new Date()).format('DD-MMM-YYYY-hh-mm-ss')}.CSV`}/>
              </div>
            </div>
          </div>
          <div onScroll={(e) => getRequestListOnScrolling(e)}>
            {
              <RequestList
                requestitems={requestitems}
                showSpinner={showSpinner}
              />
            }
          </div>
        </div>
      </Fabric>

      {createRequestFormVisible ? (
        <CreateRequest
          createRequestFormVisible={createRequestFormVisible}
          toggleCreateRequestModal={toggleCreateRequestModal}
          inAppUse={true}
        />
      ) : null}
      {shouldOpenFixedPhraseModal ? (
        <FixedPhraseRegistrationContainer
          open={shouldOpenFixedPhraseModal}
          setOpen={setShouldOpenFixedPhraseModal}
        />
      ) : null}
    </div>
  );
};
export default ApprovalDashboard;
