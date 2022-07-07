/* eslint-disable eqeqeq */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { Icon } from 'office-ui-fabric-react';
import { Box } from '@material-ui/core';
import Laguage from '../utility/Language';

const SubHeader = (props) => {
  const [selectedLang] = useState(Laguage.jap);
  const [currentLevel, setCurrentLevel] = useState('1');
  const {
    requestApprovedOrRejected,
    userMode,
    totalAlreadyApproved,
    totalNuberOfUserForApproving,
    isLoggedInUserApprover,
    requestDetails,
  } = props;

  useEffect(() => {
    if (!isEmpty(requestDetails)) {
      if (requestDetails.CurrentLevelDetails.LevelName) {
        setCurrentLevel(requestDetails.CurrentLevelDetails.LevelName);
      } else {
        setCurrentLevel(requestDetails.CurrentLevel);
      }
    }
  }, [requestDetails]);

  const showSubHeaderByCondition = (
    selectedIcon,
    selectedIconClassName,
    backgroundClass,
    status,
  ) => (
    <Box
      className={`subHeader ${backgroundClass}`}
      justifyContent="space-between"
    >
      <div className="iconTextPart">
        <span className="icon-container">
          <div className="flex">
            <Icon className={selectedIconClassName} iconName={selectedIcon} />
            <div className={`text-small-white ${selectedIconClassName}`}>
              {status}
            </div>
          </div>
        </span>
      </div>
      <div className="iconTextPart">
        <span className="icon-container">
          <div className="flex">
            <div className={`text-small-white ${selectedIconClassName}`}>
              {selectedLang.CurrentLevelTitle}: {currentLevel}
            </div>
          </div>
        </span>
      </div>
    </Box>
  );

  return (
    <>
      <div>
        {requestApprovedOrRejected == userMode.APPROVED
          ? isLoggedInUserApprover
            ? showSubHeaderByCondition(
              'SkypeCircleCheck',
              'approved',
              'approve-color',
              selectedLang.ApproverViewApproved,
            )
            : showSubHeaderByCondition(
              'SkypeCircleCheck',
              'approved',
              'approve-color',
              selectedLang.RequesterVeiwApproved,
            )
          : requestApprovedOrRejected == userMode.REJECTED
            ? isLoggedInUserApprover
              ? showSubHeaderByCondition(
                'SkypeCircleMinus',
                'rejected',
                'dismiss-color',
                selectedLang.ApproverViewRejected,
              )
              : showSubHeaderByCondition(
                'SkypeCircleMinus',
                'rejected',
                'dismiss-color',
                selectedLang.RequesterVeiwRejected,
              )
            : showSubHeaderByCondition(
              'SkypeCircleClock',
              '',
              'pending',
              `${selectedLang.AwaitingApproval}(${totalAlreadyApproved}/${totalNuberOfUserForApproving})`,
            )}
      </div>
    </>
  );
};

export default SubHeader;
