import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import { useSelector } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import * as moment from 'moment';
import TableRow from '@material-ui/core/TableRow';
import { Label } from 'office-ui-fabric-react/lib/Label';
import Avatar from 'react-avatar';
import { orderBy } from 'lodash';
import Laguage from '../utility/Language';
import { ExportCSV } from '../utility/ExportCSV';

function ApprovarWithStatus(props) {
  const { appStatus, iApp } = props;
  const [selectedLang] = useState(Laguage.jap);
  return (
    <>
      <div className="each-status-record">
        <Table>
          <TableBody>
            <TableRow key={iApp}>
              <TableCell
                className="padding-margin-0 border-0"
                width="220px"
                align={'left'}
                variant={'body'}
              >
                <div className="comment-history-tr">
                  <div className="flex creator-container">
                    <div className="image-container">
                      <Avatar name={appStatus.Name} size="24" round={true} />
                    </div>
                    <div className="user-name-title text-ellipsis padding-top-5px">
                      {appStatus.Name}
                    </div>
                  </div>
                  <div className="user-comment remarks-font-style">
                    {appStatus.Comment}
                  </div>
                </div>
              </TableCell>
              <TableCell
                className="padding-margin-0 border-0"
                width="90px"
                align={'left'}
                variant={'body'}
              >
                <div>
                  {appStatus.HasApproved === null && (
                    <span className="awaiting statusText title-small-0">
                      <Icon iconName="SkypeCircleClock" />{' '}
                      {selectedLang.AwaitingApproval}{' '}
                    </span>
                  )}
                  {appStatus.HasApproved === true && (
                    <span className="approved statusText title-small-0">
                      <Icon iconName="SkypeCircleCheck" />{' '}
                      {selectedLang.ApprovedApproval}{' '}
                    </span>
                  )}
                  {appStatus.HasApproved === false && (
                    <span className="rejected statusText title-small-0">
                      <Icon iconName="SkypeCircleMinus" />{' '}
                      {selectedLang.RejectedApproval}{' '}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell
                className="padding-margin-0 title-small-0 border-0"
                width="90px"
                align={'left'}
                variant={'body'}
              >
                {appStatus.ResponseDate && (
                  <div>
                    {moment(appStatus.ResponseDate).format('YYYY/MM/DD HH:mm')}
                  </div>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
}

const ApprovalHistory = (props) => {
  const StyledTableCell = withStyles(() => ({
    body: {
      fontSize: 14,
    },
    root: {
      padding: 5,
    },
  }))(TableCell);

  const { headCells, selectedApproverReaderTemp } = props;
  const [selectedLang] = useState(Laguage.jap);
  const { requestDetails } = useSelector((state) => state.request);
  const [levels, setLevels] = useState([]);
  const [processLevelForExcel, setProcessLevelForExcel] = useState([]);
  useEffect(() => {
    if (requestDetails && requestDetails.Levels) {
      setLevels(requestDetails.Levels);
    }
  }, [requestDetails]);

  useEffect(() => {
    if (levels) {
      const dataListForAllLevel = [];
      orderBy(levels, 'LevelNo', 'asc').forEach((level) => {
        const {
          LevelName, ApproverList, IsSingleApprover, ApprovalStatusId,
        } = level;
        ApproverList.forEach((approver) => {
          const {
            Name, HasApproved, ResponseDate, Comment,
          } = approver;

          let finalApprovalStatus = selectedLang.PendingApproval;
          if (HasApproved === true) {
            finalApprovalStatus = selectedLang.ApprovedApproval;
          } else if (HasApproved === false) {
            finalApprovalStatus = selectedLang.RejectedApproval;
          }

          let overallStatus = selectedLang.AwaitingApproval;
          if (ApprovalStatusId === 2) {
            overallStatus = selectedLang.ApprovedApproval;
          }
          if (ApprovalStatusId === 3) {
            overallStatus = selectedLang.RejectedApproval;
          }

          const dataForEachApprover = {
            ステップ: LevelName,
            承認者: Name,
            個別ステータス: finalApprovalStatus,
            承認日時: ResponseDate && moment(ResponseDate).format('YYYY年 MM月 D日 HH:mm'),
            コメント: Comment,
            承認種別: IsSingleApprover === false ? selectedLang.needEveryOneApproval : selectedLang.justASingleApproval,
            全体ステータス: overallStatus,
          };
          dataListForAllLevel.push(dataForEachApprover);
        });
      });
      setProcessLevelForExcel(dataListForAllLevel);
    }
  }, [levels]);
  
  return (
    <>
      <div className="details-form-body-parent">
        <div className="details-form-body-child status-history-tab">
          <div className="approval-history-tab">
            <div className="approval-history-child">
              <div className="approval-status-list-container">
                <div className="flex header-bg">
                  {headCells.map((headCell, iHead) => (
                    <div
                      className="div-header-cell"
                      key={iHead}
                      style={{
                        width: headCell.width,
                      }}
                    >
                      <Label className="label-read-only">
                        {' '}
                        {headCell.label}{' '}
                      </Label>
                    </div>
                  ))}
                </div>
                <Table>
                  <TableBody className="padding-left-30per-table-row">
                    {levels
                      && orderBy(levels, 'LevelNo', 'asc').map((item, index) => (
                        <TableRow
                          tabIndex={-1}
                          key={index}
                          className={`${
                            item.ApprovalStatusId === 2
                              ? 'already-touched-approved'
                              : item.ApprovalStatusId === 3
                                && 'already-touched-deny'
                          }`}
                        >
                          <StyledTableCell align="left" variant="body">
                            <div className="flex title-small-0 level-container-round">
                              {
                                item.LevelName
                                  ? item.LevelName
                                  : <>
                                        <div>{selectedLang.LevelNo}</div>
                                        <div className="level-number-middle">-</div>
                                        <div>{item.LevelNo}</div>
                                    </>
                              }
                            </div>
                          </StyledTableCell>
                          <StyledTableCell align="left" variant="body">
                            {item.ApproverList
                              && item.ApproverList.map((app, iApp) => (
                                <ApprovarWithStatus
                                  key={iApp}
                                  iApp={iApp}
                                  appStatus={app}
                                />
                              ))}
                          </StyledTableCell>
                          <StyledTableCell align={'left'} variant={'body'}>
                            <div className="title-small-0">
                              {item.IsSingleApprover === false
                                ? selectedLang.needEveryOneApproval
                                : selectedLang.justASingleApproval}
                            </div>
                          </StyledTableCell>
                          <StyledTableCell align="left" variant="body">
                            <div>
                              {item.ApprovalStatusId === 1 && (
                                <span className="awaiting statusText title-small-0">
                                  <Icon iconName="SkypeCircleClock" />{' '}
                                  {selectedLang.AwaitingApproval}{' '}
                                </span>
                              )}
                              {item.ApprovalStatusId === 2 && (
                                <span className="approved statusText title-small-0">
                                  <Icon iconName="SkypeCircleCheck" />{' '}
                                  {selectedLang.ApprovedApproval}{' '}
                                </span>
                              )}
                              {item.ApprovalStatusId === 3 && (
                                <span className="rejected statusText title-small-0">
                                  <Icon iconName="SkypeCircleMinus" />{' '}
                                  {selectedLang.RejectedApproval}{' '}
                                </span>
                              )}
                            </div>
                          </StyledTableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-div">
        <div className="bottom-div-child">
          <ExportCSV csvData={processLevelForExcel}
              fileName={`ApprovalHistory_ ${moment(new Date()).format('DD-MMM-YYYY-hh-mm-ss')}.CSV`}/>
        </div>
      </div>
    </>
  );
};
export default ApprovalHistory;
