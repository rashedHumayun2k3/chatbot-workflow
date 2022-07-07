// eslint-disable-next-line import/no-extraneous-dependencies
import { Icon } from 'office-ui-fabric-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setRequestEditActionStatus,
  clearApproverReaderTemp,
  saveSelectedTemplateIntoRedux,
} from '../../actions/request-actions';
import { setEditFlag } from '../../actions/request-details-actions';
import CreateRequest from '../create-request/create-request';
import Laguage from '../utility/Language';

const EditRequest = () => {
  const [selectedLang] = useState(Laguage.jap);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const dispatch = useDispatch();
  const onEditRequest = () => {
    clearApproverReaderTemp(dispatch);
    saveSelectedTemplateIntoRedux(dispatch, null);
    setShowCreateForm(true);
    setEditFlag(dispatch, true);
  };

  const toggleCreateRequestModal = () => {
    setShowCreateForm(false);
    setEditFlag(dispatch, null);
    setRequestEditActionStatus(dispatch, null);
  };
  const { requestEditStatusCode } = useSelector((state) => state.request);
  useEffect(() => {
    if (requestEditStatusCode === 200) {
      toggleCreateRequestModal();
    }
  }, [requestEditStatusCode]);

  return (
    <div>
      <div className="edit-button-container" onClick={() => onEditRequest()}>
        <Icon iconName="EditSolid12" />
        <span className="">{selectedLang.EditRequest} </span>
      </div>
      {showCreateForm ? (
        <CreateRequest
          createRequestFormVisible={showCreateForm}
          toggleCreateRequestModal={toggleCreateRequestModal}
          inAppUse={true}
        />
      ) : null}
    </div>
  );
};
export default EditRequest;
