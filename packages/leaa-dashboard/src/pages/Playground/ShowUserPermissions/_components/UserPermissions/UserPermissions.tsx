import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import { IPermission } from '@leaa/common/interfaces';
import { GET_PERMISSIONS } from '@leaa/common/graphqls';

export const UserPermissions = () => {
  const { loading, data, variables, error } = useQuery(GET_PERMISSIONS);

  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  return (
    <div>
      <div>
        {loading ? (
          <p>Loading ...</p>
        ) : (
          <div>
            <p>{JSON.stringify(variables)}</p>
            <p>
              {data &&
                data.permissions &&
                data.permissions.items.map((p: IPermission) => <li key={p.slug}>{p.name}</li>)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
