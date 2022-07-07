import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getId } from 'office-ui-fabric-react/lib/Utilities';
import {
  Modal,
} from 'office-ui-fabric-react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import CommonDecisionButtons from '../utility/CommonDecisionButtons';
import Laguage from '../utility/Language';
import {
  deleteSingleRequestById, setDeleteRequestActionStatus,
} from '../../actions/dashboard-actions';
import {
  setSelectedRequestTitleInReducer,
} from '../../actions/request-details-actions';

const DeleteRequest = ({
  toggleDeleteRequestModal,
  deleteRequestFormVisible = false,
  requestId,
  Title,
  inAppUse: showCancelControls,
}) => {
  /* For User and group */

  /** *** */
  const [selectedLang] = useState(Laguage.jap);
  const [modalTitle] = useState(selectedLang.DeleteRequest);
  const dispatch = useDispatch();
  const [selectedRequestId, setSelectedRequestId] = useState();
  const [selectedRequestTitle, setSelectedRequestTitle] = useState();
  const [showmodal, setShowmodal] = useState(false);
  useEffect(() => {
    setShowmodal(deleteRequestFormVisible);
  }, [deleteRequestFormVisible]);

  useEffect(() => {
    if (requestId) {
      setSelectedRequestId(requestId);
      setSelectedRequestTitle(Title);
      setSelectedRequestTitleInReducer(dispatch, Title);
    }
  }, [requestId]);

  const _titleId = getId('title');
  const _subtitleId = getId('subText');
  const hideDeleteModal = () => {
    // deleteRequestFormVisible = false;
    toggleDeleteRequestModal(false);
    setShowmodal(false);
  };

  const onDecisionDone = (decisionResult) => {
    if (!decisionResult) {
      hideDeleteModal();
    } else {
      setDeleteRequestActionStatus(dispatch, null, selectedRequestId);
      deleteSingleRequestById(dispatch, selectedRequestId);
      hideDeleteModal();
    }
    // Remove the attachment on create or remove file attachment
  };

  return (
        <div>
            <Modal
                titleAriaId={_titleId}
                subtitleAriaId={_subtitleId}
                isOpen={showmodal}
                isBlocking={false}
                containerClassName='deleteModal'
                dragOptions={undefined}
            >

                <div className="modal-header">
                    <span className="modal-title" id={_titleId}>{modalTitle}</span>
                </div>
                <div className="delete-form">

                  <Label>{selectedLang.WantToDelete}</Label>
                  <div className="request-title"><strong>{selectedRequestTitle}</strong></div>
                </div>
                <CommonDecisionButtons
                    onDecisionDone={onDecisionDone}
                    primaryButtonText={selectedLang.DeleteRequestBtn}
                    defaultButtonText={selectedLang.Cancel}
                    hideCancel={!showCancelControls}
                />

            </Modal>

        </div>
  );
};
export default DeleteRequest;
