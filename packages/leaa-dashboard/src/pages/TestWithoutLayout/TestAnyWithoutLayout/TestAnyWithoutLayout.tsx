import React from 'react';
import { IPage } from '@leaa/dashboard/src/interfaces';
import { RiMenuLine, RiCheckboxCircleLine } from 'react-icons/ri';
import { FiCheckCircle } from 'react-icons/fi';
import { useSWR } from '@leaa/dashboard/src/libs';
import { envConfig } from '@leaa/dashboard/src/configs';

import { CrudRequestTest as Test } from './_components/CrudRequestTest/CrudRequestTest';

const API_PATH = 'attachments';

export default (props: IPage) => {
  const { data, loading: aa } = useSWR<string[]>({
    // url: '/api/data',
    url: `${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}`,
  });

  console.log(aa, data);

  return (
    <div style={{ padding: 10 }}>
      <Test />

      <RiMenuLine />
      <FiCheckCircle />
      <RiCheckboxCircleLine />

      <hr />
    </div>
  );
};
