import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal,
  mergeStyleSets,
  getTheme,
  FontWeights,
  Icon,
} from 'office-ui-fabric-react';
import { FontSizes } from '@uifabric/styling';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Box } from '@material-ui/core';
import DeleteRequest from '../delete-request/delete-request';
import {
  getListRequestDetails,
  setRequestDetailsNull,
} from '../../actions/request-details-actions';
import Laguage from '../utility/Language';
import SubHeader from './sub-header';
import ApproveRejectComment from './add-comments';
import { getPictureFromGraphFromUserList } from '../../actions/auth-request-actions';
import FormBodyTabsSelect from './form-body-tab-select';
import {
  storeFileData,
  saveSelectedTemplateIntoRedux,
} from '../../actions/request-actions';

const RequestInfo = (params) => {
  const {
    createRequestFormVisible,
    toggleCreateRequestModal,
    requestItem,
  } = params;

  const theme = getTheme();
  const contentStyles = mergeStyleSets({
    container: {
      display: 'flex',
      flexFlow: 'column nowrap',
      alignItems: 'stretch',
      borderRadius: 3,
      height: '100%',
      maxHeight: 590,
      width: 990,
      selectors: {
        '@media only screen and (max-device-width: 1600px) and (max-device-height: 900px)': {
          maxHeight: 624,
          width: 990,
        },
        '@media only screen and (max-device-height: 800px)': {
          maxHeight: 520,
          width: 990,
        },
        '@media only screen and (max-device-height: 768px)': {
          maxHeight: 520,
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
    title: {
      fontWeight: 'normal',
      fontSize: '20px',
      fontFamily: 'Roboto',
      color: '#333333',
      padding: '0px 0px 24px',
      whiteSapce: 'nowrap',
    },
  });
  const iconButtonStyles = mergeStyleSets({
    root: {
      color: theme.palette.neutralPrimary,
      marginLeft: 'auto',
      marginTop: '4px',
      marginRight: '2px',
    },
    rootHovered: {
      color: theme.palette.neutralDark,
    },
  });

  const { requestDetails } = useSelector((state) => state.request);
  const { userInformation, stateLoggedInUser } = useSelector(
    (state) => state.auth,
  );
  const [requestInfo, setRequestInfo] = useState([]);
  const [requestCreator, setRequestCreator] = useState([]);
  const [requestAttachment, setRequestAttachment] = useState([]);
  const [totalAttachmentByte, setTotalAttachmentByte] = useState([]);
  const [approvarListDetails, setApprovarListDetails] = useState([]);
  const [readerListDetails, setReaderListDetails] = useState([]);
  const [
    totalNuberOfUserForApproving,
    setTotalNuberOfUserForApproving,
  ] = useState(0);
  const [totalAlreadyApproved, setTotalAlreadyApproved] = useState(0);
  const [totalAlreadyRejected, setTotalAlreadyRejected] = useState(0);
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [selectedLang] = useState(Laguage.jap);
  const [deleteRequestFormVisible, setDeleteRequestFormVisible] = useState(
    false,
  );
  const [isLoggedInUserApprover, setIsLoggedInUserApprover] = useState(null);
  const [selectedRequestTitle, setSelectedRequestTitle] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const { successMsg } = useSelector((state) => state.dashboard);
  const [requestApprovedOrRejected, setRequestApprovedOrRejected] = useState(
    null,
  );
  const [showSpinner, setShowSpinner] = useState(true);
  const dispatch = useDispatch();

  const [isOnlyApproveOperation, setIsOnlyApproveOperation] = useState(false);
  const userMode = {
    ONLY_VIEW: 'user_can_view_only',
    VIEW_AND_DELETE: 'user_can_view_and_delete',
    ONLY_EDIT: 'user_can_edit_only',
    EDIT_OR_DELETE: 'user_can_edit_or_delete',
    CAN_COMMENT: 'user_can_approve_reject',
    APPROVED: 'approved',
    REJECTED: 'rejected',
  };

  useEffect(() => {
    setIsParentModalOpen(createRequestFormVisible);
  }, [createRequestFormVisible]);

  useEffect(() => {
    if (successMsg || successMsg === '') {
      // setCreateRequestFormVisible(false);
      // toggleCreateRequestModal(createRequestFormVisible);
      toggleCreateRequestModal(false);
    }
  }, [successMsg]);

  useEffect(() => {
    if (requestItem && requestItem.Id) {
      getListRequestDetails(dispatch, requestItem.Id);
    }
  }, [requestItem]);

  useEffect(() => {
    if (requestDetails) {
      setRequestInfo(requestDetails);
      if (requestDetails.Attachments.length > 0) {
        let totalFileSize = 0;
        requestDetails.Attachments.forEach((file) => {
          totalFileSize += file.FileSize;
        });
        setTotalAttachmentByte(totalFileSize);
      }
      setRequestAttachment(requestDetails.Attachments);

      if (requestDetails.ApprovalStatus === null) {
        setRequestApprovedOrRejected(null);
      } else if (requestDetails.ApprovalStatus === true) {
        setRequestApprovedOrRejected(userMode.APPROVED);
      } else {
        setRequestApprovedOrRejected(userMode.REJECTED);
      }
      const approverAndViewerList = [];
      if (requestDetails.CurrentLevelDetails) {
        setTotalNuberOfUserForApproving(
          requestDetails.CurrentLevelDetails.ApproverList.length,
        );
        requestDetails.CurrentLevelDetails.ApproverList.forEach((user) => {
          if (
            !approverAndViewerList.some(
              (existingUser) => existingUser.AadObjectId === user.AadObjectId,
            )
          ) {
            approverAndViewerList.push(user);
          }
        });
        requestDetails.CurrentLevelDetails.ViewerList.forEach((user) => {
          if (
            !approverAndViewerList.some(
              (existingUser) => existingUser.AadObjectId === user.AadObjectId,
            )
          ) {
            approverAndViewerList.push(user);
          }
        });
        setIsOnlyApproveOperation(requestDetails.CurrentLevelDetails.IsApproveOnly);
      }
      approverAndViewerList.push(requestDetails.RequestCreator);
      getPictureFromGraphFromUserList(dispatch, approverAndViewerList);
    }
  }, [requestDetails]);

  useEffect(() => {
    if (requestDetails && userInformation && userInformation.length > 0) {
      // APPROVER
      const filteredApprover = [];
      let totalApprovalUserCount = 0;
      let totalRejectedUserCount = 0;
      if (requestDetails.CurrentLevelDetails) {
        requestDetails.CurrentLevelDetails.ApproverList.forEach((user) => {
          const userObject = userInformation.find(
            (element) => element.AadObjectId === user.AadObjectId,
          );
          if (userObject) {
            userObject.HasApproved = user.HasApproved;
            userObject.IsGroup = user.IsGroup;
            userObject.Comment = user.Comment;
            userObject.ResponseDate = user.ResponseDate;
            filteredApprover.push(userObject);
          }
          if (user.HasApproved === true) {
            totalApprovalUserCount += 1;
          }
          if (user.HasApproved === false) {
            totalRejectedUserCount += 1;
          }
        });
      }
      setApprovarListDetails(filteredApprover);
      setTotalAlreadyApproved(totalApprovalUserCount);
      setTotalAlreadyRejected(totalRejectedUserCount);

      // VIEWER
      const filteredViewer = [];
      if (requestDetails.CurrentLevelDetails) {
        requestDetails.CurrentLevelDetails.ViewerList.forEach((user) => {
          const userObject = userInformation.find(
            (element) => element.AadObjectId === user.AadObjectId,
          );
          if (userObject) {
            userObject.IsGroup = user.IsGroup;
            filteredViewer.push(userObject);
          }
        });
      }
      setReaderListDetails(filteredViewer);
      const requestCreatorObj = userInformation.find(
        (element) => element.AadObjectId === requestDetails.RequestCreator.AadObjectId,
      );
      if (requestCreatorObj) {
        setRequestCreator(requestCreatorObj);
      }
    }
  }, [userInformation, requestDetails]);

  const [userCurrentMode, setUserCurrentMode] = useState(userMode.CAN_VIEW);

  const userModeForLoggedInUser = () => {
    //
    // Process not started :: so user can edit or delete
    //
    if (requestDetails.IsProcessingStarted === false) {
      return userMode.EDIT_OR_DELETE;
    }
    //
    // Process started and rejected :: So user can edit
    //
    if (requestDetails.ApprovalStatus === false) {
      return userMode.ONLY_EDIT;
    }
    //
    // Process started and approved :: So user can view and delete
    //
    if (requestDetails.ApprovalStatus === true) {
      return userMode.VIEW_AND_DELETE;
    }
    return userMode.ONLY_VIEW;
  };

  useEffect(() => {
    if (
      requestCreator
      && stateLoggedInUser
      && approvarListDetails
      && approvarListDetails.length > 0
    ) {
      //
      // If the loggedIn user is an Approver
      //
      let currentMode = userMode.ONLY_VIEW;
      const loggedInUserApprover = approvarListDetails.find(
        (element) => element.UserPrincipalName
          === stateLoggedInUser.currentLoggedInUserPrincipal,
      );
      if (loggedInUserApprover) {
        setIsLoggedInUserApprover(true);
        if (
          loggedInUserApprover.HasApproved === true
          || loggedInUserApprover.HasApproved === false
        ) {
          currentMode = userMode.ONLY_VIEW;
        } else {
          currentMode = userMode.CAN_COMMENT;
        }
      } else {
        setIsLoggedInUserApprover(false);
        // check user is reader
        const loggedInUserReader = readerListDetails.find(
          (element) => element.UserPrincipalName
            === stateLoggedInUser.currentLoggedInUserPrincipal,
        );
        // The user is creator
        if (
          stateLoggedInUser.currentLoggedInUserPrincipal
          === requestCreator.UserPrincipalName
        ) {
          currentMode = userModeForLoggedInUser();
        } else if (loggedInUserReader) {
          currentMode = userMode.ONLY_VIEW;
        }
      }
      setUserCurrentMode(currentMode);
    }
  }, [requestCreator, approvarListDetails]);

  useEffect(() => {
    if (approvarListDetails.length > 0) {
      setTimeout(() => {
        setShowSpinner(false);
      }, 700);
    }
  }, [approvarListDetails]);

  const clearAllCacheData = () => {
    setTimeout(() => {
      setApprovarListDetails([]);
      setReaderListDetails([]);
      setRequestInfo([]);
      setUserCurrentMode(userMode.ONLY_VIEW);
      setRequestDetailsNull(dispatch);
      storeFileData(dispatch, []);
      saveSelectedTemplateIntoRedux(dispatch, null);
    }, 100);
  }

  const toggleDeletRequestModal = () => {
    setDeleteRequestFormVisible(!deleteRequestFormVisible);
    clearAllCacheData();
  };
  
  useEffect(() => {
    if (showSpinner === true) {
      clearAllCacheData();
    }
  }, [showSpinner]);

  const hideModal = () => {
    toggleCreateRequestModal(false);
    setShowSpinner(true);
  };

  const deleteRequest = (id, title) => {
    setDeleteRequestFormVisible(true);
    setSelectedRequestTitle(title);
    setSelectedRequestId(id);
  };

  const { approvedRejectStatusCode } = useSelector((state) => state.request);
  useEffect(() => {
    if (approvedRejectStatusCode === 200) {
      hideModal();
    }
  }, [approvedRejectStatusCode]);

  return (
    <div className="modal-req-details">
      <Modal
        titleAriaId="Request Details"
        subtitleAriaId="subtitle id"
        isOpen={createRequestFormVisible}
        isBlocking={false}
        containerClassName={contentStyles.container}
        dragOptions={undefined}
      >
        <div className="modal-header">
          <Box display="flex" alignItems="center">
            <span id="id" className="modal-title">
              {selectedLang.TitleDetailsOfRequest}
            </span>
          </Box>
          <div className="modal-header-buttons">
            {userCurrentMode
            && (userCurrentMode === userMode.EDIT_OR_DELETE
              || userCurrentMode === userMode.VIEW_AND_DELETE) ? (
              <div
                className="text-with-icon flex colomn-dividor"
                onClick={() => deleteRequest(requestInfo.Id, requestInfo.Title)}
              >
                <div className="top-close-button">
                  <Icon iconName="Delete" />
                </div>

                <span className="close-text">{selectedLang.Delete}</span>
              </div>
              ) : null}
            <div className="text-with-icon flex" onClick={hideModal}>
              <div className="top-close-button">
                <Icon iconName="Cancel" />
              </div>
              <span className="close-text">{selectedLang.Close}</span>
            </div>
          </div>
        </div>
        <div
          className={`spinner-container-parent spinner-details-page background-white ${
            showSpinner ? 'show' : 'hide'
          }`}
        >
          <div className="spinner-container-child">
            <Spinner size={SpinnerSize.large} />
          </div>
        </div>
        {userCurrentMode && userCurrentMode === userMode.CAN_COMMENT ? (
          <ApproveRejectComment
            iconButtonStyles={iconButtonStyles}
            requestInfoId={requestInfo.Id}
            isOnlyApproveOperation={isOnlyApproveOperation}
          />
        ) : (
          <SubHeader
            requestApprovedOrRejected={requestApprovedOrRejected}
            userMode={userMode}
            totalAlreadyApproved={totalAlreadyApproved}
            totalNuberOfUserForApproving={totalNuberOfUserForApproving}
            requestDetails={requestDetails}
            isLoggedInUserApprover={isLoggedInUserApprover}
          />
        )}
        <FormBodyTabsSelect
          requestInfo={requestInfo}
          userCurrentMode={userCurrentMode}
          requestAttachment={requestAttachment}
          userMode={userMode}
          requestCreator={requestCreator}
          approvarListDetails={approvarListDetails}
          readerListDetails={readerListDetails}
          totalAttachmentByte={totalAttachmentByte}
        />
      </Modal>
      <DeleteRequest
        deleteRequestFormVisible={deleteRequestFormVisible}
        toggleDeleteRequestModal={toggleDeletRequestModal}
        requestId={selectedRequestId}
        Title={selectedRequestTitle}
        inAppUse={true}
      />
    </div>
  );
};
export default RequestInfo;
