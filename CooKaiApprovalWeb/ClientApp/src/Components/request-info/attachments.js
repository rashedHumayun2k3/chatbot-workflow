import React, { useState } from 'react';
import ListIcon from '@material-ui/icons/List';
import ImageIcon from '@material-ui/icons/Image';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import DescriptionIcon from '@material-ui/icons/Description';
import ViewDayIcon from '@material-ui/icons/ViewDay';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import Laguage from '../utility/Language';

const Attachments = (params) => {
  const { requestAttachment, totalAttachmentByte } = params;
  const [selectedLang] = useState(Laguage.jap);

  const excelType = ['xls', 'xlt', 'xlm', 'xlsx', 'xlsm', 'xltx', 'xltm', 'xlsb', 'xla', 'xlam', 'xll', 'xlw'];
  const imageType = ['jpg', 'jpeg', 'png', 'gif', 'tiff', 'raw', 'psd'];
  const pdfType = ['pdf'];
  const docType = ['doc', 'dot', 'wbk', 'docx', 'docm', 'dotx', 'dotm', 'docb'];
  const powerPointType = ['ppt', 'pot', 'pps', 'pptx', 'pptm', 'potx', 'potm', 'ppam', 'ppsx', 'ppsm', 'sldx', 'sldm'];
  const xlsx = 'xlsx';
  const jpg = 'jpg';
  const pdf = 'pdf';
  const doc = 'doc';
  const pptx = 'pptx';
  const others = 'others';

  const showFileAttachmentConditional = (filename) => {
    const fileExtension = filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
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
  const getFileExtension = (filename) => filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);

  const getFileNameWithoutExtension = (filename) => filename.split('.').slice(0, -1).join('.');

  const getFileExtensionForClass = (filename) => {
    const fileExtension = filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
    if (getFileExtensionByFileName(fileExtension)) {
      return getFileExtensionByFileName(fileExtension);
    }
    return others;
  };
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  function niceBytes(x) {
    let l = 0; let
      n = parseInt(x, 10) || 0;
    while (n >= 1024 && ++l) {
      n /= 1024;
    }
    return (`${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`);
  }

  function handleRemove(removedItem) {
    if (removedItem && removedItem.BlobUrl) {
     // removeBlobFileData(dispatch, removedItem);
    }
   // removeFileData(dispatch, removedItem);
  }

  return (<>
            <div className="detail-label">{ requestAttachment && requestAttachment.length > 0
              ? <div>
                {requestAttachment.length}
                {selectedLang.FilesTotal}
                {niceBytes(totalAttachmentByte)}
              </div> : null}
            </div>
            <div className="ui-attachmentlist-container">
                <ul className="ui-userlist ui-attachmentlist">
                    {
                        requestAttachment != null ? requestAttachment.sort((a, b) => (a.Created < b.Created ? 1 : -1)).map((item, i) => <li key={i}>
                                  <div className="imageWrapper">
                                    <div className={`flex icon-type-list-${getFileExtensionForClass(item.FileName)}`}>
                                        <div>
                                            {
                                                showFileAttachmentConditional(item.FileName)
                                            }
                                        </div>
                                        {
                                          getFileNameWithoutExtension(item.FileName).length > 43
                                            ? <div className="flex attachment-text-container">
                                                <div className="cut-text">
                                                {
                                                  `${getFileNameWithoutExtension(item.FileName).substring(0, 40)}...`
                                                }
                                              </div>
                                              <div className="padding-top-4">
                                                  {getFileExtension(item.FileName)}
                                              </div>
                                          </div>
                                            : <div className="cut-text">
                                              {
                                                  item.FileName
                                              }
                                          </div>
                                        }
                                    </div>
                                    <div className={`flex mousehver-download file-mouse-hover-for-create mousehver-download-${getFileExtensionForClass(item.FileName)}`}>
                                        <div className="downlaod-text">
                                            {niceBytes(item.FileSize)}
                                        </div>
                                        <div className="remove-file-close" onClick={() => { handleRemove(item); }} >
                                            <Icon iconName="Cancel" />
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="imageWrapper">
                                    <div className={`flex icon-type-list-${getFileExtensionForClass(item.FileName)}`}>
                                        <div>
                                            {
                                                showFileAttachmentConditional(item.FileName)
                                            }

                                        </div>
                                        {
                                          getFileNameWithoutExtension(item.FileName).length > 43
                                            ? <div className="flex attachment-text-container">
                                                <div className="cut-text">
                                                {
                                                  `${getFileNameWithoutExtension(item.FileName).substring(0, 40)}...`
                                                }
                                              </div>
                                              <div className="padding-top-4">
                                                  {getFileExtension(item.FileName)}
                                              </div>
                                          </div>
                                            : <div className="cut-text">
                                              {
                                                  item.FileName
                                              }
                                              </div>
                                        }
                                    </div>
                                    <div onClick={(e) => {
                                      e.preventDefault();
                                      window.location.href = item.FileUrl;
                                    }} target="_self" className={`flex mousehver-download mousehver-download-${getFileExtensionForClass(item.FileName)}`}>
                                        <div className="downlaod-text">
                                            {niceBytes(item.FileSize)}
                                        </div>
                                        <div>
                                            <SystemUpdateAltIcon className="file-icon" />
                                        </div>
                                    </div>
                                </div> */}
                            </li>) : null
                    }

                </ul>
            </div>
          </>
  );
};
export default Attachments;
