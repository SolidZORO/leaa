import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, message } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Tag } from '@leaa/common/src/entrys';
import { GET_TAG, UPDATE_TAG } from '@leaa/common/src/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { TagArgs, UpdateTagInput } from '@leaa/common/src/dtos/tag';
import { IPage, IKey } from '@leaa/dashboard/src/interfaces';
import { messageUtil } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { TagInfoForm } from '../_components/TagInfoForm/TagInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  // ref
  const [tagInfoFormRef, setTagInfoFormRef] = useState<any>();

  // query
  const getTagVariables = { id: Number(id) };
  const getTagQuery = useQuery<{ tag: Tag }, TagArgs>(GET_TAG, {
    variables: getTagVariables,
    fetchPolicy: 'network-only',
  });

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ id: number; tag: UpdateTagInput }>();
  const [updateTagMutate, updateTagMutation] = useMutation<Tag>(UPDATE_TAG, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => messageUtil.gqlCompleted(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [{ query: GET_TAG, variables: getTagVariables }],
  });

  const onSubmit = async () => {
    let hasError = false;
    let submitData: UpdateTagInput = {};

    tagInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: Tag) => {
      if (err) {
        hasError = true;
        message.error(err[Object.keys(err)[0]].errors[0].message);

        return;
      }

      submitData = formData;

      await setSubmitVariables({ id: Number(id), tag: submitData });
      await updateTagMutate();

      // keep form fields consistent with API
      tagInfoFormRef.props.form.resetFields();
    });
  };

  return (
    <PageCard
      title={
        <span>
          <Rcon type={props.route.icon} />
          <strong>{t(`${props.route.namei18n}`)}</strong>
        </span>
      }
      className={style['wapper']}
      loading={getTagQuery.loading || updateTagMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <TagInfoForm
        item={getTagQuery.data && getTagQuery.data.tag}
        loading={getTagQuery.loading}
        wrappedComponentRef={(inst: unknown) => setTagInfoFormRef(inst)}
      />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={UPDATE_BUTTON_ICON}
          className="submit-button"
          loading={updateTagMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
