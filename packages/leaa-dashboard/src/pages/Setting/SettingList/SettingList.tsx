import cx from 'classnames';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal, Popconfirm } from 'antd';
import { DeleteOutlined, LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { UPDATE_BUTTON_ICON, PAGE_CARD_TITLE_CREATE_ICON } from '@leaa/dashboard/src/constants';

import { Setting } from '@leaa/common/src/entrys';
import { envConfig } from '@leaa/dashboard/src/configs';
import {
  IPage,
  ICrudListQueryParams,
  IHttpRes,
  ICrudListRes,
  IHttpError,
  ICommenFormRef,
  ISubmitData,
} from '@leaa/dashboard/src/interfaces';
import { ajax, errorMsg, genCrudRequestQuery, msg } from '@leaa/dashboard/src/utils';
import { PageCard, HtmlMeta, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

import { UpdateSettingsInput, UpdateSettingInput, CreateSettingInput } from '@leaa/common/src/dtos/setting';

import { SettingListForm } from '../_components/SettingListForm/SettingListForm';
import { SettingModalForm } from '../_components/SettingModalForm/SettingModalForm';

import style from './style.module.less';

const API_PATH = 'settings';

declare type ICreateOrUpdateSettingInput = UpdateSettingInput | CreateSettingInput;

export default (props: IPage) => {
  const { t } = useTranslation();

  const settingsFormRef = useRef<ICommenFormRef<UpdateSettingsInput>>(null);
  const settingModuleFormRef = useRef<ICommenFormRef<ICreateOrUpdateSettingInput>>(null);

  //

  const [modalData, setModalData] = useState<Setting>();
  const [modalType, setModalType] = useState<'create' | 'update' | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  //

  const onCloseModalVisible = () => {
    setModalVisible(false);
  };

  const onAfterCloseModalVisible = () => {
    settingModuleFormRef.current?.form.resetFields();

    setModalType(null);
    setModalData(undefined);
  };

  const onOpenCreateSetting = () => {
    setModalType('create');
    setModalData(undefined);
    setModalVisible(true);
  };

  const onOpenUpdateSetting = (setting: Setting) => {
    setModalType('update');
    setModalVisible(true);
    setModalData(setting);
  };

  //
  // Read (List)
  const [crudQuery] = useState<ICrudListQueryParams>({ limit: 99999 });

  const [list, setList] = useState<Setting[]>();
  const [listLoading, setListLoading] = useState(false);
  const onFetchList = (params: ICrudListQueryParams) => {
    setListLoading(true);

    ajax
      .get(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}`, { params: genCrudRequestQuery(params) })
      .then((res: IHttpRes<ICrudListRes<Setting>>) => {
        setList(res.data.data?.data);
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setListLoading(false));
  };

  //
  // Create
  const [createLoading, setCreateLoading] = useState(false);
  const onCreateSetting = async (id: string | undefined) => {
    const data: ISubmitData<ICreateOrUpdateSettingInput> = await settingModuleFormRef.current?.onValidateForm();

    if (!data) return;

    setCreateLoading(true);

    ajax
      .post(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}`, data)
      .then((res: IHttpRes<Setting>) => {
        msg(t('_lang:createdSuccessfully'));
        //
        onFetchList(crudQuery);
        onCloseModalVisible();
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setCreateLoading(false));
  };

  //
  // Update
  const [updateLoading, setUpdateLoading] = useState(false);
  const onUpdateSetting = async (id: string | undefined) => {
    if (!id) return errorMsg('Updates Error');

    const data: ISubmitData<ICreateOrUpdateSettingInput> = await settingModuleFormRef.current?.onValidateForm();
    if (!data) return errorMsg('Not Found Update Data');

    setUpdateLoading(true);

    return ajax
      .patch(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}`, data)
      .then((res: IHttpRes<{ id: number | string }>) => {
        msg(t('_lang:updatedSuccessfully', { id: res?.data?.data?.id }));
        //
        onFetchList(crudQuery);
        onCloseModalVisible();
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setUpdateLoading(false));
  };

  //
  // Batch Update
  const [batchUpdateLoading, setBatchUpdatesLoading] = useState(false);
  const onBatchUpdatSettings = async () => {
    const data: ISubmitData<UpdateSettingsInput> = await settingsFormRef.current?.onValidateForm();

    if (!data) return errorMsg('Not Found Updates Data');
    setBatchUpdatesLoading(true);

    return ajax
      .post(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/batch`, { settings: data })
      .then((res: IHttpRes<{ id: number | string }>) => {
        msg(t('_lang:updatedSuccessfully'));
        //
        onFetchList(crudQuery);
        onCloseModalVisible();
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setBatchUpdatesLoading(false));
  };

  //
  // Delete
  const [deleteLoading, setDeleteLoading] = useState(false);
  const onDeleteSettings = async (id: string | undefined) => {
    if (!id) return errorMsg('Delete Error');

    setDeleteLoading(true);

    return ajax
      .delete(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}`)
      .then((res: IHttpRes<{ id: number | string }>) => {
        msg(t('_lang:deletedSuccessfully', { id: res?.data?.data?.id }));
        //
        onFetchList(crudQuery);
        onCloseModalVisible();
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setDeleteLoading(false));
  };

  useEffect(() => onFetchList(crudQuery), [props.history.location.key]);

  console.log(modalData);

  return (
    <PageCard
      route={props.route}
      title={
        <span>
          <Rcon type={props.route.icon} />
          <strong>{t(`${props.route.namei18n}`)}</strong>
          <Button
            className={cx('g-page-card-create-button', style['create-button'])}
            onClick={onOpenCreateSetting}
            type="link"
          >
            <Rcon type={PAGE_CARD_TITLE_CREATE_ICON} />
          </Button>
        </span>
      }
      className={style['wapper']}
      loading={listLoading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <SettingListForm ref={settingsFormRef} items={list} onClickLabelEditCallback={onOpenUpdateSetting} />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={UPDATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={batchUpdateLoading}
          onClick={onBatchUpdatSettings}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>

      <Modal
        title={`${t(`_lang:${modalType}`)}${modalData?.name ? `  ${modalData.name}` : ''}`}
        visible={modalVisible}
        // visible
        onOk={() => (modalType === 'update' ? onUpdateSetting(modalData?.id) : onCreateSetting(modalData?.id))}
        // confirmLoading={updateSettingMutation.loading}
        className={style['setting-modal']}
        onCancel={onCloseModalVisible}
        afterClose={onAfterCloseModalVisible}
      >
        <div className={style['delete-button']}>
          <Popconfirm
            icon={deleteLoading ? <LoadingOutlined /> : <QuestionCircleOutlined />}
            title={
              <span>
                {t('_page:Setting.confirmDelete')} {modalData?.name}?
              </span>
            }
            placement="topRight"
            onConfirm={() => onDeleteSettings(modalData?.id)}
          >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>

        <SettingModalForm
          ref={settingModuleFormRef}
          item={modalData}
          type={modalType}
          loading={createLoading || updateLoading}
        />
      </Modal>
    </PageCard>
  );
};
