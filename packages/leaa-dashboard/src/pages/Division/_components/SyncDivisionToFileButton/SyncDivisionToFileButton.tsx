import React from 'react';
import cx from 'classnames';
import { Button } from 'antd';
import { useMutation } from '@apollo/react-hooks';

import { SyncTagsToFileObject } from '@leaa/common/src/dtos/tag';
import { SYNC_TAGS_TO_FILE } from '@leaa/dashboard/src/graphqls';
import { successMessage } from '@leaa/dashboard/src/utils';
import { Rcon } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  className?: string;
}

export const SyncDivisionToFileButton = (props: IProps) => {
  // mutation
  const [syncTagsToFileMutate, syncTagsToFileMution] = useMutation<{ syncTagsToDictFile: SyncTagsToFileObject }>(
    SYNC_TAGS_TO_FILE,
    {
      // variables: undefined,
      // apollo-link-error onError: e => messageUtil.gqlError(e.message),
      onCompleted({ syncTagsToDictFile }) {
        successMessage(syncTagsToDictFile.status);
      },
    },
  );

  return (
    <Button
      className={cx(style['sync-button'], props.className)}
      type="link"
      icon={<Rcon type="ri-refresh-line" />}
      onClick={() => syncTagsToFileMutate()}
      loading={syncTagsToFileMution.loading}
    >
      SYNC
    </Button>
  );
};
