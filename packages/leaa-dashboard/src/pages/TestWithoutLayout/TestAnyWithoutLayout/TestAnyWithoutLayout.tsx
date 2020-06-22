import React from 'react';
import { IPage } from '@leaa/dashboard/src/interfaces';
import { CrudRequestTest as Test } from './_components/CrudRequestTest/CrudRequestTest';

export default (props: IPage) => {
  return (
    <div style={{ padding: 10 }}>
      <Test />

      <hr />
    </div>
  );
};
