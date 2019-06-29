import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useStore } from '@leaa/dashboard/stores';

export default (props: RouteComponentProps) => {
  const store = useStore();

  store.mapping.abcMapping = ['aaaaaaa'];

  return (
    <div>
      <h1>SHOW SHOW</h1>
      <hr />
      <p>{JSON.stringify(store)}</p>
    </div>
  );
};
