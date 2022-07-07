/* eslint-disable array-callback-return */
// @flow
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as microsoftTeams from '@microsoft/teams-js';
import queryString from 'query-string';
import { isEmpty, isEqual } from 'lodash';
import { createTemplate, setTemplateCreatingMode } from '../../actions/template-actions';
import FixedPhraseRegistration from './fixed-phrase-template';
import ConstantValue from '../utility/constantValue';
import { clearApproverReaderTemp } from '../../actions/request-actions';

type Props = {
  open: boolean,
  setOpen: (((boolean) => boolean) | boolean) => void,
};

const FixedPhraseRegistrationContainer = (props: Props): React.Node => {
  const { open, setOpen } = props;
  const { selectApproverReaderTemp } = useSelector((state) => state.request);
  const dispatch = useDispatch();

  const [templateName, setTemplateName]: [
    string,
    (((string) => string) | string) => void
  ] = React.useState('');

  const [templateBody, setTemplateBody]: [
    string,
    (((string) => string) | string) => void
  ] = React.useState('');

  const [showApproverReaderModal, setShowApproverReaderModal] = React.useState(
    false,
  );
  const [stepList, setStepList] = React.useState([]);

  React.useEffect(() => {
    if (!isEmpty(selectApproverReaderTemp)) {
      setStepList([]);
      selectApproverReaderTemp.map((item) => {
        const {
          ApproverList, LevelNo, ViewerList, LevelName, IsApproveOnly, IsSingleApprover,
        } = item;
        const tempStepList = {
          IsSingleApprover: IsSingleApprover === true,
          LevelNo,
          ApproverList,
          ViewerList,
          LevelName,
          IsApproveOnly,
        };
        setStepList((prev) => [...prev, tempStepList]);
      });
    }
  }, [selectApproverReaderTemp]);

  // bot context
  const [botContext, setBotContext] = React.useState(null);
  React.useEffect(() => {
    const { botCtx } = queryString.parse(window.location.search);
    setBotContext(botCtx);
    microsoftTeams.initialize();
  }, []);

  const saveTemplate = async () => {
    const templateData = {
      Id: ConstantValue.emptyGuid,
      Name: templateName,
      Body: templateBody,
      StepList: stepList,
    };
    await createTemplate(dispatch, templateData);
    await setTemplateCreatingMode(dispatch, false);
    await clearApproverReaderTemp(dispatch);
    setOpen(false);
  };

  const onChangeTitle = (event, value: string) => {
    setTemplateName(value);
  };

  const onChangeTemplateBody = (event, value: string) => {
    setTemplateBody(value);
  };

  return (
    <>
      <FixedPhraseRegistration
        open={open}
        setOpen={setOpen}
        saveTemplate={saveTemplate}
        botContext={botContext}
        onChangeTitle={onChangeTitle}
        onChangeTemplateBody={onChangeTemplateBody}
        templateName={templateName}
        templateBody={templateBody}
        invalid={
          isEmpty(templateName)
          || isEmpty(selectApproverReaderTemp)
          || selectApproverReaderTemp.length > 5
        }
        showApproverReaderModal={showApproverReaderModal}
        setShowApproverReaderModal={setShowApproverReaderModal}
        totalStepList={selectApproverReaderTemp.length}
      />
    </>
  );
};

export default FixedPhraseRegistrationContainer;
