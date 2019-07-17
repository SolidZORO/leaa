import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import { GET_RAM } from '@leaa/common/graphqls';

export default (props: any) => {
  const getRamQuery = useQuery(GET_RAM, {});

  return (
    <div>
      {getRamQuery.error ? <p>ERROR</p> : null}

      <div>{JSON.stringify(getRamQuery.data)}</div>
    </div>
  );
};
