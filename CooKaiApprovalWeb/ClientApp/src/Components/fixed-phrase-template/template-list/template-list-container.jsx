import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as _ from 'lodash';
import TemplateList from './template-list';
import {
  deleteTemplate,
  getTemplateList,
  templateVisibility,
} from '../../../actions/template-actions';
import Language from '../../utility/Language';

const TemplateListContainer = () => {
  const dispatch = useDispatch();
  const { templates } = useSelector((state) => state.template);

  const [savedTemplates, setSaveTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [radioValue, setRadioValue] = useState('1');
  const [searchText, setSearchText] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [confirmationContent, setConfirmationContent] = useState('');
  const [confirmType, setConfirmType] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [selectedLang] = useState(Language.jap);
  const [dialogTitle, setDialogTitle] = useState(selectedLang.Delete);

  const getAllTemplate = async () => {
    setLoading(true);
    await getTemplateList(dispatch, _.isEqual(radioValue, '1'));
    setLoading(false);
  };

  useEffect(() => {
    getAllTemplate();
  }, [radioValue]);

  useEffect(() => {
    if (templates) {
      setSaveTemplates(templates);
    }
  }, [templates]);

  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
  };

  const handleSearchField = (event) => {
    setSearchText(event.target.value);
  };

  const search = () => {
    if (_.isEmpty(searchText)) {
      setSaveTemplates(templates);
    } else {
      setSaveTemplates(
        _.filter(
          templates,
          (template) => _.includes(template.Name.toLowerCase(), searchText.toLowerCase())
            || _.includes(template.Body.toLowerCase(), searchText.toLowerCase()),
        ),
      );
    }
  };

  const templateDelete = async () => {
    await deleteTemplate(dispatch, templateId);
  };

  const toggleTemplate = async () => {
    await templateVisibility(dispatch, templateId, _.isEqual(radioValue, '1'));
  };

  const headCells = [
    {
      id: 'Name',
      label: selectedLang.templateName,
      canBeSorted: true,
    },
    {
      id: 'Body',
      label: selectedLang.TemplateBody,
      canBeSorted: true,
    },
    {
      id: 'StepCount',
      label: selectedLang.TotalStep,
      canBeSorted: true,
    },
    {
      id: 'Toggle',
      label: selectedLang.Toggle,
      canBeSorted: false,
    },
    {
      id: 'Delete',
      label: selectedLang.Delete,
      canBeSorted: false,
    },
  ];

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const openConfirmationModal = (id, text, type) => {
    setTemplateId(id);
    setConfirmType(type);
    setConfirmationContent(text);
    setOpenModal(true);
    if (_.isEqual(type, 'delete')) {
      setDialogTitle(selectedLang.Delete);
    } else {
      setDialogTitle(selectedLang.Toggle);
    }
  };

  const handleOk = async () => {
    if (_.isEqual(confirmType, 'delete')) {
      await templateDelete();
    } else {
      await toggleTemplate();
    }
    setConfirmationContent('');
    setOpenModal(false);
  };

  const closeConfirmationModal = () => {
    setConfirmationContent('');
    setOpenModal(false);
  };

  return (
    <>
      <TemplateList
        savedTemplates={savedTemplates}
        handleRadioChange={handleRadioChange}
        radioValue={radioValue}
        searchText={searchText}
        handleSearchField={handleSearchField}
        search={search}
        loading={loading}
        headCells={headCells}
        handleRequestSort={handleRequestSort}
        order={order}
        column={orderBy}
        openModal={openModal}
        confirmationContent={confirmationContent}
        openConfirmationModal={openConfirmationModal}
        handleOk={handleOk}
        closeConfirmationModal={closeConfirmationModal}
        dialogTitle={dialogTitle}
      />
    </>
  );
};

export default TemplateListContainer;
