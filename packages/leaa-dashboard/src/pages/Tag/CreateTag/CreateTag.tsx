import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { Tag } from '@leaa/common/src/entrys';
import { CreateTagInput } from '@leaa/common/src/dtos/tag';
import { IPage, IKey } from '@leaa/dashboard/src/interfaces';
import { CREATE_TAG } from '@leaa/common/src/graphqls';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { messageUtil } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { TagInfoForm } from '../_components/TagInfoForm/TagInfoForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // ref
  const [tagInfoFormRef, setTagInfoFormRef] = useState<any>();

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ tag: CreateTagInput }>();
  const [createTagMutate, createTagMutation] = useMutation<{ createTag: Tag }>(CREATE_TAG, {
    variables: submitVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted({ createTag }) {
      messageUtil.gqlSuccess(t('_lang:createdSuccessfully'));
      props.history.push(`/tags/${createTag.id}`);
    },
  });

  const onSubmit = async () => {
    tagInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: CreateTagInput) => {
      if (err) {
        message.error(err[Object.keys(err)[0]].errors[0].message);

        return;
      }

      await setSubmitVariables({ tag: formData });
      await createTagMutate();
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
      loading={createTagMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <TagInfoForm wrappedComponentRef={(inst: unknown) => setTagInfoFormRef(inst)} />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={CREATE_BUTTON_ICON}
          className="submit-button"
          loading={createTagMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:create')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
