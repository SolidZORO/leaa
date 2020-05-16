import React, { useState } from 'react';
import { CreateQueryParams } from '@nestjsx/crud-request/lib/interfaces';
import { getCrudQueryByUrl } from '@leaa/dashboard/src/utils';
import queryString from 'query-string';
import { RequestQueryBuilder } from '@nestjsx/crud-request';

export const CrudRequestTest = () => {
  //
  //
  //
  //
  // const ACTIONS_QUERY_BY_URL: CreateQueryParams = getCrudQueryByUrl(window.location.search);
  // const ACTIONS_QUERY_BY_DEFAULT: CreateQueryParams = {
  //   fields: ['account', 'id', 'module'],
  //   search: { module: { $eq: 'auth' } },
  //   // join: [{ field: 'company' }],
  //   sort: ['account', 'ASC'],
  //   page: 1,
  //   limit: 10,
  // };
  //
  // const [actionsQuery, setActionsQuery] = useState<CreateQueryParams>({
  //   ...ACTIONS_QUERY_BY_DEFAULT,
  //   ...ACTIONS_QUERY_BY_URL,
  // });
  //
  // const url =
  //   // eslint-disable-next-line max-len
  //   'limit=99&s=%7B%22module%22:%20%7B%22$eq%22:%20%22auth%22%7D%7D&fields=account,module&q=AAAAAAAAAAAAA';
  //
  // const crudQuery = urlToCrud(url);
  // console.log('crudQuery >>>', crudQuery);
  //
  // const urlString = crudToUrl(crudQuery);
  // console.log('urlString >>>', urlString);
  // //
  //
  // // console.log('URL', url);
  // // console.log('PAR', actionsQuery);

  return <div style={{ padding: 20 }}>CRUD</div>;
};
