import React from 'react';
import ApprovalHistory from './approval-history';

const ApprovalHistoryContainer = () => {
  const headCells = [
    { id: 'level', label: 'ステップ', width: 125 },
    { id: 'approver', label: '承認者', width: 300 },
    { id: 'statusByUser', label: '個別ステータス', width: 115 },
    { id: 'responseDate', label: '承認日時', width: 130 },
    { id: 'option', label: '選択', width: 100 },
    { id: 'finalStatus', label: '全体ステータス', width: 120 },
  ];

  return (
    <>
      <ApprovalHistory headCells={headCells} />
    </>
  );
};
export default ApprovalHistoryContainer;
