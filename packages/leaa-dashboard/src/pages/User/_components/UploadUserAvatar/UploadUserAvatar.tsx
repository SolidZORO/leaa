import cx from 'classnames';
import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

import { User } from '@leaa/common/src/entrys';
import { AttachmentBox } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  item?: User;
  className?: string;
  loading?: boolean;
}

export const UploadUserAvatar = (props: IProps) => {
  const { t } = useTranslation();

  return (
    <div className={cx(style['user-avatar-wrapper'], props.className)}>
      <AttachmentBox
        type="card"
        title={t('_lang:avatar')}
        disableMessage
        attachmentParams={{
          type: 'image',
          moduleId: Number(props.item?.id),
          moduleName: 'user',
          typeName: 'avatar',
        }}
        cardHeight={120}
        className={style['avatar-box']}
        circle
      />
    </div>
  );
};
