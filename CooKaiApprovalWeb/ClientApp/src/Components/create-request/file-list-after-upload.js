/* eslint-disable no-plusplus */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import ListIcon from '@material-ui/icons/List';
import ImageIcon from '@material-ui/icons/Image';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import DescriptionIcon from '@material-ui/icons/Description';
import ViewDayIcon from '@material-ui/icons/ViewDay';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import ShowDateTime from './show-datetime';
import {
  setRequestEditActionStatus,
  removeFileData,
  removeBlobFileData,
} from '../../actions/request-actions';

const FileListAfterUpload = (props) => {
  const { isFileCameFromDetailsPage } = props;
  const { fileListArray } = useSelector((state) => state.request);
  const [fileData, setFileData] = useState(null);
  const dispatch = useDispatch();
  const [attachmentEditMode, setAttachmentEditMode] = useState(false);
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  function niceBytes(x) {
    let l = 0;
    let n = parseInt(x, 10) || 0;
    while (n >= 1024 && ++l) {
      n /= 1024;
    }
    return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
  }

  function handleRemove(removedItem) {
    if (removedItem && removedItem.BlobUrl) {
      removeBlobFileData(dispatch, removedItem);
    }
    removeFileData(dispatch, removedItem);
    setRequestEditActionStatus(dispatch, null);
  }

  const excelType = [
    'xls',
    'xlt',
    'xlm',
    'xlsx',
    'xlsm',
    'xltx',
    'xltm',
    'xlsb',
    'xla',
    'xlam',
    'xll',
    'xlw',
  ];
  const imageType = ['jpg', 'jpeg', 'png', 'gif', 'tiff', 'raw', 'psd'];
  const pdfType = ['pdf'];
  const docType = ['doc', 'dot', 'wbk', 'docx', 'docm', 'dotx', 'dotm', 'docb'];
  const powerPointType = [
    'ppt',
    'pot',
    'pps',
    'pptx',
    'pptm',
    'potx',
    'potm',
    'ppam',
    'ppsx',
    'ppsm',
    'sldx',
    'sldm',
  ];
  const xlsx = 'xlsx';
  const jpg = 'jpg';
  const pdf = 'pdf';
  const doc = 'doc';
  const pptx = 'pptx';
  const others = 'others';

  const showFileAttachmentConditional = (filename) => {
    let fileExtension = filename
      ? filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
      : null;
    if (fileExtension) {
      fileExtension = fileExtension.toLowerCase();
      if (excelType.includes(fileExtension)) {
        return <ListIcon className="file-icon" />;
      }
      if (imageType.includes(fileExtension)) {
        return <ImageIcon className="file-icon" />;
      }
      if (pdfType.includes(fileExtension)) {
        return <PictureAsPdfIcon className="file-icon" />;
      }
      if (docType.includes(fileExtension)) {
        return <DescriptionIcon className="file-icon" />;
      }
      if (powerPointType.includes(fileExtension)) {
        return <ViewDayIcon className="file-icon" />;
      }
    }
    return <InsertDriveFileIcon className="file-icon" />;
  };

  const getFileExtensionByFileName = (fileExtension) => {
    if (excelType.includes(fileExtension)) {
      return xlsx;
    }
    if (imageType.includes(fileExtension)) {
      return jpg;
    }
    if (pdfType.includes(fileExtension)) {
      return pdf;
    }
    if (docType.includes(fileExtension)) {
      return doc;
    }
    if (powerPointType.includes(fileExtension)) {
      return pptx;
    }
    return null;
  };
  const getFileExtension = (filename) => {
    if (filename) {
      return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
    }
    return others;
  };

  const getFileNameWithoutExtension = (filename) => {
    if (filename) {
      return filename.split('.').slice(0, -1).join('.');
    }
    return others;
  };

  const getFileExtensionForClass = (filename) => {
    if (filename) {
      const fileExtension = filename.slice(
        ((filename.lastIndexOf('.') - 1) >>> 0) + 2,
      );
      if (getFileExtensionByFileName(fileExtension)) {
        return getFileExtensionByFileName(fileExtension);
      }
    }
    return others;
  };
  const { requestDetails, editFlagValue } = useSelector(
    (state) => state.request,
  );
  useEffect(() => {
    if (editFlagValue === true) {
      setAttachmentEditMode(true);
    }
  }, [editFlagValue]);
  useEffect(() => {
    if (isFileCameFromDetailsPage) {
      setAttachmentEditMode(true);
    }
  }, [isFileCameFromDetailsPage]);

  useEffect(() => {
    if (fileListArray) {
      setFileData(fileListArray);
    }
  }, [fileListArray]);

  useEffect(() => {
    if (fileData) {
      console.log(fileData.sort((a, b) => a.Created - b.Created));
    }
  }, [fileData]);

  return (
    <>
      <ul className="ui-userlist ui-attachmentlist">
        {fileData != null
          ? fileData.sort((a, b) => (a.Created < b.Created ? 1 : -1)).map((item, i) => (
              <li key={i}>
                <div className="imageWrapper">
                  <div className={`flex icon-type-list-${getFileExtensionForClass(item.name)}`}>
                    <div>{showFileAttachmentConditional(item.name)}</div>
                    {getFileNameWithoutExtension(item.name).length > 25 ? (
                      <div className="flex attachment-text-container">
                        <div className="img-name-with-creator">
                          <div className="only-img-name flex">
                            <div className="cut-text ">
                              {`${getFileNameWithoutExtension(item.name).substring(
                                0,
                                24,
                              )}...`}
                            </div>
                            <div className="padding-top-4">
                              {getFileExtension(item.name)}
                            </div>
                          </div>
                          <div className="creator-name-with-img">
                            <div>
                              {item.CreatedBy && item.CreatedBy.Name}
                            </div>
                            <div>
                              {
                                item.Created
                                  ? <ShowDateTime dateTimeValue={item.Created} /> : <ShowDateTime dateTimeValue={new Date()} />
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="img-name-with-creator">
                        <div className="cut-text only-img-name">
                          {item.name}
                        </div>
                        <div className="creator-name-with-img">
                          <div>
                            {item.CreatedBy && item.CreatedBy.Name}
                          </div>
                          <div>
                          {
                            item.Created
                              ? <ShowDateTime dateTimeValue={item.Created} /> : <ShowDateTime dateTimeValue={new Date()} />
                          }
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  { item.IsDeletable === undefined || item.IsDeletable === true
                    ? <div className={`flex mousehver-download file-mouse-hover-for-create mousehver-download-${getFileExtensionForClass(item.name)}`}>
                    <div className="downlaod-text"> {niceBytes(item.size)} </div>
                    <div className="remove-file-close" onClick={() => { handleRemove(item); }}>
                      <Icon iconName="Cancel" />
                    </div>
                  </div>
                    : <div onClick={(e) => { e.preventDefault(); window.location.href = item.BlobUrl; }} target="_self" className={`flex mousehver-download mousehver-download-${getFileExtensionForClass(item.name)}`}>
                    <div className="downlaod-text">
                        {niceBytes(item.size)}
                    </div>
                    <div>
                        <SystemUpdateAltIcon className="file-icon" />
                    </div>
                  </div>
                  }
                </div>
              </li>
          ))
          : null}
      </ul>
    </>
  );
};

export default FileListAfterUpload;
