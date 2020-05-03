import cx from 'classnames';
import React, { useState } from 'react';
import { DocumentNode } from 'graphql';
import { useTranslation } from 'react-i18next';
import { Switch, message } from 'antd';
import { SwitchSize } from 'antd/lib/switch';

import { msgUtil } from '@leaa/dashboard/src/utils';
import { apolloClient } from '@leaa/dashboard/src/libs';

import style from './style.module.less';

interface IProps {
  className?: string;
  loading?: boolean;
  size?: SwitchSize;
  id: string;
  value: number;
  variablesField: string;
  mutation: DocumentNode;
  refetchQueries?: any;
}

export const TableColumnStatusSwitch = (props: IProps) => {
  const { t } = useTranslation();
  const [switchStatus, setSwitchStatus] = useState<boolean>(Boolean(props.value));
  const [switchLoading, setSwitchLoading] = useState<boolean>(false);

  const onChange = (e: boolean) => {
    setSwitchLoading(true);

    apolloClient
      .mutate<any>({
        mutation: props.mutation,
        variables: { id: props.id, [props.variablesField]: { status: Number(e) } },
        fetchPolicy: 'no-cache',
        refetchQueries: props.refetchQueries,
      })
      .then(() => {
        setSwitchStatus(e);

        message.success(
          <span>
            {t('_comp:TableColumnStatusSwitch.updatedSuccessfully', { id: props.id })}
            <Switch checked={e} size="small" className={style['tips-switch']} />
          </span>,
        );

        // TODO add status tips
        // messageUtil.message(
        //   t('_comp:TableColumnStatusSwitch.updatedSuccessfully', {
        //     id: props.id,
        //     status: (e && t('_comp:TableColumnStatusSwitch.true')) || <p>xxxx</p>,
        //   }),
        // );
      })
      .catch((error: Error) => {
        msgUtil.error(error.message);
      })
      .finally(() => setSwitchLoading(false));
  };

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <Switch checked={switchStatus} onChange={onChange} size={props.size} loading={switchLoading} />
    </div>
  );
};
