import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Icon } from 'office-ui-fabric-react';
import Popup from 'reactjs-popup';
import { setRequestWithComments } from '../../actions/request-details-actions';
import Laguage from '../utility/Language';

const ApproveRejectComment = (params) => {
  const { requestInfoId, isOnlyApproveOperation } = params;
  const [isOpenPopupApprove, setIsOpenPopupApprove] = useState(false);
  const [isOpenPopupReject, setIsOpenPopupReject] = useState(false);
  const [commentForApprove, setCommentForApprove] = useState('');
  const [commentForReject, setCommentForReject] = useState('');
  const [loggedInUser, setLoggedInUser] = useState([]);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const { approvedStatusCode } = useSelector((state) => state.request);
  const [selectedLang] = useState(Laguage.jap);

  useEffect(() => {
    setCurrentRequestId(requestInfoId);
    const currentUser = localStorage.getItem('currentUser');
    setLoggedInUser(currentUser);
  }, [requestInfoId]);

  useEffect(() => {
    if (approvedStatusCode) {
      setCommentForApprove('');
    }
  }, [approvedStatusCode]);

  const openApprovedCommentBox = () => {
    setIsOpenPopupApprove(true);
  };

  const openRejectCommentBox = () => {
    setIsOpenPopupReject(true);
  };

  const closeApprovedCommentBox = () => {
    setIsOpenPopupApprove(false);
  };

  const closeRejectedCommentBox = () => {
    setIsOpenPopupReject(false);
  };

  const onChangeApproveComment = React.useCallback((event, value) => {
    if (value.length < 2000) {
      setCommentForApprove(value);
    }
  }, []);

  const onChangeRejectComment = React.useCallback((event, value) => {
    if (value.length < 2000) {
      setCommentForReject(value);
    }
  }, []);

  const dispatch = useDispatch();
  
  const saveCommentWithApproveOrReject = (status, comment) => {
    if (currentRequestId) {
      const requestVM = {
        ApprovalRequestId: currentRequestId,
        UserPrincipal: JSON.parse(loggedInUser).currentLoggedInUserPrincipal,
        Comment: comment,
        IsForApprove: status,
      };
      setRequestWithComments(dispatch, requestVM);
    }
  };

  const saveApproveWithComment = () => {
    saveCommentWithApproveOrReject(true, commentForApprove);
    setIsOpenPopupApprove(false);
  };

  const saveRejectWithComment = () => {
    saveCommentWithApproveOrReject(false, commentForReject);
    setIsOpenPopupReject(false);
  };

  return (
        <div>
            <div className="subHeader">
                <div className="child" name="Approved" onClick={openApprovedCommentBox}>
                    {selectedLang.Approve}
                </div>
                {
                  isOnlyApproveOperation === false && 
                  <div className="child" name="Dismiss" onClick={openRejectCommentBox}>
                    {selectedLang.Reject}
                  </div>
                }
            </div>
            <div className="comment-box-parent">
                <Popup open={isOpenPopupApprove} className="comment-box-popup" position="right top" closeOnDocumentClick={false}>
                    <div className="popup-container-parent approve-reject-popUp">
                        <div className="comment-header approve-color">
                            <div className="comment-header-text-part approve-comment">
                                {selectedLang.ApprovingRequest}

                            </div>
                            <div className="iconPart">
                                <div className="text-with-icon flex colomn-dividor" onClick={closeApprovedCommentBox}>
                                    <div className="top-close-button">
                                        <Icon iconName="Cancel" />
                                    </div>
                                    <span className="close-text gray-close">{selectedLang.Close}</span>
                                </div>
                            </div>
                        </div>
                        <div className="padding-10">
                            <div className="comment-body-child">
                                <div className="comment-body-content">
                                    <TextField placeholder={selectedLang.WriteAComment} multiline rows={5}
                                     onChange={onChangeApproveComment} />
                                </div>
                            </div>
                        </div>
                        <div className="comment-action-content">
                            <input className="red-button red-color-light"
                                 type="button" value={selectedLang.ApprovedApproval} title={selectedLang.ApprovedApproval}
                                 onClick={() => saveApproveWithComment()}
                                  />
                        </div>
                    </div>
                </Popup>
                <Popup open={isOpenPopupReject} className="comment-box-popup" position="right top" closeOnDocumentClick={false}>
                    <div className="popup-container-parent approve-reject-popUp">
                        <div className="comment-header dismiss-color">
                            <div className="comment-header-text-part reject-comment">
                                {selectedLang.RejectingRequest}
                            </div>
                            <div className="iconPart">
                                <div className="text-with-icon flex colomn-dividor" onClick={closeRejectedCommentBox}>
                                    <div className="top-close-button">
                                        <Icon iconName="Cancel" />
                                    </div>
                                    <span className="close-text gray-close">{selectedLang.Close}</span>
                                </div>
                            </div>
                        </div>
                        <div className="padding-10">
                            <div className="comment-body-child">
                                <div className="comment-body-content">
                                    <TextField placeholder={selectedLang.WriteAComment} multiline rows={5} onChange={onChangeRejectComment} />
                                </div>
                            </div>
                        </div>
                        <div className="border-top">
                        </div>
                        <div className="comment-action-content">
                            <input className="red-button red-color-light"
                                 type="button" value={selectedLang.RejectedApproval} title={selectedLang.RejectedApproval}
                                 onClick={() => saveRejectWithComment()}
                                  />

                        </div>

                    </div>
                </Popup>
            </div>
        </div>

  );
};
export default ApproveRejectComment;
