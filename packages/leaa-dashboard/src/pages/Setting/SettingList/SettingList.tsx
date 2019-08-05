import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Icon, Button, Modal, message } from 'antd';
import { Link, RouteComponentProps } from 'react-router-dom';

import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/constants';
import { GET_SETTINGS, UPDATE_SETTING, CREATE_SETTING } from '@leaa/common/graphqls';
import { Setting } from '@leaa/common/entrys';
import {
  SettingsWithPaginationObject,
  SettingArgs,
  UpdateSettingInput,
  CreateSettingInput,
} from '@leaa/common/dtos/setting';
import { IPage } from '@leaa/dashboard/interfaces';
import { SettingListForm } from '@leaa/dashboard/pages/Setting/_components/SettingListForm/SettingListForm';
import { SettingInfoForm } from '@leaa/dashboard/pages/Setting/_components/SettingInfoForm/SettingInfoForm';
import { PageCard } from '@leaa/dashboard/components/PageCard';
import { HtmlTitle } from '@leaa/dashboard/components/HtmlTitle';
import { ErrorCard } from '@leaa/dashboard/components/ErrorCard';
import { SubmitBar } from '@leaa/dashboard/components/SubmitBar';

import style from './style.less';

// export interface ISettingUpdateForm extends UpdateSettingInput {
//   id: string;
// }

export default (props: IPage) => {
  const { t } = useTranslation();

  let settingListFormRef: any;
  let settingInfoFormRef: any;

  const [createVariables, setCreateVariables] = useState<{ setting: CreateSettingInput }>();
  const [updateVariables, setUpdateVariables] = useState<{ id: number; setting: UpdateSettingInput }>();

  const [modalData, setModalData] = useState<Setting | null>(null);
  const [modalType, setModalType] = useState<'create' | 'update' | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const onCloseModalVisible = () => {
    setModalType(null);
    setModalVisible(false);
    setModalData(null);

    if (settingInfoFormRef && settingInfoFormRef.props) {
      settingInfoFormRef.props.form.resetFields();
    }
  };

  const onOpenCreateSetting = () => {
    setModalType('create');
    setModalVisible(true);
    setModalData(null);
  };

  const onOpenUpdateSetting = (setting: Setting) => {
    setModalType('update');
    setModalVisible(true);
    setModalData(setting);
  };

  const getSettingsQuery = useQuery<
    { settings: SettingsWithPaginationObject; fetchPolicy: 'network-only' },
    SettingArgs
  >(GET_SETTINGS);

  // useEffect(() => {
  //   (async () => getSettingsQuery.refetch())();
  // }, [props.history.location.key]);

  // const [updateSettingMutate, updateSettingMutation] = useMutation<Setting>(UPDATE_SETTING, {
  //   variables: createVariables,
  //   onCompleted: () => message.success(t('_lang:updatedSuccessfully')),
  //   refetchQueries: () => [{ query: GET_SETTINGS }],
  // });

  const [updateSettingMutate, updateSettingMutation] = useMutation<Setting>(UPDATE_SETTING, {
    variables: updateVariables,
    onCompleted: () => {
      message.success(t('_lang:updatedSuccessfully'));
      onCloseModalVisible();
    },
    refetchQueries: () => [{ query: GET_SETTINGS }],
  });

  const [createSettingMutate, createSettingMutation] = useMutation<Setting>(CREATE_SETTING, {
    variables: createVariables,
    onCompleted: () => {
      message.success(t('_lang:createdSuccessfully'));
      onCloseModalVisible();
    },
    refetchQueries: () => [{ query: GET_SETTINGS }],
  });

  const onCreate = async () => {
    let hasError = false;
    let submitData: CreateSettingInput;

    settingInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: Setting) => {
      if (err) {
        hasError = true;
        message.error(err[Object.keys(err)[0]].errors[0].message);

        return;
      }

      submitData = formData;
      //
      await setCreateVariables({ setting: submitData });
      await createSettingMutate();
    });
  };

  const onUpdate = async () => {
    let hasError = false;
    let submitData: UpdateSettingInput;

    settingInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: Setting) => {
      if (err) {
        hasError = true;
        message.error(err[Object.keys(err)[0]].errors[0].message);

        return;
      }

      const id = Number(formData.id);

      // eslint-disable-next-line no-param-reassign
      delete formData.id;

      submitData = {
        ...formData,
        sort: typeof formData.sort !== 'undefined' ? Number(formData.sort) : 0,
        // sort: 0,
      };

      await setUpdateVariables({ id, setting: submitData });
      await updateSettingMutate();
    });
  };

  const onSubmit = async () => {
    let hasError = false;
    let submitData: CreateSettingInput;

    settingListFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: Setting) => {
      if (err) {
        hasError = true;
        message.error(err[Object.keys(err)[0]].errors[0].message);
      }

      // submitData = formData;
      //
      // console.log(submitData);
      //
      // // await setCreateVariables({ setting: submitData });
      // await updateSettingMutate();
    });
  };

  // const onOpenModalVisible = async () => {
  //   setModalVisible(true);
  // };
  //

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
      loading={getSettingsQuery.loading}
    >
      <HtmlTitle title={t(`${props.route.namei18n}`)} />

      {getSettingsQuery.error ? <ErrorCard error={getSettingsQuery.error} /> : null}
      {updateSettingMutation.error ? <ErrorCard error={updateSettingMutation.error} /> : null}
      {createSettingMutation.error ? <ErrorCard error={createSettingMutation.error} /> : null}

      {getSettingsQuery.data && getSettingsQuery.data.settings && getSettingsQuery.data.settings.items && (
        <SettingListForm
          settings={getSettingsQuery.data.settings.items}
          wrappedComponentRef={(inst: unknown) => {
            settingListFormRef = inst;
          }}
          onClickLabelEditCallback={onOpenUpdateSetting}
        />
      )}

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={UPDATE_BUTTON_ICON}
          className="submit-button"
          // loading={deleteSettingMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>

      <Modal
        title={t(`_lang:${modalType}`)}
        visible={modalVisible}
        onOk={modalType === 'update' ? onUpdate : onCreate}
        onCancel={onCloseModalVisible}
        // confirmLoading={confirmLoading}
        // confirmLoading={onCloseModalVisible}
      >
        <SettingInfoForm
          item={modalData}
          wrappedComponentRef={(inst: unknown) => {
            settingInfoFormRef = inst;
          }}
        />
      </Modal>
    </PageCard>
  );
};
