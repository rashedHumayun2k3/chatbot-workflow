/* eslint-disable no-plusplus */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import Popup from 'reactjs-popup';
import { GraphFileBrowser } from '@microsoft/file-browser';
import nextId from 'react-id-generator';
import Laguage from '../utility/Language';
import { getAuthToken } from '../../utils/axios';
import {
  addNewFileData,
  getFileDetailsFromFileId,
} from '../../actions/request-actions';

const FileAttachment = (props) => {
  const [selectedLang] = useState(Laguage.jap);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenFileWarning, setIsOpenFileWarning] = useState(false);
  const maxFileLimitSize = 10000000;
  const fileRef = React.createRef();
  const { stateLoggedInUser } = useSelector((state) => state.auth,);

  const handleAttachmentFile = (event) => {
    for (let index = 0; index < event.target.files.length; index++) {
      const file = event.target.files[index];
      const fileSize = file.size;
      if (fileSize > maxFileLimitSize) {
        setIsOpenFileWarning(true);
      } else {
        file.uniqueId = nextId();
        file.CreatedBy ={
          Name : stateLoggedInUser && stateLoggedInUser.Name
        }
        addNewFileData(dispatch, file);
      }
    }
  };

  const closeFileWarning = () => {
    setIsOpenFileWarning(false);
  };
  const getSelectedFilesFromOneDrive = (selectedKeys) => {
    selectedKeys.forEach((element) => {
      getFileDetailsFromFileId(dispatch, element.driveItem_203[2]);
    });
    setTimeout(() => {
      setIsOpen(false);
    }, 500);
  };

  const openFileBrowser = () => {
    setIsOpen(true);
  };
  const cancelFileBrowser = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 500);
  };

  const browseAttachmentMyComputer = () => {
    fileRef.current.click();
  };

  function getAuthenticationToken() {
    // eslint-disable-next-line no-undef
    return getAuthToken();
  }

  return (
    <>
      <div className="padding-right-10">
        <div className="modal-add-attachment-label input-example-color">
          <Popup
            trigger={
              <div className="attachment-icon-container">
                <div className="attachment-icon">
                  <Icon iconName="Attach" />
                </div>
                <div className="attachment-text">
                  {selectedLang.AddAttachement}
                </div>
              </div>
            }
            position="top left"
            nested
          >
            {(close) => (
              <div className="popup-container-parent">
                <div className="popup-container-child">
                  <div className="menu-parent">
                    <div className="menu-icon">
                      <Icon className="onedrive-icon" iconName="OneDriveLogo" />
                    </div>
                    {
                      <div className="file-uploader-drive-parent">
                        <div className="menu-text" onClick={openFileBrowser}>
                          Microsoft OneDrive
                        </div>
                        <Popup
                          className="one-drive-popup"
                          open={isOpen}
                          position="right top"
                          onClose={() => {
                            cancelFileBrowser();
                            close();
                          }}
                        >
                          <div className="popup-container-parent popup-onedrive">
                            <GraphFileBrowser
                              getAuthenticationToken={getAuthenticationToken}
                              selectionMode="files"
                              onSuccess={(selectedKeys) => {
                                getSelectedFilesFromOneDrive(selectedKeys);
                                close();
                              }}
                              onCancel={() => {
                                cancelFileBrowser();
                                close();
                              }}
                            />
                          </div>
                        </Popup>
                      </div>
                    }
                  </div>
                  <div className="menu-parent">
                    <div className="menu-icon">
                      <Icon iconName="OpenFile" />
                    </div>
                    <div
                      className="menu-text"
                      onClick={() => {
                        browseAttachmentMyComputer();
                        close();
                      }}
                    >
                      {selectedLang.UploadFromComputer}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Popup>
          <Popup
            open={isOpenFileWarning}
            className="file-warning-popup"
            closeOnDocumentClick={false}
          >
            <div className="popup-container-parent approve-reject-popUp">
              <div className="comment-header dismiss-color file-warning-header">
                <div className="comment-header-text-part reject-comment">
                  {selectedLang.AttachmentErrorHeader}
                </div>
              </div>
              <div className="display-inline">
                <div className="comment-body-child">
                  <div className="warning-body-content">
                    <div>{selectedLang.AttachmentErrorLine1}</div>
                    <div>{selectedLang.AttachmentErrorLine2}</div>
                  </div>
                </div>
              </div>
              <div className="comment-action-content warning-bottom-div">
                <div className="red-button" onClick={closeFileWarning}>
                  {selectedLang.Return}{' '}
                </div>
              </div>
            </div>
          </Popup>
        </div>
        <div className="hide-input-type-file">
          <input
            type="file"
            tabIndex={10}
            multiple
            onChange={handleAttachmentFile}
            ref={fileRef}
          />
        </div>
      </div>
    </>
  );
};

export default FileAttachment;
