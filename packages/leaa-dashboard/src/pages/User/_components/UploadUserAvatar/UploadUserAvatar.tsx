import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { User } from '@leaa/common/src/entrys';
import { ConfirmDeleteButton } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  item?: User;
  className?: string;
  loading?: boolean;
}

export const UploadUserAvatar = (props: IProps) => {
  const { t } = useTranslation();
  const [aurl, setAurl] = useState(props.item?.avatar_url);

  // const avatarParams = {
  //   type: 'image',
  //   moduleId: props.item?.id,
  //   moduleName: 'user',
  //   typeName: 'avatar',
  // };

  useEffect(() => {
    setAurl(props.item?.avatar_url);
  }, [props.item?.avatar_url]);

  // const [updateUserMutate, updateUserMutation] = useMutation<User>(UPDATE_USER, {
  //   variables: {
  //     id: Number(props.item?.id),
  //     user: { avatar_url: null },
  //   },
  // });

  // const deleteAvatar = async () => {
  //   const result = await updateUserMutate();
  //
  //   if (result) {
  //     setAurl(null);
  //   }
  // };

  return (
    <div className={cx(style['user-avatar-wrapper'], props.className)}>
      {aurl && (
        <div className={cx(style['avatar-box'], style['avatar-box--avatar-url'])}>
          <div className={cx(style['avatar-toolbar'])}>
            <ConfirmDeleteButton
              opacity={1}
              // loading={updateUserMutation.loading}
              // onClick={deleteAvatar}
              title={t('_page:User.deleteAuthAvatar')}
            />
          </div>

          <img alt="" src={aurl || ''} />
        </div>
      )}
    </div>
  );
};
