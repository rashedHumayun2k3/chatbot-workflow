const classNames = mergeStyleSets({
    topControlsWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: '5px'
    },
    requestSearchContainer: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    listFilterActionsWrapper: {
        flexGrow: 1
    },
    searchWrapper: {
        flexGrow: 2
    },
    newTicketAndRowCountWrapper: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'row-reverse',
        height: '28px'
    },
    detailsListStyles: {
        contentWrapper: {},
        root: {
            fontSize: '12px !important',
            backgroundColor: '#fff'
        }
    }
});
const rowCountConfig = {
    styles: {
        root: { display: 'flex', flexDirection: 'row', height: '28px' },
        label: { marginRight: '10px', height: '28px' },
        title: {},
        dropdown: { width: 70 },
        dropdownItem: { height: '28px', minHeight: '28px' },
        dropdownItemSelected: { height: '28px', minHeight: '28px' }
    },
    options: [
        { key: 1, text: 10 },
        { key: 2, text: 25 },
        { key: 3, text: 50 },
        { key: 4, text: 100 }
    ],
    label: 'Rows per page',
    defaultSelectedKey: 1
};
const searchControlStyles = {
    field: {},
    root: { width: '200px' }
};