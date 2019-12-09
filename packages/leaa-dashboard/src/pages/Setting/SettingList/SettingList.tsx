import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Button, Modal, message } from 'antd';

import { UPDATE_BUTTON_ICON, PAGE_CARD_TITLE_CREATE_ICON } from '@leaa/dashboard/src/constants';
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
  SettingsArgs,
  UpdateSettingInput,
  CreateSettingInput,
  UpdateSettingsInput,
} from '@leaa/common/src/dtos/setting';
import { IPage } from '@leaa/dashboard/src/interfaces';
import { settingUtil, messageUtil } from '@leaa/dashboard/src/utils';

import { HtmlMeta, PageCard, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { SettingListForm } from '../_components/SettingListForm/SettingListForm';
import { SettingModalForm } from '../_components/SettingModalForm/SettingModalForm';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // ref
  const [settingListFormRef, setSettingListFormRef] = useState<any>();
  const [settingInfoFormRef, setSettingInfoFormRef] = useState<any>();

  const [modalData, setModalData] = useState<Setting | null>(null);
  const [modalType, setModalType] = useState<'create' | 'update' | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const onResetModalData = () => {
    if (settingInfoFormRef && settingInfoFormRef.props) {
      settingInfoFormRef.props.form.resetFields();
    }
  };

  const onRefreshSettings = () => {
    settingUtil.refreshLocalStorageSettings();
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

  // query
  const getSettingsQuery = useQuery<
    { settings: SettingsWithPaginationObject; fetchPolicy: 'network-only' },
    SettingsArgs
  >(GET_SETTINGS);

  // mutation
  const [createSettingVariables, setCreateSettingVariables] = useState<{ setting: CreateSettingInput }>();
  const [createSettingMutate] = useMutation<Setting>(CREATE_SETTING, {
    variables: createSettingVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => {
      messageUtil.gqlCompleted(t('_lang:createdSuccessfully'));
      onCloseModalVisible();
      onRefreshSettings();
    },
    refetchQueries: () => [{ query: GET_SETTINGS }],
  });

  const [updateSettingVariables, setUpdateSettingVariables] = useState<{ id: number; setting: UpdateSettingInput }>();
  const [updateSettingMutate, updateSettingMutation] = useMutation<Setting>(UPDATE_SETTING, {
    variables: updateSettingVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => {
      messageUtil.gqlCompleted(t('_lang:updatedSuccessfully'));
      onCloseModalVisible();
      onRefreshSettings();
    },
    refetchQueries: () => [{ query: GET_SETTINGS }],
  });

  const [updateSettingsVariables, setUpdateSettingsVariables] = useState<{ settings: UpdateSettingsInput }>();
  const [updateSettingsMutate, updateSettingsMutation] = useMutation<Setting[]>(UPDATE_SETTINGS, {
    variables: updateSettingsVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => {
      messageUtil.gqlCompleted(t('_lang:updatedSuccessfully'));
      onCloseModalVisible();
      onRefreshSettings();
    },
    refetchQueries: () => [{ query: GET_SETTINGS }],
  });

  const [deleteSettingVariables, setDeleteSettingVariables] = useState<{ id: number }>();
  const [deleteSettingMutate, deleteSettingMutation] = useMutation<Setting[]>(DELETE_SETTING, {
    variables: deleteSettingVariables,
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => {
      messageUtil.gqlCompleted(t('_lang:deletedSuccessfully'));
      onCloseModalVisible();
      onRefreshSettings();
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

        // keep form fields consistent with API
        settingListFormRef.props.form.resetFields();
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
          <Rcon type={props.route.icon} />
          <strong>{t(`${props.route.namei18n}`)}</strong>
          <Button className="page-card-create-button" onClick={onOpenCreateSetting} type="link">
            <Rcon type={PAGE_CARD_TITLE_CREATE_ICON} />
          </Button>
        </span>
      }
      className={style['wapper']}
      loading={getSettingsQuery.loading || updateSettingsMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <SettingListForm
        settings={getSettingsQuery.data && getSettingsQuery.data.settings && getSettingsQuery.data.settings.items}
        wrappedComponentRef={(inst: unknown) => setSettingListFormRef(inst)}
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

        <SettingModalForm item={modalData} wrappedComponentRef={(inst: unknown) => setSettingInfoFormRef(inst)} />
      </Modal>
    </PageCard>
  );
};
