import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Icon, Button, Modal, message } from 'antd';

import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import {
  GET_SETTINGS,
  UPDATE_SETTING,
  UPDATE_SETTINGS,
  CREATE_SETTING,
  DELETE_SETTING,
} from '@leaa/common/src/graphqls';
import { Setting } from '@leaa/common/src/entrys';
import {
  SettingsWithPaginationObject,
  SettingArgs,
  UpdateSettingInput,
  CreateSettingInput,
  UpdateSettingsInput,
} from '@leaa/common/src/dtos/setting';
import { IPage } from '@leaa/dashboard/src/interfaces';
import { SettingListForm } from '@leaa/dashboard/src/pages/Setting/_components/SettingListForm/SettingListForm';
import { SettingModalForm } from '@leaa/dashboard/src/pages/Setting/_components/SettingModalForm/SettingModalForm';
import { PageCard } from '@leaa/dashboard/src/components/PageCard';
import { HtmlMeta } from '@leaa/dashboard/src/components/HtmlMeta';
import { ErrorCard } from '@leaa/dashboard/src/components/ErrorCard';
import { SubmitBar } from '@leaa/dashboard/src/components/SubmitBar';

import style from './style.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  let settingListFormRef: any;
  let settingInfoFormRef: any;

  const [modalData, setModalData] = useState<Setting | null>(null);
  const [modalType, setModalType] = useState<'create' | 'update' | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const onResetModalData = () => {
    if (settingInfoFormRef && settingInfoFormRef.props) {
      settingInfoFormRef.props.form.resetFields();
    }
  };

  const onCloseModalVisible = () => {
    setModalVisible(false);
  };

  const onAfterCloseModalVisible = () => {
    onResetModalData();
    setModalType(null);
    setModalData(null);
  };

  const onOpenCreateSetting = () => {
    onResetModalData();

    setModalType('create');
    setModalData(null);
    setModalVisible(true);
  };

  const onOpenUpdateSetting = (setting: Setting) => {
    onResetModalData();

    setModalType('update');
    setModalVisible(true);
    setModalData(setting);
  };

  const getSettingsQuery = useQuery<
    { settings: SettingsWithPaginationObject; fetchPolicy: 'network-only' },
    SettingArgs
  >(GET_SETTINGS);

  const [createSettingVariables, setCreateSettingVariables] = useState<{ setting: CreateSettingInput }>();
  const [createSettingMutate, createSettingMutation] = useMutation<Setting>(CREATE_SETTING, {
    variables: createSettingVariables,
    onCompleted: () => {
      message.success(t('_lang:createdSuccessfully'));
      onCloseModalVisible();
    },
    refetchQueries: () => [{ query: GET_SETTINGS }],
  });

  const [updateSettingVariables, setUpdateSettingVariables] = useState<{ id: number; setting: UpdateSettingInput }>();
  const [updateSettingMutate, updateSettingMutation] = useMutation<Setting>(UPDATE_SETTING, {
    variables: updateSettingVariables,
    onCompleted: () => {
      message.success(t('_lang:updatedSuccessfully'));
      onCloseModalVisible();
    },
    refetchQueries: () => [{ query: GET_SETTINGS }],
  });

  const [updateSettingsVariables, setUpdateSettingsVariables] = useState<{ settings: UpdateSettingsInput }>();
  const [updateSettingsMutate, updateSettingsMutation] = useMutation<Setting[]>(UPDATE_SETTINGS, {
    variables: updateSettingsVariables,
    onCompleted: () => {
      message.success(t('_lang:updatedSuccessfully'));
      onCloseModalVisible();
    },
    refetchQueries: () => [{ query: GET_SETTINGS }],
  });

  const [deleteSettingVariables, setDeleteSettingVariables] = useState<{ id: number }>();
  const [deleteSettingMutate, deleteSettingMutation] = useMutation<Setting[]>(DELETE_SETTING, {
    variables: deleteSettingVariables,
    onCompleted: () => {
      message.success(t('_lang:deletedSuccessfully'));
      onCloseModalVisible();
    },
    refetchQueries: () => [{ query: GET_SETTINGS }],
  });

  const onCreateSetting = async () => {
    settingInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: CreateSettingInput) => {
      if (err) {
        message.error(err[Object.keys(err)[0]].errors[0].message);

        return;
      }

      await setCreateSettingVariables({ setting: formData });
      await createSettingMutate();
    });
  };

  const onUpdateSetting = async () => {
    let submitData: UpdateSettingInput;

    settingInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: Setting) => {
      if (err) {
        message.error(err[Object.keys(err)[0]].errors[0].message);

        return;
      }

      const id = Number(formData.id);

      // eslint-disable-next-line no-param-reassign
      delete formData.id;

      submitData = {
        ...formData,
        sort: typeof formData.sort !== 'undefined' ? Number(formData.sort) : 0,
      };

      await setUpdateSettingVariables({ id, setting: submitData });
      await updateSettingMutate();
    });
  };

  const onUpdateSettings = async () => {
    settingListFormRef.props.form.validateFieldsAndScroll(
      async (err: any, formData: { settings: UpdateSettingsInput }) => {
        if (err) {
          message.error(err[Object.keys(err)[0]].errors[0].message);

          return;
        }

        await setUpdateSettingsVariables({ settings: formData.settings });
        await updateSettingsMutate();
      },
    );
  };

  const onDeleteSettings = async (id: number | null) => {
    if (!id) {
      message.error('ERROR');

      return;
    }

    await setDeleteSettingVariables({ id });
    await deleteSettingMutate();
  };

  return (
    <PageCard
      title={
        <span>
          <strong>{t(`${props.route.namei18n}`)}</strong>
          <Button onClick={onOpenCreateSetting} type="link">
            <Icon type="plus" />
          </Button>
        </span>
      }
      className={style['wapper']}
      loading={getSettingsQuery.loading || updateSettingsMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      {getSettingsQuery.error ? <ErrorCard error={getSettingsQuery.error} /> : null}
      {updateSettingMutation.error ? <ErrorCard error={updateSettingMutation.error} /> : null}
      {createSettingMutation.error ? <ErrorCard error={createSettingMutation.error} /> : null}
      {updateSettingsMutation.error ? <ErrorCard error={updateSettingsMutation.error} /> : null}
      {deleteSettingMutation.error ? <ErrorCard error={deleteSettingMutation.error} /> : null}

      <SettingListForm
        settings={getSettingsQuery.data && getSettingsQuery.data.settings && getSettingsQuery.data.settings.items}
        wrappedComponentRef={(inst: unknown) => {
          settingListFormRef = inst;
        }}
        onClickLabelEditCallback={onOpenUpdateSetting}
      />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={UPDATE_BUTTON_ICON}
          className="submit-button"
          loading={updateSettingsMutation.loading}
          onClick={onUpdateSettings}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>

      <Modal
        title={t(`_lang:${modalType}`)}
        visible={modalVisible}
        // visible
        onOk={modalType === 'update' ? onUpdateSetting : onCreateSetting}
        confirmLoading={updateSettingMutation.loading}
        className={style['setting-modal']}
        onCancel={onCloseModalVisible}
        afterClose={onAfterCloseModalVisible}
      >
        <div className={style['delete-button']}>
          <Button
            icon="delete"
            loading={deleteSettingMutation.loading}
            onClick={() => onDeleteSettings(modalData && modalData.id)}
          />
        </div>

        <SettingModalForm
          item={modalData}
          wrappedComponentRef={(inst: unknown) => {
            settingInfoFormRef = inst;
          }}
        />
      </Modal>
    </PageCard>
  );
};
