import React, { useEffect } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import ApproverReaderModal from './approver-reader-modal';
import ApproverReaderList from './approver-reader-list';
import { storeAddApproverTemp } from '../../actions/request-actions';
import ConstantValue from '../utility/constantValue';

const ApprovovalSteps = (props) => {
  const {
    isMobileLayout,
    selectedTemplate,
    fromCreateRequest,
    showApproverReaderModal,
    setShowApproverReaderModal,
  } = props;

  const hideModal = () => {
    setShowApproverReaderModal(false);
  };
  const dispatch = useDispatch();
  const afterApproverReaderSelected = (
    selectedApprover,
    selectedViewer,
    selectedKey,
    currentLevel,
    levelName,
    isOnlyApproved,
  ) => {
    const unifyUserObjectApprover = [];
    if (selectedApprover) {
      selectedApprover.map((appUser) => {
        const unifyUser = {
          AadObjectId: appUser.spid,
          IsGroup: appUser.isGroup,
          Name: appUser.name,
          UserPrincipalName: appUser.secondarytext,
          GroupName: appUser.isGroup ? appUser.text : null,
        };
        unifyUserObjectApprover.push(unifyUser);
      });
    }

    const unifyUserObjectViewer = [];
    if (selectedViewer) {
      selectedViewer.map((appUser) => {
        const unifyUser = {
          AadObjectId: appUser.spid,
          IsGroup: appUser.isGroup,
          Name: appUser.name,
          UserPrincipalName: appUser.secondarytext,
          GroupName: appUser.isGroup ? appUser.text : null,
        };
        unifyUserObjectViewer.push(unifyUser);
      });
    }
    const selectedObj = {
      ApproverList: unifyUserObjectApprover,
      ViewerList: unifyUserObjectViewer,
      IsSingleApprover: selectedKey !== 'E',
      LevelNo: currentLevel,
      LevelName: levelName,
      IsApproveOnly: isOnlyApproved,
    };
    storeAddApproverTemp(dispatch, selectedObj);
  };

  const { requestDetails } = useSelector((state) => state.request);
  useEffect(() => {
    if (requestDetails) {
      if (selectedTemplate === null && requestDetails.TemplateId === ConstantValue.emptyGuid) {
        requestDetails.Levels.map((levelObj) => {
          const selectedObj = {
            ApproverList: levelObj.ApproverList,
            ViewerList: levelObj.ViewerList,
            IsSingleApprover: levelObj.IsSingleApprover,
            LevelNo: levelObj.LevelNo,
            LevelName: levelObj.LevelName,
            IsApproveOnly: levelObj.IsApproveOnly,
          };
          if (selectedObj) {
            storeAddApproverTemp(dispatch, selectedObj);
          }
        });
      }
    }
  }, [requestDetails]);

  return (
    <>
      <div
        className={clsx([
          {
            'create-request-right-side': fromCreateRequest,
          },
          { 'width-100p': !fromCreateRequest },
        ])}
      >
        <ApproverReaderList
          isMobileLayout={isMobileLayout}
          selectedTemplate={selectedTemplate}
        />
      </div>

      {showApproverReaderModal ? (
        <ApproverReaderModal
          showApproverReaderModal={showApproverReaderModal}
          toggleApproverReaderModal={hideModal}
          requestId={null}
          inAppUse={true}
          onApproverReaderSelected={afterApproverReaderSelected}
        />
      ) : null}
    </>
  );
};
export default ApprovovalSteps;
