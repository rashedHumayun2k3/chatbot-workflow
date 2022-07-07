import React, { useState, useEffect } from 'react';
import {
  Table, Thead, Tbody, Tr, Td, Th,
} from 'react-super-responsive-table';
import { useDispatch, useSelector } from 'react-redux';
import { Label } from 'office-ui-fabric-react/lib/Label';
import DeleteIcon from '@material-ui/icons/Delete';
import { orderBy } from 'lodash';
import Laguage from '../../utility/Language';
import { storeRemoveApproverTemp } from '../../../actions/request-actions';
import ProfileWithAvatar from '../../utility/ProfileAvatar';

const ReaderListMobile = (props) => {
  const { headCells, selectedApproverReaderTemp, selectedTemplate } = props;
  const [selectedLang] = React.useState(Laguage.jap);
  const dispatch = useDispatch();

  const handleClick = (item) => {
    storeRemoveApproverTemp(dispatch, item.LevelNo);
  };

  return (
    <>
      <Table>
        <Thead>
          <Tr>
            {headCells.map((headCell) => (
              <Th
                key={headCell.id}
                align={'left'}
                className={'table-header-color'}
              >
                <Label className="label-read-only"> {headCell.label} </Label>
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody className="padding-left-30per-table-row">
          {selectedApproverReaderTemp
            && orderBy(selectedApproverReaderTemp, 'LevelNo', 'asc').map((item, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <Tr tabIndex={-1} key={index}>
                  <Td
                    className={'text-ellipsis'}
                    align={'left'}
                    variant={'body'}>
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
                  </Td>
                  <Td
                    className={'text-ellipsis'}
                    align={'left'}
                    variant={'body'}
                  >
                    {item.ApproverList
                      && item.ApproverList.map((app, iApp) => (
                        <ProfileWithAvatar key={iApp} name={app.Name} />
                      ))}
                  </Td>
                  <Td
                    className={'text-ellipsis'}
                    align={'left'}
                    variant={'body'}
                  >
                    {item.IsSingleApprover === false
                      ? selectedLang.needEveryOneApproval
                      : selectedLang.justASingleApproval}
                  </Td>
                  <Td
                    className={'text-ellipsis'}
                    align={'left'}
                    variant={'body'}
                  >
                    <div>
                      {item.IsApproveOnly === true ? <div>Yes</div> : <div>No</div>}
                    </div>
                  </Td>
                  <Td
                    className={`text-ellipsis ${
                      item.ViewerList && item.ViewerList.length > 0
                        ? 'show-row'
                        : 'hide'
                    }`}
                    align={'left'}
                    variant={'body'}
                  >
                    {item.ViewerList
                      && item.ViewerList.map((app, iApp) => (
                        <ProfileWithAvatar key={iApp} name={app.Name} />
                      ))}
                  </Td>
                  <Td
                    className={`text-ellipsis ${
                      (selectedApproverReaderTemp.length === item.LevelNo && !selectedTemplate)
                        ? 'show-row'
                        : 'hide'
                    }`}
                    align={'left'}
                    variant={'body'}
                    component="th"
                    id={labelId}
                    scope="row"
                  >
                    {(selectedApproverReaderTemp.length === item.LevelNo && !selectedTemplate) && (
                      <>
                      <DeleteIcon
                        className="deleteIcon-i"
                        onClick={() => handleClick(item)}
                      />
                      </>
                    )}
                  </Td>
                </Tr>
              );
            })}
        </Tbody>
      </Table>
    </>
  );
};

export default ReaderListMobile;
