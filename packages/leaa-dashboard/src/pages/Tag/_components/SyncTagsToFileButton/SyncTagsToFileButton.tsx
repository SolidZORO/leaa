import React from 'react';
import cx from 'classnames';
import { Button, message } from 'antd';
import { useMutation } from '@apollo/react-hooks';

import { SyncTagsToFileObject } from '@leaa/common/src/dtos/tag';
import { SYNC_TAGS_TO_FILE } from '@leaa/common/src/graphqls';
import { messageUtil } from '@leaa/dashboard/src/utils';

import style from './style.module.less';

interface IProps {
  className?: string;
}

export const SyncTagsToFileButton = (props: IProps) => {
  // mutation
  const [syncTagsToFileMutate, syncTagsToFileMution] = useMutation<{ syncTagsToDictFile: SyncTagsToFileObject }>(
    SYNC_TAGS_TO_FILE,
    {
      // variables: undefined,
      onError: e => message.error(messageUtil.formatGqlmessage(e.message)),
      onCompleted({ syncTagsToDictFile }) {
        message.success(syncTagsToDictFile.status);
      },
    },
  );

  return (
    <Button
      className={cx(style['sync-button'], props.className)}
      type="link"
      icon="sync"
      onClick={() => syncTagsToFileMutate()}
      loading={syncTagsToFileMution.loading}
    >
      SYNC
    </Button>
  );
};
