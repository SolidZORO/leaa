import cx from 'classnames';
import React, { useState } from 'react';
import { DocumentNode } from 'graphql';
import { useTranslation } from 'react-i18next';
import { message, Switch } from 'antd';
import { SwitchSize } from 'antd/lib/switch';

import { apolloClient } from '@leaa/dashboard/src/libs';

import style from './style.module.less';

interface IProps {
  className?: string;
  loading?: boolean;
  size?: SwitchSize;
  id: number;
  value: number;
  variablesField: string;
  mutation: DocumentNode;
  refetchQueries?: any;
}

export const TableColumnStatusSwitch = (props: IProps) => {
  const { t } = useTranslation();
  const [switchStatus, setSwitchStatus] = useState<boolean>(Boolean(props.value));

  const onChange = (e: boolean) => {
    apolloClient
      .mutate<any>({
        mutation: props.mutation,
        variables: { id: Number(props.id), [props.variablesField]: { status: Number(e) } },
        fetchPolicy: 'no-cache',
        refetchQueries: props.refetchQueries,
      })
      .then(() => {
        setSwitchStatus(e);
        message.success(t('_comp:TableColumnStatusSwitch.updatedSuccessfully', { id: props.id }));
      })
      .catch((error: Error) => {
        console.log(error);
        message.info(error.message);
      });
  };

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <Switch checked={switchStatus} onChange={onChange} size={props.size} />
    </div>
  );
};
