import React, { useState, useRef } from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { Tag } from '@leaa/common/src/entrys';
import { CreateTagInput } from '@leaa/common/src/dtos/tag';
import { IPage, ICommenFormRef, ISubmitData } from '@leaa/dashboard/src/interfaces';
import { CREATE_TAG } from '@leaa/dashboard/src/graphqls';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { successMessage } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { TagInfoForm } from '../_components/TagInfoForm/TagInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // ref
  const infoFormRef = useRef<ICommenFormRef<CreateTagInput>>(null);

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ tag: CreateTagInput }>();
  const [createTagMutate, createTagMutation] = useMutation<{ createTag: Tag }>(CREATE_TAG, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted({ createTag }) {
      successMessage(t('_lang:createdSuccessfully'));
      props.history.push(`/tags/${createTag.id}`);
    },
  });

  const onSubmit = async () => {
    const infoData: ISubmitData<CreateTagInput> = await infoFormRef.current?.onValidateForm();

    if (!infoData) return;

    const submitData: ISubmitData<CreateTagInput> = {
      ...infoData,
    };

    await setSubmitVariables({ tag: submitData });
    await createTagMutate();
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
      loading={createTagMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <TagInfoForm ref={infoFormRef} />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={CREATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={createTagMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:create')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
