import React, { useState } from 'react';
import { IPage, IKey } from '@leaa/dashboard/src/interfaces';
import { Rcon } from '@leaa/dashboard/src/components';
import { Button } from 'antd';

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
