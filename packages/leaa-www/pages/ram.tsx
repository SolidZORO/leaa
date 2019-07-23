import React from 'react';
import { Button, Switch } from 'antd';
import { useQuery } from '@apollo/react-hooks';

import { GET_RAM } from '@leaa/common/graphqls';

export default (props: any) => {
  const getRamQuery = useQuery(GET_RAM, {});

  return (
    <div>
      {getRamQuery.error ? <p>ERROR</p> : null}

      <Button type="dashed" icon="up">
        RAM
      </Button>
      <Switch size="small" />
      <div>{JSON.stringify(getRamQuery.data)}</div>
    </div>
  );
};
