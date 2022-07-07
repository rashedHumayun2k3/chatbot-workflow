/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getId } from 'office-ui-fabric-react/lib/Utilities';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import {
  Modal,
  mergeStyleSets,
  getTheme,
  FontWeights,
} from 'office-ui-fabric-react';
import { FontSizes } from '@uifabric/styling';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import * as microsoftTeams from '@microsoft/teams-js';
import queryString from 'query-string';
import { some } from 'lodash';
import { setEditFlag } from '../../actions/request-details-actions';
import { CURRENTUSER } from '../../constants/types';
import {
  saveFileToDB,
  storeFileData,
  clearApproverReaderTemp,
  getTemplateListFromDB,
  storeAddApproverTemp,
  saveSelectedTemplateIntoRedux,
} from '../../actions/request-actions';
import Laguage from '../utility/Language';
import FormBodyTabs from './form-body-tabs';
import ConstantValue from '../utility/constantValue';

const CreateRequest = ({
  toggleCreateRequestModal,
  createRequestFormVisible = true,
  inAppUse = true,
}) => {
  /* For User and group */
  const { userInformation, groupInformation, stateLoggedInUser } = useSelector(
    (state) => state.auth,
  );
  const {
    requestInsertStatusCode,
    editFlagValue,
    removedBlobfileListArray,
    selectApproverReaderTemp,
  } = useSelector((state) => state.request);
  const { currentStatusId } = useSelector((state) => state.dashboard);

  const [selectedLang] = useState(Laguage.jap);
  const [requestCreator, setRequestCreator] = useState([]);
  const [showSpinner, setShowSpinner] = useState(null);
  const [modalHeaderName, setModalHeaderName] = useState(
    selectedLang.CreateRequest,
  );
  const [requestId, setRequestId] = useState(null);
  const [titleName, setTitleName] = useState('');
  const [remarksValue, setRemarksValue] = useState('');
  const [details, setDetails] = useState('');
  const [fileDatalist, setFileDatalist] = useState([]);
  const [saveBtnActive, setSaveBtnActive] = useState(false);
  const _titleId = getId('title');
  const _subtitleId = getId('subText');
  const [successMessage, setSuccessMessage] = useState('');
  const [failedMessage, setFailedMessage] = useState('');
  const [isSuccessOperation, setIsSuccessOperation] = useState(false);
  const [botContext, setBotContext] = useState(null);
  const [levelList, setLevelList] = useState([]);
  const [desiredCompletionDate, setDesiredCompletionDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30)),
  );

  const [
    isAppRequestCreationSuccessful,
    setIsAppRequestCreationSuccessful,
  ] = useState(null);
  const [ddlTemplateOptions, setDdlTemplateOptions] = useState([
    {
      key: ConstantValue.emptyGuid,
      text: selectedLang.templatePlaceholder,
    },
  ]);
  const { templateList } = useSelector((state) => state.request);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showApproverReaderModal, setShowApproverReaderModal] = useState(false);

  const { requestDetails, selectedTemplateFromUser } = useSelector(
    (state) => state.request,
  );

  /** *** */

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
          maxHeight: 515,
          width: 990,
        },
        '@media only screen and (max-device-width: 1366px) and (max-device-height: 768px)': {
          maxHeight: 515,
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

  const dispatch = useDispatch();

  useEffect(() => {
    // eslint-disable-next-line no-undef
    const { botCtx } = queryString.parse(location.search);
    setBotContext(botCtx);
    microsoftTeams.initialize();
    getTemplateListFromDB(dispatch);
  }, []);

  useEffect(() => {
    setSelectedTemplate(selectedTemplateFromUser);
  }, [selectedTemplateFromUser]);

  const clearAllData = () => {
    setTitleName('');
    setDetails('');
    // setSelectedApprover(null);
    // setSelectedViewer(null);
    // setDefaultApproverList(null);
    // setDefaultViewerList(null);
    setRequestId(null);
    setShowSpinner(false);
    clearApproverReaderTemp(dispatch);
    if (requestDetails === null) {
      storeFileData(dispatch, []);
      saveSelectedTemplateIntoRedux(dispatch, null);
    }
  };

  const { fileListArray } = useSelector((state) => state.request);
  useEffect(() => {
    if (fileListArray) {
      setFileDatalist(fileListArray);
    }
  }, [fileListArray]);

  const [approverReaderExist, setApproverReaderExist] = useState(false);
  useEffect(() => {
    if (selectApproverReaderTemp && selectApproverReaderTemp.length > 0) {
      setLevelList([]);
      setApproverReaderExist(true);
      selectApproverReaderTemp.map((lblObj) => {
        setLevelList((prevList) => [...prevList, lblObj]);
      });
    }
  }, [selectApproverReaderTemp]);
  //
  // EDIT MODE
  //
  useEffect(() => {
    if (editFlagValue === true && userInformation.length > 0) {
      setModalHeaderName(selectedLang.TitleEdit);
      setTitleName(requestDetails.Title);
      setDetails(requestDetails.Details);
      setRequestId(requestDetails.Id);
    } else {
      clearAllData();
    }
  }, [editFlagValue]);

  useEffect(() => {
    if (stateLoggedInUser) {
      setRequestCreator(stateLoggedInUser);
    }
  }, [stateLoggedInUser]);

  const hideModal = () => {
    clearAllData();
    if (botContext) {
      setIsAppRequestCreationSuccessful(true);
    } else {
      toggleCreateRequestModal(false);
      setEditFlag(dispatch, null);
    }
  };
  //
  // CHECK ACTION STATUS CODE
  //
  useEffect(() => {
    if (requestInsertStatusCode) {
      if (requestInsertStatusCode === 200) {
        setSuccessMessage(selectedLang.RequestSuccessfull);
        setIsSuccessOperation(true);
      } else {
        setFailedMessage(selectedLang.RequestFailed);
        setIsSuccessOperation(false);
      }
      hideModal();
    }
  }, [requestInsertStatusCode]);

  const onClickSaveRequest = () => {
    const currentUser = JSON.parse(localStorage.getItem(CURRENTUSER));
    if (titleName !== '' && approverReaderExist) {
      setSaveBtnActive(false);
      setShowSpinner(true);
      const approvalRequestInputs = {
        Title: titleName,
        Details: encodeURIComponent( details),
        RequesterUserPrincipalName: currentUser.currentLoggedInUserPrincipal,
        Id: requestId,
        ApprovalStatus: null,
        TenantId: currentUser.tenantId,
        TotalLevel: levelList.length,
        PostedRemark: encodeURIComponent(remarksValue),
        Levels: levelList,
        TemplateId: selectedTemplate
          ? selectedTemplate.Id
          : ConstantValue.emptyGuid,
        DesiredCompletionDate: desiredCompletionDate,
      };
      saveFileToDB(
        dispatch,
        fileDatalist,
        currentUser.tenantId,
        approvalRequestInputs,
        removedBlobfileListArray,
        currentStatusId,
      );
    }
  };

  useEffect(() => {
    if (titleName.length > 0 && approverReaderExist === true) {
      setSaveBtnActive(true);
    } else {
      setSaveBtnActive(false);
    }
  }, [titleName, approverReaderExist]);

  const hideToaster = () => {
    microsoftTeams.tasks.submitTask();
  };

  useEffect(() => {
    if (templateList) {
      templateList.map((template) => {
        let templateObj = null;
        templateObj = {
          key: template.Id,
          text: template.Name,
        };
        if (!some(ddlTemplateOptions, templateObj)) {
          setDdlTemplateOptions((item) => [...item, templateObj]);
        }
      });
    }
  }, [templateList]);

  const onRemarksValueChanged = (remarksText) => {
    setRemarksValue(remarksText);
  };

  useEffect(() => {
    if (selectedTemplate) {
      setDetails(selectedTemplate.Body);
      if (selectedTemplate.StepList) {
        selectedTemplate.StepList.map((approverViewer) => {
          const selectedObj = {
            ApproverList: approverViewer.ApproverList,
            ViewerList: approverViewer.ViewerList,
            IsSingleApprover: approverViewer.IsSingleApprover,
            LevelNo: approverViewer.LevelNo,
            LevelName: approverViewer.LevelName,
            IsApproveOnly: approverViewer.IsApproveOnly,
          };
          storeAddApproverTemp(dispatch, selectedObj);
        });
      }
    }
  }, [selectedTemplate]);

  return (
    <div>
      <Modal
        titleAriaId={_titleId}
        subtitleAriaId={_subtitleId}
        isOpen={createRequestFormVisible}
        isBlocking={false}
        containerClassName={contentStyles.container}
        dragOptions={undefined}
        allowTouchBodyScroll={false}
        className={!botContext ? 'general-modal' : 'bot-context-modal'}
      >
        {isAppRequestCreationSuccessful ? (
          <div className="toaster-container-create-page">
            <div className="toaster-child-create-page">
              <div className="toast-parent-create-page">
                <div
                  className={`toaster-child flex 
                                    ${
                                      isSuccessOperation
                                        ? 'toaster-success'
                                        : 'toaster-failed'
                                    }`}
                >
                  <div>
                    {isSuccessOperation ? successMessage : failedMessage}
                  </div>
                  <div
                    className="toaster-cross-button-container"
                    onClick={() => hideToaster()}
                  >
                    <Icon className="toaster-cross-button" iconName="Cancel" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className={`modal-header ${!botContext ? 'show-header' : 'hide'}`}>
          <span className="modal-title" id={_titleId}>
            {modalHeaderName}
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
        {showSpinner && showSpinner === true ? (
          <div className="spinner-container-parent">
            <div className="spinner-container-child">
              <Spinner size={SpinnerSize.large} />
            </div>
          </div>
        ) : null}

        <FormBodyTabs
          setTitleName={setTitleName}
          // setSelectedTemplate={setSelectedTemplate}
          setDetails={setDetails}
          ddlTemplateOptions={ddlTemplateOptions}
          showApproverReaderModal={showApproverReaderModal}
          setShowApproverReaderModal={setShowApproverReaderModal}
          // setFileDatalist={setFileDatalist}
          titleName={titleName}
          templateList={templateList}
          requestCreator={requestCreator}
          details={details}
          selectedTemplate={selectedTemplate}
          onRemarksValueChangeFinished={onRemarksValueChanged}
          remarksValue={remarksValue}
          setDesiredCompletionDate={setDesiredCompletionDate}
        />

        <div className="bottom-div">
          <div className="bottom-div-child">
            <input
              className={`modal_create_button ${
                saveBtnActive ? 'button-active' : 'button-inactive'
              }`}
              type="button"
              value={selectedLang.Save}
              title={selectedLang.Save}
              onClick={() => onClickSaveRequest()}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default CreateRequest;
