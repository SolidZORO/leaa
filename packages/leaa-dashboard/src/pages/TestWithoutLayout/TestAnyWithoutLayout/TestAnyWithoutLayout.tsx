import React from 'react';
import { IPage } from '@leaa/dashboard/src/interfaces';
import { Rcon } from '@leaa/dashboard/src/components';
// import { MessageOutlined, createFromIconfontCN } from '@ant-design/icons';
// import { DatePickerUpdateTest as Test } from './_components/DatePickerUpdateTest/DatePickerUpdateTest';
import { CrudRequestTest as Test } from './_components/CrudRequestTest/CrudRequestTest';

export default (props: IPage) => {
  return (
    <div>
      <Test />
    </div>
  );
};
