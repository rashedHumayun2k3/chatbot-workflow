import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import TeamTextField from '../utility/TeamTextField';
import RemarksHistory from './remarks-history';
import FileAttachment from '../create-request/attachment-upload-list';
import FileListAfterUpload from '../create-request/file-list-after-upload';
import Laguage from '../utility/Language';
import { CURRENTUSER } from '../../constants/types';
import { saveAttachmentAndRemarks, setRequestEditActionStatus, } from '../../actions/request-actions';

export default function TabAttachmentRemarks() {
    const [selectedLang] = useState(Laguage.jap);
    const {
        fileListArray,
        requestEditStatusCode,
        requestDetails,
        removedBlobfileListArray,
    } = useSelector((state) => state.request);
    const dispatch = useDispatch();
    const [showSpinner, setShowSpinner] = useState(null);
    const [requestId, setRequestId] = useState(null);
    const [remarksInputValue, setRemarksInputValue] = useState('');
    const [fileData, setFileData] = useState(null);
    const [totalFileSize, setTotalFileSize] = useState(0);

    useEffect(() => {
        if (requestEditStatusCode === 200 || requestEditStatusCode === 500) {
            setShowSpinner(null);
            setRemarksInputValue('');
            setRequestEditActionStatus(dispatch, null);
        }
    }, [requestEditStatusCode]);

    useEffect(() => {
        if (fileListArray) {
            setFileData(fileListArray);
        }
    }, [fileListArray]);

    useEffect(() => {
        if (fileData && fileData.length > 0) {
            let fileSize = 0;
            fileData.forEach((file) => {
                fileSize += file.size;
            });
            setTotalFileSize(fileSize);
        }
    }, [fileData]);

    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    function niceBytes(x) {
        let l = 0;
        let n = parseInt(x, 10) || 0;
        while (n >= 1024 && ++l) {
            n /= 1024;
        }
        return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
    }

    useEffect(() => {
        if (requestDetails) {
            setRequestId(requestDetails.Id);
        }
    }, [requestDetails]);

    const saveFileAndRemarks = () => {
        const currentUser = JSON.parse(localStorage.getItem(CURRENTUSER));
        setShowSpinner(true);
        const approvalRequestInputs = {
            Id: requestId,
            PostedRemark: remarksInputValue === '' ? null : encodeURIComponent(remarksInputValue),
        };
        saveAttachmentAndRemarks(
            dispatch,
            fileData,
            currentUser.tenantId,
            approvalRequestInputs,
            removedBlobfileListArray,
        );
    };

    const onChangeRemarksField = (event, value) => {
        setRemarksInputValue(value);
    };

    return (
        <>
            {showSpinner && showSpinner === true ? (
                <div className="spinner-container-parent">
                    <div className="spinner-container-child">
                        <Spinner size={SpinnerSize.large} />
                    </div>
                </div>
            ) : null}
            <div className="details-tab-2">
                <div className="details-tab-2-child">
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '50%' }}>
                            <div className="attachment-area-parent">
                                <div className="attachment-area-child">
                                    <FileAttachment />
                                    {fileData && fileData.length > 0 && (
                                        <>
                                            <div className="ui-attachmentlist-container">
                                                <div className="detail-label">
                                                    <div>
                                                        {' '}
                                                        {fileData.length} {selectedLang.FilesTotal}{' '}
                                                        {niceBytes(totalFileSize)}{' '}
                                                    </div>
                                                </div>
                                                <FileListAfterUpload isFileCameFromDetailsPage={true} />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div style={{ width: '50%' }}>
                            <div className="remarks-text-area text-area-create-page">
                                <div className="remarks-text-area-child details-text-area">
                                    <TeamTextField
                                        className="request-details-text-area"
                                        value={remarksInputValue}
                                        isMultiline={true}
                                        noOfRows={13}
                                        isResizable={false}
                                        onChangeTextField={onChangeRemarksField}
                                        placeholder={selectedLang.FilesTotal}
                                    />
                                </div>
                                <RemarksHistory />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bottom-div">
                <div className="bottom-div-child">
                    <input
                        className="modal_create_button button-active btn-longer"
                        type="button"
                        value={selectedLang.BtnSaveAttachnentRemarks}
                        onClick={saveFileAndRemarks}
                    />
                </div>
            </div>
        </>
    );
}
