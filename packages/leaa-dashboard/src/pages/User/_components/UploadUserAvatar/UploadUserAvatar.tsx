import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/react-hooks';
import { Button, Tooltip } from 'antd';

import { User } from '@leaa/common/src/entrys';
import { AttachmentBox } from '@leaa/dashboard/src/components';
import { UPDATE_USER } from '@leaa/dashboard/src/graphqls';

import style from './style.module.less';

interface IProps {
  item?: User;
  className?: string;
  loading?: boolean;
}

export const UploadUserAvatar = (props: IProps) => {
  const { t } = useTranslation();
  const [aurl, setAurl] = useState(props.item?.avatar_url);

  const avatarParams = {
    type: 'image',
    moduleId: Number(props.item?.id),
    moduleName: 'user',
    typeName: 'avatar',
  };

  useEffect(() => {
    setAurl(props.item?.avatar_url);
  }, [props.item?.avatar_url]);

  const [updateUserMutate, updateUserMutation] = useMutation<User>(UPDATE_USER, {
    variables: {
      id: Number(props.item?.id),
      user: { avatar_url: null },
    },
  });

  const deleteAvatar = async () => {
    const result = await updateUserMutate();

    if (result) {
      setAurl(null);
    }
  };

  return (
    <div className={cx(style['user-avatar-wrapper'], props.className)}>
      {aurl && (
        <div className={cx(style['avatar-box'], style['avatar-box--avatar-url'])}>
          <div className={cx(style['avatar-toolbar'])}>
            <Tooltip title={t('_page:User.deleteAuthAvatar')}>
              <Button
                type="link"
                size="small"
                shape="circle"
                icon={<DeleteOutlined />}
                className={style['avatar-delete']}
                onClick={deleteAvatar}
                loading={updateUserMutation.loading}
              />
            </Tooltip>
          </div>

          <img alt="" src={aurl || ''} />
        </div>
      )}

      {!aurl && (
        <AttachmentBox
          type="card"
          title={t('_lang:avatar')}
          disableMessage
          attachmentParams={avatarParams}
          cardHeight={80}
          className={style['avatar-box']}
          circle
        />
      )}
    </div>
  );
};
