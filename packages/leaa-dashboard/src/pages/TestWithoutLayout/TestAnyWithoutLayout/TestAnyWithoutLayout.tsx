import React from 'react';
import { IPage } from '@leaa/dashboard/src/interfaces';
import { Rcon } from '@leaa/dashboard/src/components';
// import { MessageOutlined, createFromIconfontCN } from '@ant-design/icons';
import { DatePickerUpdateTest } from './_components/DatePickerUpdateTest/DatePickerUpdateTest';

export default (props: IPage) => {
  return (
    <div>
      <h2>TestAnyWithoutLayout</h2>
      <Rcon type="ri-function-line" />
      <hr />
      <DatePickerUpdateTest />
    </div>
  );
};
