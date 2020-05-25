import cx from 'classnames';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal, Popconfirm, message } from 'antd';
import { DeleteOutlined, LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {
  UPDATE_BUTTON_ICON,
  DEFAULT_QUERY,
  PAGE_CARD_TITLE_CREATE_ICON,
  DEFAULT_PAGE_SIZE,
} from '@leaa/dashboard/src/constants';

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
import {
  ajax,
  errorMsg,
  setCrudQueryToUrl,
  transUrlQueryToCrudState,
  genCrudRequestQuery,
  genCrudQuerySearch,
  msg,
} from '@leaa/dashboard/src/utils';
import { PageCard, HtmlMeta, SearchInput, FilterIcon, SubmitBar, Rcon } from '@leaa/dashboard/src/components';

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

// import cx from 'classnames';
// import React, { useState, useRef } from 'react';
// import { useTranslation } from 'react-i18next';
// // import { useQuery, useMutation } from '@apollo/react-hooks';
// import { Button, Modal, Popconfirm, message } from 'antd';
// import { DeleteOutlined, LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons';
// import useAxios from 'axios-hooks';
//
// import { UPDATE_BUTTON_ICON, PAGE_CARD_TITLE_CREATE_ICON } from '@leaa/dashboard/src/constants';
// import {
//   GET_SETTINGS,
//   UPDATE_SETTING,
//   UPDATE_SETTINGS,
//   CREATE_SETTING,
//   DELETE_SETTING,
// } from '@leaa/dashboard/src/graphqls';
// import { Setting } from '@leaa/common/src/entrys';
// import {
//   SettingsWithPaginationObject,
//   SettingsArgs,
//   UpdateSettingInput,
//   CreateSettingInput,
//   UpdateSettingsInput,
// } from '@leaa/common/src/dtos/setting';
// import { IPage, ICommenFormRef, ISubmitData } from '@leaa/dashboard/src/interfaces';
// import { refreshLocalStorageSettings, msg } from '@leaa/dashboard/src/utils';
//
// import { HtmlMeta, PageCard, SubmitBar, Rcon } from '@leaa/dashboard/src/components';
//
// import { SettingListForm } from '../_components/SettingListForm/SettingListForm';
// import { SettingModalForm } from '../_components/SettingModalForm/SettingModalForm';
//
// import style from './style.module.less';
//
// export default (props: IPage) => {
//   const { t } = useTranslation();
//
//   return <p>N</p>;
//
//   // // ref
//   // const settingListFormRef = useRef<ICommenFormRef<UpdateSettingsInput>>(null);
//   // const settingModuleFormRef = useRef<ICommenFormRef<ICreateOrUpdateSettingInput>>(null);
//   //
//   // const [modalData, setModalData] = useState<Setting | undefined>();
//   // const [modalType, setModalType] = useState<'create' | 'update' | null>(null);
//   // const [modalVisible, setModalVisible] = useState<boolean>(false);
//   //
//   // const onRefreshSettings = () => {
//   //   refreshLocalStorageSettings();
//   // };
//   //
//   // const onCloseModalVisible = () => {
//   //   setModalVisible(false);
//   // };
//   //
//   // const onAfterCloseModalVisible = () => {
//   //   settingModuleFormRef.current?.form.resetFields();
//   //
//   //   setModalType(null);
//   //   setModalData(undefined);
//   // };
//   //
//   // const onOpenCreateSetting = () => {
//   //   setModalType('create');
//   //   setModalData(undefined);
//   //   setModalVisible(true);
//   // };
//   //
//   // const onOpenUpdateSetting = (setting: Setting) => {
//   //   setModalType('update');
//   //   setModalVisible(true);
//   //   setModalData(setting);
//   // };
//   //
//   // // query
//   // const getSettingsQuery = useQuery<
//   //   {
//   //     settings: SettingsWithPaginationObject;
//   //     fetchPolicy: 'network-only';
//   //   },
//   //   SettingsArgs
//   // >(GET_SETTINGS);
//   //
//   // // mutation
//   // const [createSettingVariables, setCreateSettingVariables] = useState<{ setting: CreateSettingInput }>();
//   // const [createSettingMutate] = useMutation<Setting>(CREATE_SETTING, {
//   //   variables: createSettingVariables,
//   //   // apollo-link-error onError: e => messageUtil.gqlError(e.message),
//   //   onCompleted: () => {
//   //     msg(t('_lang:createdSuccessfully'));
//   //     onCloseModalVisible();
//   //     onRefreshSettings();
//   //   },
//   //   refetchQueries: () => [{ query: GET_SETTINGS }],
//   // });
//   //
//   // const [updateSettingVariables, setUpdateSettingVariables] = useState<{ id: string; setting: UpdateSettingInput }>();
//   // const [updateSettingMutate, updateSettingMutation] = useMutation<Setting>(UPDATE_SETTING, {
//   //   variables: updateSettingVariables,
//   //   // apollo-link-error onError: e => messageUtil.gqlError(e.message),
//   //   onCompleted: () => {
//   //     msg(t('_lang:updatedSuccessfully'));
//   //     onCloseModalVisible();
//   //     onRefreshSettings();
//   //   },
//   //   refetchQueries: () => [{ query: GET_SETTINGS }],
//   // });
//   //
//   // const [updateSettingsVariables, setUpdateSettingsVariables] = useState<{ settings: UpdateSettingsInput }>();
//   // const [updateSettingsMutate, updateSettingsMutation] = useMutation<Setting[]>(UPDATE_SETTINGS, {
//   //   variables: updateSettingsVariables,
//   //   // apollo-link-error onError: e => messageUtil.gqlError(e.message),
//   //   onCompleted: () => {
//   //     msg(t('_lang:updatedSuccessfully'));
//   //     onCloseModalVisible();
//   //     onRefreshSettings();
//   //   },
//   //   refetchQueries: () => [{ query: GET_SETTINGS }],
//   // });
//   //
//   // const [deleteSettingVariables, setDeleteSettingVariables] = useState<{ id: string }>();
//   // const [deleteSettingMutate, deleteSettingMutation] = useMutation<Setting[]>(DELETE_SETTING, {
//   //   variables: deleteSettingVariables,
//   //   // apollo-link-error onError: e => messageUtil.gqlError(e.message),
//   //   onCompleted: () => {
//   //     msg(t('_lang:deletedSuccessfully'));
//   //     onCloseModalVisible();
//   //     onRefreshSettings();
//   //   },
//   //   refetchQueries: () => [{ query: GET_SETTINGS }],
//   // });
//   //
//   // const onCreateSetting = async () => {
//   //   const submitData: ISubmitData<any> = await settingModuleFormRef.current?.onValidateForm();
//   //
//   //   if (!submitData) return;
//   //
//   //   await setCreateSettingVariables({ setting: submitData });
//   //   await createSettingMutate();
//   // };
//   //
//   // const onUpdateSetting = async () => {
//   //   const submitData: ISubmitData<UpdateSettingInput> = await settingModuleFormRef.current?.onValidateForm();
//   //
//   //   if (!submitData) return;
//   //
//   //   // @ts-ignore
//   //   const id = submitData?.id;
//   //   // @ts-ignore
//   //   delete submitData.id;
//   //
//   //   await setUpdateSettingVariables({ id, setting: submitData });
//   //   await updateSettingMutate();
//   // };
//   //
//   // const onUpdateSettings = async () => {
//   //   const submitData: ISubmitData<UpdateSettingsInput> = await settingListFormRef.current?.onValidateForm();
//   //
//   //   if (!submitData) return;
//   //
//   //   await setUpdateSettingsVariables({ settings: submitData });
//   //   await updateSettingsMutate();
//   // };
//   //
//   // const onDeleteSettings = async (id: string | undefined) => {
//   //   if (!id) {
//   //     message.error('ERROR');
//   //
//   //     return;
//   //   }
//   //
//   //   await setDeleteSettingVariables({ id });
//   //   await deleteSettingMutate();
//   // };
//   //
//   // return (
//   //   <PageCard
//   //     title={
//   //       <span>
//   //         <Rcon type={props.route.icon} />
//   //         <strong>{t(`${props.route.namei18n}`)}</strong>
//   //         <Button
//   //           className={cx('g-page-card-create-button', style['create-button'])}
//   //           onClick={onOpenCreateSetting}
//   //           type="link"
//   //         >
//   //           <Rcon type={PAGE_CARD_TITLE_CREATE_ICON} />
//   //         </Button>
//   //       </span>
//   //     }
//   //     className={style['wapper']}
//   //     loading={getSettingsQuery.loading || updateSettingsMutation.loading}
//   //   >
//   //     <HtmlMeta title={t(`${props.route.namei18n}`)} />
//   //
//   //     <SettingListForm
//   //       ref={settingListFormRef}
//   //       items={getSettingsQuery.data?.settings?.items}
//   //       onClickLabelEditCallback={onOpenUpdateSetting}
//   //     />
//   //
//   //     <SubmitBar>
//   //       <Button
//   //         type="primary"
//   //         size="large"
//   //         icon={<Rcon type={UPDATE_BUTTON_ICON} />}
//   //         className="g-submit-bar-button"
//   //         loading={updateSettingsMutation.loading}
//   //         onClick={onUpdateSettings}
//   //       >
//   //         {t('_lang:update')}
//   //       </Button>
//   //     </SubmitBar>
//   //
//   //     <Modal
//   //       title={`${t(`_lang:${modalType}`)}${modalData?.name ? `  ${modalData.name}` : ''}`}
//   //       visible={modalVisible}
//   //       // visible
//   //       onOk={modalType === 'update' ? onUpdateSetting : onCreateSetting}
//   //       confirmLoading={updateSettingMutation.loading}
//   //       className={style['setting-modal']}
//   //       onCancel={onCloseModalVisible}
//   //       afterClose={onAfterCloseModalVisible}
//   //     >
//   //       <div className={style['delete-button']}>
//   //         <Popconfirm
//   //           icon={deleteSettingMutation.loading ? <LoadingOutlined /> : <QuestionCircleOutlined />}
//   //           title={
//   //             <span>
//   //               {t('_page:Setting.confirmDelete')} {modalData?.name}?
//   //             </span>
//   //           }
//   //           placement="topRight"
//   //           onConfirm={() => onDeleteSettings(modalData?.id)}
//   //         >
//   //           <Button icon={<DeleteOutlined />} />
//   //         </Popconfirm>
//   //       </div>
//   //
//   //       <SettingModalForm ref={settingModuleFormRef} item={modalData} type={modalType} />
//   //     </Modal>
//   //   </PageCard>
//   // );
// };
