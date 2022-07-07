import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useDispatch } from 'react-redux';
import { Label } from 'office-ui-fabric-react/lib/Label';
import DeleteIcon from '@material-ui/icons/Delete';
import { isEmpty } from 'lodash';
import Laguage from '../../utility/Language';
import { storeRemoveApproverTemp } from '../../../actions/request-actions';
import ProfileWithAvatar from '../../utility/ProfileAvatar';

const StyledTableCell = withStyles(() => ({
  body: {
    fontSize: 14,
  },
  root: {
    padding: 5,
  },
}))(TableCell);

const ReaderListOthers = (props) => {
  const { headCells, selectedApproverReaderTemp } = props;
  const [selectedLang] = React.useState(Laguage.jap);
  const dispatch = useDispatch();

  const handleClick = (item) => {
    storeRemoveApproverTemp(dispatch, item.LevelNo);
  };

  return (
    <div
      className='template-list-others'
    >
      <Table>
        <TableHead>
          <TableRow
            classes={{
              root: 'table-header-color',
            }}
          >
            {headCells.map((headCell) => (
              <StyledTableCell
                key={headCell.id}
                align={'left'}
                style={{
                  width: headCell.width,
                }}
              >
                <Label className="label-read-only"> {headCell.label} </Label>
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody className="padding-left-30per-table-row">
          {selectedApproverReaderTemp
            && selectedApproverReaderTemp.map((item, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <TableRow tabIndex={-1} key={index}>
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
                  <StyledTableCell align={'left'} variant={'body'}>
                    {item.ApproverList
                      && item.ApproverList.map((app, iApp) => (
                        <ProfileWithAvatar key={iApp} name={app.Name} />
                      ))}
                  </StyledTableCell>
                  <StyledTableCell align={'left'} variant={'body'}>
                    {item.IsSingleApprover === false
                      ? selectedLang.needEveryOneApproval
                      : selectedLang.justASingleApproval}
                  </StyledTableCell>
                  <StyledTableCell align={'left'} variant={'body'}>
                    {item.IsApproveOnly === true ? <div>Yes</div> : <div>No</div>}
                  </StyledTableCell>
                  {!isEmpty(item.ViewerList) ? (
                    <StyledTableCell align={'left'} variant={'body'}>
                      {item.ViewerList
                        && item.ViewerList.map((app, iApp) => (
                          <ProfileWithAvatar key={iApp} name={app.Name} />
                        ))}
                    </StyledTableCell>
                  ) : (
                    <StyledTableCell>&nbsp;</StyledTableCell>
                  )}
                  {selectedApproverReaderTemp.length === item.LevelNo ? (
                    <StyledTableCell align="left" variant="body" id={labelId}>
                      <DeleteIcon
                        className="deleteIcon-i"
                        onClick={() => handleClick(item)}
                      />
                    </StyledTableCell>
                  ) : (
                    <StyledTableCell>&nbsp;</StyledTableCell>
                  )}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReaderListOthers;
