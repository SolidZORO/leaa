import React from 'react';
import { IPage } from '@leaa/dashboard/src/interfaces';
import { CheckCircleOutlined } from '@ant-design/icons';
import { RiMenuLine, RiCheckboxCircleLine } from 'react-icons/ri';
import { FiCheckCircle } from 'react-icons/fi';

import { CrudRequestTest as Test } from './_components/CrudRequestTest/CrudRequestTest';

export default (props: IPage) => {
  return (
    <div style={{ padding: 10 }}>
      <Test />

      <RiMenuLine />
      <CheckCircleOutlined />
      <FiCheckCircle />
      <RiCheckboxCircleLine />

      <hr />
    </div>
  );
};
