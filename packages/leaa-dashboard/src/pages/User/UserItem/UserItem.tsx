import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import queryString from 'query-string';
import { useQuery } from '@apollo/react-hooks';

import { DEFAULT_PAGE_SIZE_OPTIONS } from '@leaa/dashboard/constants';
import { GET_USER } from '@leaa/common/graphqls';
import { User } from '@leaa/common/entrys';
import { UserArgs } from '@leaa/common/dtos/user';
import { urlUtil } from '@leaa/dashboard/utils';
import { IPage } from '@leaa/dashboard/interfaces';
import { PageCard } from '@leaa/dashboard/components/PageCard';
import { ErrorCard } from '@leaa/dashboard/components/ErrorCard';
import { SearchInput } from '@leaa/dashboard/components/SearchInput';

import style from './style.less';

export default (props: IPage) => {
  const { id } = props.match.params as { id: string };

  const variables = { id: Number(id) };

  const { loading, data, error } = useQuery<{ user: User }, UserArgs>(GET_USER, {
    variables,
  });

  console.log('🍄', variables);

  if (error) {
    return <ErrorCard message={error.message} />;
  }

  return (
    <PageCard title={props.route.name} className={style['page-wapper']} loading={loading}>
      {data && data.user && (
        <>
          <p>{JSON.stringify(data.user.email)}</p>
          <p>{JSON.stringify(data.user.roles)}</p>
        </>
      )}
    </PageCard>
  );
};
