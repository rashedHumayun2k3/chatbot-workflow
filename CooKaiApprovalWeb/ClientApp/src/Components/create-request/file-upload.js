/* eslint-disable no-plusplus */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { mergeStyleSets } from 'office-ui-fabric-react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import TeamTextField from '../utility/TeamTextField';
import Laguage from '../utility/Language';
import FileAttachment from './attachment-upload-list';
import FileListAfterUpload from './file-list-after-upload';

const contentStyles = mergeStyleSets({
  labelStyle: {
    fontWight: 'normal',
    fontSize: '14px',
    fontFamily: 'Roboto',
    fontWeight: 400,
    color: '#828282',
  },
});

const FileUpload = (props) => {
  const { remarksValue, onRemarksValueChangeFinished } = props;
  const { fileListArray } = useSelector((state) => state.request);
  const [selectedLang] = useState(Laguage.jap);
  const [remarksInputValue, setRemarksInputValue] = useState(remarksValue);
  const [fileData, setFileData] = useState(null);
  
  const onChangeRemarksField = (event, value) => {
    setRemarksInputValue(value);
    onRemarksValueChangeFinished(value);
  };

  useEffect(() => {
    if (fileListArray) {
      setFileData(fileListArray);
    }
  }, [fileListArray]);

  const [totalFileSize, setTotalFileSize] = useState(0);
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

  return (
    <>
      <div className="details-form-body-parent details-tab-2">
        <div className="create-form-file-attachment details-tab-2">
          <div style={{ display: 'flex' }}>
            <div style={{ width: '50%' }}>
              <FileAttachment />
              {fileData && fileData.length > 0 && (
                <>
                  <div className="detail-label">
                    <div>
                      {' '}
                      {fileData.length} {selectedLang.FilesTotal}{' '}
                      {niceBytes(totalFileSize)}{' '}
                    </div>
                  </div>
                  <div className="ui-attachmentlist-container ui-attachmentlist-height">
                    <div className="ui-attachmentlist-child">
                      <FileListAfterUpload />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div style={{ width: '50%' }}>
              <div className="text-area-create-page">
                <Label className={contentStyles.labelStyle}>
                  {selectedLang.Remarks}
                </Label>
                <div className="details-text-area create-remarks-text-area">
                  <TeamTextField
                    className="request-details-text-area"
                    value={remarksInputValue}
                    isMultiline={true}
                    noOfRows={13}
                    isResizable={false}
                    onChangeTextField={onChangeRemarksField}
                    placeholder=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileUpload;
