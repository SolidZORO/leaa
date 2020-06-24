import _ from 'lodash';
import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Tooltip } from 'antd';
import { RiDeleteBin7Line } from 'react-icons/ri';

import { User } from '@leaa/api/src/entrys';
import { AttachmentBox } from '@leaa/dashboard/src/components';

import { ajax, errorMsg, msg, formatAttaUrl } from '@leaa/dashboard/src/utils';
import { envConfig } from '@leaa/dashboard/src/configs';
import { IHttpRes, IHttpError } from '@leaa/dashboard/src/interfaces';
import { UserUpdateOneReq } from '@leaa/api/src/dtos/user';

import style from './style.module.less';

interface IProps {
  item?: User;
  className?: string;
  loading?: boolean;
  onUpdateAvatarCallback?: (avatar_url?: string | null) => void;
}

export const UploadUserAvatar = (props: IProps) => {
  const { t } = useTranslation();

  const [extAurl, setExtAurl] = useState(props.item?.avatar_url);
  useEffect(() => setExtAurl(props.item?.avatar_url), [props.item?.avatar_url]);

  const [updateLoading, setUpdateLoading] = useState(false);

  const onUpdateAvatar = async (avatar_url?: string | null) => {
    setUpdateLoading(true);

    if (!props.item?.id) {
      // for create user
      if (props.onUpdateAvatarCallback) props.onUpdateAvatarCallback(avatar_url);
    } else {
      // for update user
      ajax
        .patch(`${envConfig.API_URL}/${envConfig.API_VERSION}/users/${props.item?.id}`, {
          avatar_url,
        } as UserUpdateOneReq)
        .then((res: IHttpRes<User>) => {
          setExtAurl(res.data.data.avatar_url);
          if (props.onUpdateAvatarCallback) props.onUpdateAvatarCallback(avatar_url);

          msg(t('_lang:updatedSuccessfully'));
        })
        .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
        .finally(() => setUpdateLoading(false));
    }
  };

  const avatarDom = () => {
    // gravatar
    if (extAurl && extAurl.includes('gravatar')) {
      return (
        <div className={cx(style['avatar-box'], style['avatar-box--avatar-url'])}>
          <div className={cx(style['avatar-toolbar'])}>
            <Tooltip title={t('_page:User.deleteAuthAvatar')}>
              <Button
                type="link"
                size="small"
                shape="circle"
                icon={<RiDeleteBin7Line />}
                className={style['avatar-delete']}
                onClick={() => onUpdateAvatar(null)}
                loading={updateLoading}
              />
            </Tooltip>
          </div>

          <img alt={extAurl || ''} src={formatAttaUrl(extAurl) || ''} />
        </div>
      );
    }

    // atta avatar
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
          if (_.isEmpty(res)) onUpdateAvatar(null);
          if (!_.isEmpty(res) && res[0]) onUpdateAvatar(res[0].path);
        }}
      />
    );
  };

  return <div className={cx(style['user-avatar-wrapper'], props.className)}>{avatarDom()}</div>;
};
