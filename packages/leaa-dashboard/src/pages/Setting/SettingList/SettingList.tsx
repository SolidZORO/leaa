import cx from 'classnames';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal, Popconfirm } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { RiDeleteBin7Line, RiQuestionLine, RiAddLine } from 'react-icons/ri';

import { Setting } from '@leaa/api/src/entrys';
import { envConfig } from '@leaa/dashboard/src/configs';
import {
  IPage,
  ICrudListQueryParams,
  IHttpRes,
  ICrudListRes,
  ICommenFormRef,
  ISubmitData,
} from '@leaa/dashboard/src/interfaces';

import { fetcher } from '@leaa/dashboard/src/libs';
import { errorMsg, genCrudRequestQuery, msg, httpErrorMsg } from '@leaa/dashboard/src/utils';
import { PageCard, HtmlMeta, SubmitToolbar } from '@leaa/dashboard/src/components';

import { SettingUpdateManyReq, SettingUpdateOneReq, SettingCreateOneReq } from '@leaa/api/src/dtos/setting';

import { SettingListForm } from '../_components/SettingListForm/SettingListForm';
import { SettingModalForm } from '../_components/SettingModalForm/SettingModalForm';

import style from './style.module.less';

const API_PATH = 'settings';

declare type ICreateOrUpdateSettingInput = SettingUpdateOneReq | SettingCreateOneReq;

export default (props: IPage) => {
  const { t } = useTranslation();

  const settingsFormRef = useRef<ICommenFormRef<SettingUpdateManyReq>>(null);
  const settingModuleFormRef = useRef<ICommenFormRef<ICreateOrUpdateSettingInput>>(null);

  const [modalData, setModalData] = useState<Setting>();
  const [modalType, setModalType] = useState<'create' | 'update' | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

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

    fetcher
      .get(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}`, { params: genCrudRequestQuery(params) })
      .then((res: IHttpRes<ICrudListRes<Setting>>) => {
        setList(res.data.data?.data);
      })
      .catch(httpErrorMsg)
      .finally(() => setListLoading(false));
  };

  //
  // Create
  const [createLoading, setCreateLoading] = useState(false);
  const onCreateSetting = async (id: string | undefined) => {
    const data: ISubmitData<ICreateOrUpdateSettingInput> = await settingModuleFormRef.current?.onValidateForm();

    if (!data) return;

    setCreateLoading(true);

    fetcher
      .post(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}`, data)
      .then((res: IHttpRes<Setting>) => {
        msg(t('_lang:createdSuccessfully'));
        //
        onFetchList(crudQuery);
        onCloseModalVisible();
      })
      .catch(httpErrorMsg)
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

    return fetcher
      .patch(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}`, data)
      .then((res: IHttpRes<{ id: number | string }>) => {
        msg(t('_lang:updatedSuccessfully', { id: res?.data?.data?.id }));
        //
        onFetchList(crudQuery);
        onCloseModalVisible();
      })
      .catch(httpErrorMsg)
      .finally(() => setUpdateLoading(false));
  };

  //
  // Batch Update
  const [batchUpdateLoading, setBatchUpdatesLoading] = useState(false);
  const onBatchUpdatSettings = async () => {
    const data: ISubmitData<SettingUpdateManyReq> = await settingsFormRef.current?.onValidateForm();

    if (!data) return errorMsg('Not Found Updates Data');
    setBatchUpdatesLoading(true);

    return fetcher
      .post(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/batch`, { settings: data })
      .then((res: IHttpRes<{ id: number | string }>) => {
        msg(t('_lang:updatedSuccessfully'));
        //
        onFetchList(crudQuery);
        onCloseModalVisible();
      })
      .catch(httpErrorMsg)
      .finally(() => setBatchUpdatesLoading(false));
  };

  //
  // Delete
  const [deleteLoading, setDeleteLoading] = useState(false);
  const onDeleteSettings = async (id: string | undefined) => {
    if (!id) return errorMsg('Delete Error');

    setDeleteLoading(true);

    return fetcher
      .delete(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}`)
      .then((res: IHttpRes<{ id: number | string }>) => {
        msg(t('_lang:deletedSuccessfully', { id: res?.data?.data?.id }));
        //
        onFetchList(crudQuery);
        onCloseModalVisible();
      })
      .catch(httpErrorMsg)
      .finally(() => setDeleteLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onFetchList(crudQuery), [props.history.location.key]);

  return (
    <PageCard
      route={props.route}
      title={
        <>
          <strong className={style['title-name']}>{t(`${props.route?.namei18n}`)}</strong>

          <Button
            size="large"
            icon={<RiAddLine />}
            onClick={onOpenCreateSetting}
            className={cx(style['page-card-create-button'], 'g-page-card-create-button')}
          >
            {t('_lang:create')}
          </Button>
        </>
      }
      className={style['page-card-wapper']}
      loading={listLoading}
    >
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      <SettingListForm ref={settingsFormRef} items={list} onClickLabelEditCallback={onOpenUpdateSetting} />

      <SubmitToolbar
        simpleButtonGroup={{ title: '@UPDATE', loading: batchUpdateLoading }}
        simpleButtonAction={onBatchUpdatSettings}
      />

      <Modal
        title={`${t(`_lang:${modalType}`)}${modalData?.name ? `  ${modalData?.name}` : ''}`}
        // visible={modalVisible}
        visible={modalVisible}
        onOk={() => (modalType === 'update' ? onUpdateSetting(modalData?.id) : onCreateSetting(modalData?.id))}
        // confirmLoading={updateSettingMutation.loading}
        className={style['setting-modal']}
        onCancel={onCloseModalVisible}
        afterClose={onAfterCloseModalVisible}
      >
        <div className={style['delete-button']}>
          <Popconfirm
            icon={null}
            title={
              <span className={style['title-wrapper']}>
                {createLoading || updateLoading ? <LoadingOutlined spin /> : <RiQuestionLine color="red" />}
                {t('_page:Setting.confirmDelete')} {modalData?.name}?
              </span>
            }
            placement="topRight"
            onConfirm={() => onDeleteSettings(modalData?.id)}
          >
            <Button icon={<RiDeleteBin7Line />} loading={createLoading || updateLoading} />
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
