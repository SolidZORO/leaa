import _ from 'lodash';
import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

import { User } from '@leaa/common/src/entrys';
import { AttachmentBox } from '@leaa/dashboard/src/components';

import { ajax, errorMsg, msg } from '@leaa/dashboard/src/utils';
import { envConfig } from '@leaa/dashboard/src/configs';
import { IHttpRes, IHttpError } from '@leaa/dashboard/src/interfaces';
import { UserUpdateOneReq } from '@leaa/common/src/dtos/user';

import style from './style.module.less';

interface IProps {
  item?: User;
  className?: string;
  loading?: boolean;
}

export const UploadUserAvatar = (props: IProps) => {
  const { t } = useTranslation();

  const [extAurl, setExtAurl] = useState(props.item?.avatar_url);
  useEffect(() => setExtAurl(props.item?.avatar_url), [props.item?.avatar_url]);

  const [updateLoading, setUpdateLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/camelcase
  const onUpdateAvatar = async (avatar_url?: string | null) => {
    setUpdateLoading(true);
    if (!props.item?.id) return;

    ajax
      .patch(`${envConfig.API_URL}/${envConfig.API_VERSION}/users/${props.item?.id}`, {
        avatar_url,
      } as UserUpdateOneReq)
      .then((res: IHttpRes<User>) => {
        setExtAurl(res.data.data.avatar_url);

        msg(t('_lang:updatedSuccessfully'));
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setUpdateLoading(false));
  };

  const avatarDom = () => {
    if (extAurl && extAurl.includes('gravatar')) {
      return (
        <div className={cx(style['avatar-box'], style['avatar-box--avatar-url'])}>
          <div className={cx(style['avatar-toolbar'])}>
            <Tooltip title={t('_page:User.deleteAuthAvatar')}>
              <Button
                type="link"
                size="small"
                shape="circle"
                icon={<DeleteOutlined />}
                className={style['avatar-delete']}
                onClick={() => onUpdateAvatar(null)}
                loading={updateLoading}
              />
            </Tooltip>
          </div>

          <img alt={extAurl || ''} src={extAurl || ''} />
        </div>
      );
    }

    if ((!extAurl && props.item?.id) || (extAurl && !extAurl.includes('gravatar') && props.item?.id)) {
      return (
        <AttachmentBox
          type="card"
          title={t('_lang:avatar')}
          attachmentParams={{
            type: 'image',
            moduleId: props.item?.id,
            moduleName: 'user',
            typeName: 'avatar',
          }}
          cardHeight={80}
          className={style['avatar-box']}
          circle
          onChangeAttasCallback={(res) => {
            if (!_.isEmpty(res) && res[0]) onUpdateAvatar(res[0].path);
          }}
        />
      );
    }

    return null;
  };

  return <div className={cx(style['user-avatar-wrapper'], props.className)}>{avatarDom()}</div>;
};
