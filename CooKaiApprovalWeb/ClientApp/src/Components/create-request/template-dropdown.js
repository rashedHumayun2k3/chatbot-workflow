import React, { useState, useEffect } from 'react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import Laguage from '../utility/Language';
import ConstantValue from '../utility/constantValue';
import { clearApproverReaderTemp, saveSelectedTemplateIntoRedux } from '../../actions/request-actions';

const TemplateDropdownList = (props) => {
  const { contentStyles, ddlTemplateOptions, selectedTemplate } = props;
  const [selectedLang] = useState(Laguage.jap);
  const [selectedKey, setSelectedKey] = useState(ConstantValue.emptyGuid);
  const { requestDetails, templateList } = useSelector((state) => state.request);
  const dropdownStyles = {
    dropdownItemHeader: {
      fontWeight: 'bold !important',
      fontSize: '14px',
      color: '#333333',
      lineHeight: '28px',
      height: '28px',
    },
    dropdown: {
      width: '100%',
      color: '#828282',
      selectors: {
        '& :hover': {
          borderColor: '#087bc6 !important', // drop-down box hover
        },
        '&:active': {
          color: 'red !important', // drop-down box hover
        },
      },
    },

    dropdownItem: {
      fontWeight: 'normal !important',
      fontSize: '14px !important',
      color: '#333333',
      minHeight: '28px !important',
    },
    dropdownItems: {
      selectors: {
        '& :hover': {
          backgroundColor: '#E7F2FA !important', // item hover
        },
      },
    },
    dropdownItemSelected: {
      background: '#ffffff',
      color: '#0E7BC6',
      fontSize: '14px !important',
      minHeight: '28px',
    },
    title: { borderColor: '#e5e5e5', height: 40, paddingTop: 5 },
    caretDown: { paddingTop: 5, color: '#828282' },
  };
  const dispatch = useDispatch();

  const templateValueAfterChange = (item) => {
    clearApproverReaderTemp(dispatch);
    setSelectedKey(item.key);
    props.getSelectedTemplate(item);
  };

  const onChange = (event, item) => {
    templateValueAfterChange(item);
  };

  // const { selectedTemplateFromUser } = useSelector((state) => state.request);

  // useEffect(() => {
  //   if (selectedTemplateFromUser) {
  //     setSelectedKey(selectedTemplateFromUser.Id);
  //   }
  // }, [selectedTemplateFromUser]);

  // useEffect(() => {
  //   if (requestDetails) {
  //     setSelectedKey(requestDetails.TemplateId);
  //   }
  // }, [requestDetails]);

  // useEffect(() => {
  //   if (templateList && requestDetails && templateList.length > 0 && requestDetails.TemplateId !== ConstantValue.emptyGuid) {
  //     debugger
  //     const selectedItem = templateList.find(
  //       (element) => element.Id === requestDetails.TemplateId,
  //     );
  //     saveSelectedTemplateIntoRedux(dispatch, selectedItem);
  //   }
  // }, [templateList]);

  useEffect(() => {
    if (selectedTemplate) {
      setSelectedKey(selectedTemplate.Id);
    }
  }, [selectedTemplate]);

  return (
    <>
      <div className="common-title-value flex">
        <div className="detail-label template-lbl width-100px">
          <Label className={contentStyles.labelStyle}>
            {' '}
            {selectedLang.TemplateTitle}
          </Label>
        </div>
        <div className="width-calc-100px">
          <Dropdown
            selectedKey={selectedKey}
            options={ddlTemplateOptions}
            styles={dropdownStyles}
            onChange={onChange}
          />
        </div>
      </div>
    </>
  );
};

export default TemplateDropdownList;
