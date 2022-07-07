import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import { getId } from 'office-ui-fabric-react/lib/Utilities';
import { Modal, mergeStyleSets } from 'office-ui-fabric-react';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { ChoiceGroup } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { TeamPeoplePickerV2 } from '../utility/TeamPeoplePickerV2';
import Laguage from '../utility/Language';
import TeamTextField from '../utility/TeamTextField';

const ApproverReaderModal = ({
  toggleApproverReaderModal,
  showApproverReaderModal = false,
  requestId,
  Title,
  inAppUse: showCancelControls,
  onApproverReaderSelected,
}) => {
  const contentStyles = mergeStyleSets({
    labelStyle: {
      fontWight: 'normal',
      fontSize: '14px',
      fontFamily: 'Roboto',
      fontWeight: 400,
      color: '#828282',
    },
    textField: {
      fontWeight: 'normal',
      fontSize: '14px !important',
      selectors: {
        '::placeholder': {
          fontSize: '14px !important',
        },
      },
    },
  });
  const radioContainer = {
    flexContainer: {
      display: 'flex',
      flexDirection: 'row',
      paddingBottom: 5,
      paddingTop: 10,
    },
    root: {
      selectors: {
        '.ms-ChoiceField-wrapper': {
          fontWeight: 'normal',
          fontSize: '14px',
          fontFamily: 'Roboto',
          paddingRight: 10,
          color: '#828282',
        },
      },
    },
  };
  const dispatch = useDispatch();
  const [levelName, setLevelName] = useState('');
  const [selectedViewer, setSelectedViewer] = useState(null);
  const [selectedApprover, setSelectedApprover] = useState(null);
  const [defaultApproverList, setDefaultApproverList] = useState(null);
  const [defaultViewerList, setDefaultViewerList] = useState(null);
  const [selectedLang] = useState(Laguage.jap);
  const [showmodal, setShowmodal] = useState(false);
  const [selectedKey, setSelectedKey] = React.useState('E');
  const [saveBtnActive, setSaveBtnActive] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const { selectApproverReaderTemp } = useSelector((state) => state.request);
  const [isOnlyApproved, setIsOnlyApproved] = useState(false);

  const clearAllData = () => {
    setSelectedApprover(null);
    setSelectedViewer(null);
    setDefaultApproverList(null);
    setDefaultViewerList(null);
    setSelectedKey('E');
  };

  useEffect(() => {
    if (selectApproverReaderTemp) {
      setTimeout(() => {
        setCurrentLevel(selectApproverReaderTemp.length + 1);
      }, 500);
    }
  }, [selectApproverReaderTemp]);

  useEffect(() => {
    setShowmodal(showApproverReaderModal);
  }, [showApproverReaderModal]);

  useEffect(() => {
    if (selectedApprover && selectedApprover.length > 0) {
      setSaveBtnActive(true);
    } else {
      setSaveBtnActive(false);
    }
  }, [selectedApprover]);

  const _titleId = getId('title');
  const _subtitleId = getId('subText');
  const hideModal = () => {
    // setShowmodal(false);
    clearAllData();
    setTimeout(() => {
      toggleApproverReaderModal(false);
    }, 100);
  };

  const onChangeApprover = (selectedApproverObj) => {
    if (!selectedApproverObj) {
      return;
    }
    setSelectedApprover(selectedApproverObj);
  };

  const onChangeReader = (selectedViewerObj) => {
    if (!selectedViewerObj) {
      return;
    }
    setSelectedViewer(selectedViewerObj);
  };

  const options = [
    { key: 'E', text: selectedLang.needEveryOneApproval },
    { key: 'S', text: selectedLang.justASingleApproval },
  ];

  const onChange = React.useCallback((ev, option) => {
    setSelectedKey(option.key);
  }, []);

  const onClickSaveApproverViewer = () => {
    onApproverReaderSelected(
      selectedApprover,
      selectedViewer,
      selectedKey,
      currentLevel,
      levelName,
      isOnlyApproved,
    );
    hideModal();
  };

  const changeLevelName = (value) => {
    setLevelName(value);
  };

  const handleChangeIsOnlyApproved = (event) => {
    setIsOnlyApproved(event.target.checked);
  };
  const BlueCheckBox = withStyles({
    root: {
      '&$checked': {
        color: '#0e7bc6',
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);
  return (
    <div>
      <Modal
        titleAriaId={_titleId}
        subtitleAriaId={_subtitleId}
        isOpen={showmodal}
        isBlocking={false}
        containerClassName="approverModal"
        dragOptions={undefined}
      >
        <div className="modal-header">
          <span className="modal-title" id={_titleId}>
            {selectedLang.CurrentLevelTitle} : {currentLevel}
          </span>
          <div
            className="close-icon-text flex text-with-icon"
            onClick={hideModal}
          >
            <div className="top-close-button">
              <Icon iconName="Cancel" />
            </div>
            <span className="close-text">{selectedLang.Close}</span>
          </div>
        </div>
        <div className="create-form-body-parent approver-body-parent">
          <Label className={contentStyles.labelStyle}>
            {selectedLang.StepName}
          </Label>
          <TeamTextField
            inputClassName={contentStyles.textField}
            value={levelName}
            onChangeTextField={(e) => changeLevelName(e.target.value)}
            placeholder={selectedLang.StepNamePlaceholder}
            className='step-name'
          />
          <div className="flex padding-top-10px">
            <Label className={contentStyles.labelStyle}>
              {selectedLang.Approver}
            </Label>
            <div className="required approver-required">
              {selectedLang.RequiredWithUnicode}
            </div>
          </div>
          <TeamPeoplePickerV2
            onItemsChange={onChangeApprover}
            selectedPeopleList={defaultApproverList}
            placeholder={selectedLang.selectApproverPlaceholder}
          />
          <ChoiceGroup
            styles={radioContainer}
            selectedKey={selectedKey}
            options={options}
            onChange={onChange}
          />
          <FormControlLabel className='chkbox-only-approve'
            control= {<BlueCheckBox checked={isOnlyApproved} onChange={handleChangeIsOnlyApproved} name="IsOnlyApproved" />}
            label= {selectedLang.IsOnlyApprove}
          />
          <Label className={contentStyles.labelStyle}>
            {selectedLang.Reader}
          </Label>
          <TeamPeoplePickerV2
            onItemsChange={onChangeReader}
            selectedPeopleList={defaultViewerList}
            placeholder={selectedLang.selectReaderPlaceholder}
          />
        </div>
        <div className="bottom-div-center">
          <div className="child-modal-btn-container">
            <input
              className={`modal_create_button ${
                saveBtnActive ? 'button-active-blue' : 'button-inactive'
              }`}
              type="button"
              value={selectedLang.Save}
              title={selectedLang.Save}
              onClick={() => onClickSaveApproverViewer()}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default ApproverReaderModal;
