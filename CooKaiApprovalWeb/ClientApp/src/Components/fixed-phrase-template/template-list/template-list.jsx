import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import SearchIcon from '@material-ui/icons/Search';
import { Label } from 'office-ui-fabric-react/lib/Label';
import DeleteIcon from '@material-ui/icons/Delete';
import TableCell from '@material-ui/core/TableCell';
import clsx from 'clsx';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react';
import * as _ from 'lodash';
import Language from '../../utility/Language';
import ConfirmDialog from './confirm-dialog';

const GreenRadio = withStyles({
  root: {
    '&$checked': {
      color: blue[600],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const useStyle = makeStyles(() => ({
  inputPadding: {
    padding: 9,
    width: 370,
  },
}));

const StyledTableCell = withStyles(() => ({
  body: {
    fontSize: 12,
    borderBottom: '1px solid #d4cfcf',
    color: '#9e9e9e',
  },
  head: {
    borderTop: '2px solid #44809c',
    backgroundColor: '#e7f2fa',
  },
  root: {
    padding: 10,
  },
}))(TableCell);

function EnhancedTableHead(props) {
  const {
    order, orderBy, onRequestSort, headCells,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align="left"
            sortDirection={
              orderBy === headCell.id && headCell.canBeSorted ? order : false
            }
          >
            <TableSortLabel
              active={orderBy === headCell.id && headCell.canBeSorted}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              hideSortIcon={!headCell.canBeSorted}
            >
              <Label className="label-read-only">{headCell.label}</Label>
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const TemplateList = (props) => {
  const {
    savedTemplates,
    handleRadioChange,
    radioValue,
    handleSearchField,
    searchText,
    search,
    loading,
    headCells,
    column,
    handleRequestSort,
    order,
    confirmationContent,
    openConfirmationModal,
    handleOk,
    openModal,
    closeConfirmationModal,
    dialogTitle,
  } = props;
  const classes = useStyle();
  const [selectedLang] = useState(Language.jap);
  return (
    <>
      <div className="create-form-body-parent template-list-container">
        <Grid container spacing={1} justify="flex-end" alignItems="center">
          <Grid item>
            <RadioGroup
              name="templateStatus"
              row
              value={radioValue}
              onChange={handleRadioChange}
            >
              <FormControlLabel
                value="1"
                className='radio-button-active-inactive'
                control={<GreenRadio />}
                label={selectedLang.Active}
              />
              <FormControlLabel
                value="0"
                className='radio-button-active-inactive'
                control={<GreenRadio />}
                label={selectedLang.Inactive}
              />
            </RadioGroup>
          </Grid>
          <Grid item>
            <Box display="flex">
              <TextField
                id="search"
                variant="outlined"
                InputProps={{
                  classes: {
                    input: classes.inputPadding,
                  },
                }}
                value={searchText}
                onChange={handleSearchField}
                placeholder={selectedLang.SearchPlaceholder}
              />
              <Box pr={1} />
              <Button
                style={{ backgroundColor: blue[600] }}
                onClick={search}
                type="button"
              >
                <SearchIcon style={{ color: 'white' }} />
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Box pb={1.5} />
        <div
          style={{ overflowY: 'auto' }}
          className={clsx('template-list-table margin-bottom-10px')}
        >
          <Table stickyHeader>
            <EnhancedTableHead
              order={order}
              orderBy={column}
              onRequestSort={handleRequestSort}
              headCells={headCells}
            />
            {loading ? null : (
              <TableBody>
                {savedTemplates
                  && _.orderBy(savedTemplates, column, order).map((template) => (
                    <TableRow key={template.Id}>
                      <StyledTableCell align="left" variant="body">
                        <div className='first-col'>{template.Name}</div>
                      </StyledTableCell>
                      <StyledTableCell align="left" variant="body">
                        {template.Body}
                      </StyledTableCell>
                      <StyledTableCell align="left" variant="body">
                        {template.StepList.length}
                      </StyledTableCell>
                      <StyledTableCell align="left" variant="body">
                        {template.IsActive ? (
                          <span
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              const text = (
                                <div className='confirmation-body'>
                                  <strong>{template.Name}</strong>{selectedLang.InactiveConfirmation}
                                </div>
                              );
                              openConfirmationModal(
                                template.Id,
                                text,
                                'toggle',
                              );
                            }}
                          >
                            {selectedLang.Active}
                          </span>
                        ) : (
                          <span
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              const text = (
                                <div className='confirmation-body'>
                                   <strong>{template.Name}</strong>{selectedLang.ActiveConfirmation}
                                </div>
                              );
                              openConfirmationModal(
                                template.Id,
                                text,
                                'toggle',
                              );
                            }}
                          >
                            {selectedLang.Inactive}
                          </span>
                        )}
                      </StyledTableCell>
                      <StyledTableCell align="left" variant="body">
                        {template.Deletable ? (
                          <DeleteIcon
                            style={{
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              const text = (
                                <div className='confirmation-body'>
                                  <strong>{template.Name}</strong>{selectedLang.DeleteConfirmation}
                                </div>
                              );
                              openConfirmationModal(
                                template.Id,
                                text,
                                'delete',
                              );
                            }}
                          />
                        ) : null}
                      </StyledTableCell>
                    </TableRow>
                  ))}
              </TableBody>
            )}
          </Table>
          {loading ? (
            <div className="display-center" style={{ paddingTop: 100 }}>
              <Spinner size={SpinnerSize.large} />
            </div>
          ) : null}
          {openModal ? (
            <ConfirmDialog
              open={openModal}
              handleClose={closeConfirmationModal}
              contentText={confirmationContent}
              handleOk={handleOk}
              dialogTitle={dialogTitle}
            />
          ) : null}
        </div>
      </div>
      <div className="bottom-div bottom-padding-55px"></div>
    </>
  );
};

export default TemplateList;
