/* eslint-disable no-nested-ternary */
// @flow
import * as React from 'react';
import { useSelector } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import { isEmpty } from 'lodash';
import ReaderListMobile from './list-tables/list-tables-mobile';
import ReaderListOthers from './list-tables/list-tables-others';

type Props = {
  isMobileLayout: boolean,
  selectedTemplate: ?{}
};

const headCells = [
  { id: 'level', label: 'ステップ名', width: 150 },
  { id: 'approver', label: '承認者', width: 350 },
  { id: 'option', label: '選択', width: 245 },
  { id: 'onlyApprove', label: '承認のみを許可する', width: 245 },
  { id: 'viewer', label: '閲覧者', width: 270 },
  { id: 'deleteAction', label: '削除', width: 60 },
];

export default function ApproverReaderList(props: Props): React.Node {
  const { isMobileLayout, selectedTemplate } = props;
  const { selectApproverReaderTemp } = useSelector((state) => state.request);
  const [selectedApproverReaderTemp, setSelectedApproverReaderTemp] = React.useState(null);

  React.useEffect(() => {
    if (selectApproverReaderTemp) {
      setSelectedApproverReaderTemp(selectApproverReaderTemp);
    }
  }, [selectApproverReaderTemp]);

  return (
    <>
      <Paper
        className={`${
          isMobileLayout ? 'mobile-view' : 'desktop-view'
        }`}
      >
        {!isEmpty(selectedApproverReaderTemp) ? (
          isMobileLayout ? (
            <ReaderListMobile
              headCells={headCells}
              selectedApproverReaderTemp={selectedApproverReaderTemp}
              selectedTemplate = {selectedTemplate}
            />
          ) : (
            <ReaderListOthers
              headCells={headCells}
              selectedApproverReaderTemp={selectedApproverReaderTemp}
            />
          )
        ) : null}
      </Paper>
    </>
  );
}
