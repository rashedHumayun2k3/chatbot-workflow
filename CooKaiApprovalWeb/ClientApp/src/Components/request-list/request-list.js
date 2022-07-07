import React, { Component } from 'react';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import {
  CheckboxVisibility,
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
} from 'office-ui-fabric-react/lib/DetailsList';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { List } from 'office-ui-fabric-react/lib/List';
import * as moment from 'moment';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import AttachementIcon from '@material-ui/icons/AttachFile';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteRequest from '../delete-request/delete-request';
import Laguage from '../utility/Language';
import RequestInfo from '../request-info/Request-info';

const styles1 = mergeStyleSets({
  table: {
    maxWidth: '1765px',
  },
  tableCell: {
    paddingRight: '10px !important',
    // paddingLeft: '0px !important'
  },
});

class RequestList extends Component {
  _selection;

  constructor(props) {
    super(props);
    const { requestitems = [], showSpinner = false } = props;
    this._selection = new Selection({
      onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() }),
    });
    const selectedLang = Laguage.jap;
    const loggedInUser = localStorage.getItem('currentUser');
    this.toggleCreateRequestModal = this.toggleCreateRequestModal.bind(this);
    this._filterList = this._filterList.bind(this);
    this.getPaginatedItems = this.getPaginatedItems.bind(this);
    this._onColumnClick = this._onColumnClick.bind(this);
    this.searchBydaterange = this.searchBydaterange.bind(this);
    this.toggleDeleteRequestModal = this.toggleDeleteRequestModal.bind(this);
    const columns = [
      {
        key: 'column1',
        name: selectedLang.Title,
        fieldName: 'Title',
        minWidth: 200,
        maxWidth: 370,
        isRowHeader: true,
        isResizable: true,
        isSorted: false,
        isSortedDescending: true,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        onColumnClick: this._onColumnClick,
        data: 'string',
        isPadded: true,
        className: styles1.tableCell,
        onRender: (item) => {
          if (item.Title) {
            return (
              <>
                <span className="requestListTitle">{item.Title}</span>
                <span className="request-id-container-in-list">
                  ({item.Id})
                </span>
              </>
            );
          }
          return null;
        },
      },
      {
        key: 'column2',
        name: selectedLang.templateName,
        fieldName: 'TemplateName',
        minWidth: 100,
        maxWidth: 300,
        isRowHeader: true,
        isResizable: true,
        isSorted: false,
        isSortedDescending: true,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        onColumnClick: this._onColumnClick,
        data: 'string',
        isPadded: true,
        className: styles1.tableCell,
        onRender: (item) => {
          if (item.Title) {
            return (
              <>
                <span>{item.TemplateName}</span>
              </>
            );
          }
          return null;
        },
      },
      {
        key: 'column3',
        name: selectedLang.ApplicantName,
        fieldName: 'RequestCreator',
        minWidth: 110,
        maxWidth: 150,
        isRowHeader: true,
        isResizable: true,
        isSorted: false,
        isSortedDescending: true,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        onColumnClick: this._onColumnClick,
        data: 'string',
        isPadded: true,
        className: styles1.tableCell,
        // className: styles3,
        // styles: styles2,
        onRender: (item) => {
          if (item.Title) {
            return <span>{item.RequestCreator.Name}</span>;
          }
          return null;
        },
      },
      {
        key: 'column4',
        name: selectedLang.Attachement,
        fieldName: 'AttachmentCount',
        minWidth: 40,
        maxWidth: 80,
        isRowHeader: true,
        isResizable: true,
        isSorted: false,
        isSortedDescending: true,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        onColumnClick: this._onColumnClick,
        data: 'string',
        isPadded: true,
        className: styles1.tableCell,
        onRender: (item) => {
          if (item.AttachmentCount && item.AttachmentCount > 0) {
            return (
              <span>
                <AttachementIcon className="attachIcon" />{' '}
                {item.AttachmentCount}
              </span>
            );
          }
          return null;
        },
      },
      {
        key: 'column5',
        name: selectedLang.Requestedon,
        fieldName: 'RequestDate',
        minWidth: 110,
        maxWidth: 120,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: true,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        onColumnClick: this._onColumnClick,
        data: 'string',
        isPadded: true,
        className: styles1.tableCell,
        onRender: (item) => {
          if (item.RequestDate) {
            return (
              <span>{moment(item.RequestDate).format('YYYY/MM/DD HH:mm')}</span>
            );
          }
          return null;
        },
      },
      {
        key: 'column6',
        name: selectedLang.DesiredCompletionDate,
        fieldName: 'Desired Complete Date',
        minWidth: 110,
        maxWidth: 120,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: true,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        onColumnClick: this._onColumnClick,
        data: 'string',
        isPadded: true,
        className: styles1.tableCell,
        onRender: (item) => {
          if (item.RequestDate) {
            return (
              <span>{item.DesiredCompletionDate && moment(item.DesiredCompletionDate).format('YYYY/MM/DD')}</span>
            );
          }
          return null;
        },
      },
      {
        key: 'column7',
        name: selectedLang.Approver,
        fieldName: 'ApproverList',
        minWidth: 110,
        maxWidth: 130,
        isRowHeader: true,
        isResizable: true,
        isSorted: false,
        isSortedDescending: false,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        onColumnClick: this._onColumnClick,
        data: 'string',
        isPadded: true,
        className: styles1.tableCell,
        onRender: (item) => (
          <List
            style={{ color: '#333333' }}
            items={item.CurrentLevelDetails.ApproverList}
            onRenderCell={this._renderApprover}
          ></List>
        ),
      },
      {
        key: 'column8',
        name: selectedLang.ResponseDate,
        fieldName: 'ApproverListDate',
        minWidth: 110,
        maxWidth: 120,
        isRowHeader: true,
        isResizable: true,
        isSorted: false,
        // isSortedDescending: false,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        onColumnClick: this._onColumnClick,
        data: 'string',
        isPadded: true,
        className: styles1.tableCell,
        onRender: (item) => (
          // return <span>{item.Responsedate}</span>;
          <List
            items={item.CurrentLevelDetails.ApproverList}
            onRenderCell={this._renderResponseDate}
          ></List>
        ),
      },
      {
        key: 'column9',
        name: selectedLang.Status,
        fieldName: 'ApprovalStatus',
        // minWidth: 90,
        // maxWidth: 300,
        isRowHeader: true,
        isResizable: true,
        isSorted: false,
        // isSortedDescending: false,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        onColumnClick: this._onColumnClick,
        data: 'string',
        isPadded: true,
        onRender: (item) => {
          if (item.ApprovalStatus == null) {
            return (
              <span className="awaiting statusText">
                <Icon iconName="SkypeCircleClock" />{' '}
                {selectedLang.AwaitingApproval}{' '}
                <label>
                  ({item.TotalRespondedInCurrentLevel}/
                  {item.TotalApproversInCurrentLevel})
                </label>
              </span>
            );
          }
          if (item.ApprovalStatus == true) {
            return (
              <span className="approved statusText">
                <Icon iconName="SkypeCircleCheck" />{' '}
                {selectedLang.ApprovedApproval}{' '}
                <label>
                  ({item.TotalRespondedInCurrentLevel}/
                  {item.TotalApproversInCurrentLevel})
                </label>
              </span>
            );
          }
          return (
            <span className="rejected statusText">
              <Icon iconName="SkypeCircleMinus" />{' '}
              {selectedLang.RejectedApproval}{' '}
              <label>
                ({item.TotalRespondedInCurrentLevel}/
                {item.TotalApproversInCurrentLevel})
              </label>
            </span>
          );
        },
      },
      {
        key: 'column10',
        name: selectedLang.LevelNo,
        fieldName: 'ApprovalStatus',
        minWidth: 80,
        maxWidth: 90,
        isRowHeader: true,
        isResizable: true,
        isSorted: false,
        data: 'string',
        isPadded: true,
        onRender: (item) => (
          <div className="current-level-container">
            ({item.CurrentLevel}/{item.TotalLevel})
          </div>
        ),
      },
      {
        key: 'column12',
        fieldName: 'Delete',
        minWidth: 30,
        maxWidth: 40,
        isRowHeader: true,
        isResizable: true,
        isSorted: false,
        isSortedDescending: false,
        data: 'string',
        isPadded: false,
        onRender: (item) => {
          // if (item.ApprovalStatus == null
          //   && item.RequestCreator
          //   && JSON.parse(loggedInUser).currentLoggedInUserPrincipal === item.RequestCreator.UserPrincipalName) {
          const checkAllLevelStatus = this.checkEachLevelStatus(item.TotalLevel, item.CurrentLevel, item.ApprovalStatus);
          if (checkAllLevelStatus === true
              && (item.ApprovalStatus === null || item.ApprovalStatus === true)
              && item.RequestCreator
              && JSON.parse(loggedInUser).currentLoggedInUserPrincipal === item.RequestCreator.UserPrincipalName) {
            // const canDelete = this.getDeletePermission(item.CurrentLevelDetails && item.CurrentLevelDetails.ApproverList);
            const canDelete = true;
            if (canDelete) {
              return (
                <div
                  className="deleteIcon"
                  onClick={() => this.toggleDeleteRequestModal(true, item.Id, item.Title)
                  }
                >
                  <Tooltip title="削除">
                    <IconButton aria-label="削除">
                      <DeleteIcon className="deleteIcon-i" />
                    </IconButton>
                  </Tooltip>
                </div>
              );
            }
          }
        },
      },
    ];

    this.state = {
      createRequestFormVisible: false,
      items: requestitems, // current displayed items on page
      filteredItems: [], // filtered items
      response: requestitems, // main items list
      searchText: '',
      columns,
      selectionDetails: this._getSelectionDetails(),
      isCompactMode: true,
      announcedMessage: undefined,
      statusList: [],
      priorityList: [],
      resolvedStatusId: undefined,
      currentUserSpId: undefined,
      shouldMakeDefaultSelection: false,
      services: [],
      loadingSpinner: showSpinner,
      startdate: null,
      enddate: null,
      selectedItem: null,
      selectedLang,
      deleteRequestFormVisible: false,
      selectedRequestId: null,
      selectedRequestTitle: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      items: nextProps.requestitems,
      loadingSpinner: nextProps.showSpinner,
    });
  }

  render() {
    const {
      createRequestFormVisible,
      columns,
      items,
      loadingSpinner,
      selectedItem,
      deleteRequestFormVisible,
      selectedRequestId,
      selectedRequestTitle,
    } = this.state;
    return (
      <div className="requestNameContainer">
        <Fabric>
          <DetailsList
            items={items}
            compact={true}
            columns={columns}
            getKey={this._getKey}
            selectionMode={SelectionMode.single}
            checkboxVisibility={CheckboxVisibility.hidden}
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible={true}
            selection={this._selection}
            selectionPreservedOnEmptyClick={true}
            enterModalSelectionOnTouch={true}
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            checkButtonAriaLabel="Row checkbox"
          />
          {loadingSpinner && <Spinner size={SpinnerSize.large} />}
          {!items.length && !loadingSpinner && (
            <Label>表示するアイテムはありません</Label>
          )}
        </Fabric>
        <RequestInfo
          createRequestFormVisible={createRequestFormVisible}
          toggleCreateRequestModal={this.toggleCreateRequestModal}
          requestItem={selectedItem}
          inAppUse={true}
        />

        <DeleteRequest
          deleteRequestFormVisible={deleteRequestFormVisible}
          toggleDeleteRequestModal={this.toggleDeleteRequestModal}
          requestId={selectedRequestId}
          Title={selectedRequestTitle}
          inAppUse={true}
        />
      </div>
    );
  }

  toggleDeleteRequestModal(visiblity, id, title) {
    if (visiblity != null) {
      this.setState({
        deleteRequestFormVisible: visiblity,
        selectedRequestId: id,
        selectedRequestTitle: title,
      });
      this._selection.setAllSelected(false);
    }
  }

  toggleCreateRequestModal(shouldUpdateTheRequetList) {
    if (shouldUpdateTheRequetList != null) {
      this.setState({ createRequestFormVisible: false });
      this._selection.setAllSelected(false);
      this.setState({ selectedItem: null });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _getKey(item) {
    return item.key;
  }

  searchBydaterange() {
    const rqueststartdate = this.state.startdate;
    const rquestenddate = this.state.end;
    const filteredItems = this.state.response.filter(
      (i) => i.Requestedon
        && moment(i.Requestedon) >= moment(rqueststartdate)
        && moment(i.Requestedon) <= moment(rquestenddate),
    );
    this.setState({
      filteredItems,
      currentPage: 1,
    });
  }

  _filterList(ev, text) {
    const { response } = this.state;
    if (!this.state || !response) {
      return;
    }
    this.setState({
      searchText: text,
    });

    if (!text) {
      this.setState({
        filteredItems: this.state.items,
      });
    }

    const filteredItems = this.state.response.filter(
      (i) => (i.Title && i.Title.toLowerCase().indexOf(text.toLowerCase()) > -1)
        || (i.Approver
          && i.Approver.toLowerCase().indexOf(text.toLowerCase()) > -1),
    );
    this.setState({
      filteredItems,
      currentPage: 1,
    });
  }

  getPaginatedItems(start = 0, end = 10, items) {
    if (!this.state || !this.state.filteredItems) {
      return [];
    }
    if (!items) {
      items = this.state.filteredItems;
    }
    const newItems = items.filter((item, index) => {
      if (index < end && index >= start) {
        return item;
      }
      return false;
    });
    return newItems;
  }

  getStartIndexOfPageItems(pageNo) {
    return (pageNo - 1) * this.state.itemsPerPage;
  }

  getEndIndexOfPageItems(pageNo) {
    return pageNo * this.state.itemsPerPage;
  }

  _getSelectionDetails() {
    const item = this._selection.getSelection()[0];
    if (item) {
      setTimeout(() => {
        if (this.state.deleteRequestFormVisible === false) {
          this.setState({ createRequestFormVisible: true, selectedItem: item });
        }
      }, 500);
    }
  }

  _onColumnClick(ev, column) {
    const filteredItems = this.state.items;
    const { columns } = this.state;
    const newColumns = columns.slice();
    const currColumn = newColumns.filter(
      (currCol) => column.key === currCol.key,
    )[0];
    newColumns.forEach((newCol) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
        this.setState({
          announcedMessage: `${currColumn.name} is sorted ${
            currColumn.isSortedDescending ? 'descending' : 'ascending'
          }`,
        });
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    const newFilteredItems = this._copyAndSort(
      filteredItems,
      currColumn.fieldName,
      currColumn.isSortedDescending,
    );
    this.setState(
      {
        columns: newColumns,
        items: newFilteredItems,
      },
      () => {},
    );
  }

  // eslint-disable-next-line class-methods-use-this
  _renderResponseDate(item) {
    if (item.ResponseDate) {
      return (
        <div>
          <div className="">
            {moment(item.ResponseDate).format('YYYY/MM/DD HH:mm')}
          </div>
        </div>
      );
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _renderApprover(item) {
    if (item.Name != null) {
      let approvericon = '';
      if (item.HasApproved == true) {
        approvericon = (
          <Icon className="approved" iconName="SkypeCircleCheck" />
        );
      } else if (item.HasApproved == false) {
        approvericon = (
          <Icon className="rejected" iconName="SkypeCircleMinus" />
        );
      } else {
        approvericon = (
          <Icon className="awaiting" iconName="SkypeCircleClock" />
        );
      }
      return (
        <div>
          <div className="">
            {approvericon} {item.Name}
          </div>
        </div>
      );
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _copyAndSort(items, columnKey, isSortedDescending) {
    const key = columnKey;
    if (key === 'RequestCreator') {
      return items
        .slice(0)
        .sort((a, b) => ((
          isSortedDescending
            ? a[key].Name.toLowerCase() < b[key].Name.toLowerCase()
            : a[key].Name.toLowerCase() > b[key].Name.toLowerCase()
        )
          ? 1
          : -1));
    }
    if (key === 'ApproverList') {
      for (var i = 0; i < items.length; i++) {
        var aApproverList = items[i][key];
        aApproverList = aApproverList.slice(0).sort((x, y) => {
          const xName = x.Name == null ? '' : x.Name;
          const yName = y.Name == null ? '' : y.Name;
          return (
            isSortedDescending
              ? xName.toLowerCase() < yName.toLowerCase()
              : xName.toLowerCase() > yName.toLowerCase()
          )
            ? 1
            : -1;
        });
        var atext = aApproverList.map((item) => item.Name).join(',');
        items[i].approverText = atext;
        items[i][key] = aApproverList;
      }
      return items.slice(0).sort((a, b) => {
        const aText = a.approverText == null ? '' : a.approverText;
        const bText = b.approverText == null ? '' : b.approverText;
        return (
          isSortedDescending
            ? aText.toLowerCase() < bText.toLowerCase()
            : aText.toLowerCase() > bText.toLowerCase()
        )
          ? 1
          : -1;
      });
    }
    if (key === 'ApproverListDate') {
      for (var i = 0; i < items.length; i++) {
        var aApproverList = items[i].ApproverList;
        aApproverList = aApproverList
          .slice(0)
          .sort((x, y) => ((
            isSortedDescending
              ? x.ResponseDate < y.ResponseDate
              : x.ResponseDate > y.ResponseDate
          )
            ? 1
            : -1));
        var atext = aApproverList.map((item) => item.ResponseDate).join('\n');
        items[i].approverText = atext;
        items[i].ApproverList = aApproverList;
      }
      return items
        .slice(0)
        .sort((a, b) => ((
          isSortedDescending
            ? a.approverText < b.approverText
            : a.approverText > b.approverText
        )
          ? 1
          : -1));
    }

    return items
      .slice(0)
      .sort((a, b) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
  }

  // eslint-disable-next-line class-methods-use-this
  getDeletePermission(itemList) {
    const canDelete = true;
    if (itemList) {
      for (let i = 0; i < itemList.length; i++) {
        if (itemList[i].HasApproved !== null) {
          return false;
        }
      }
    }

    return canDelete;
  }

  checkEachLevelStatus(totalLevel, currentLevel, approvalStatus) {
    const canDelete = false;
    if (currentLevel === 1 && approvalStatus === null) {
      return true;
    }
    if (totalLevel === currentLevel && approvalStatus === true) {
      return true;
    }
    return canDelete;
  }
}
export default RequestList;
