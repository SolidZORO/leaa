import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { IPermission } from '@leaa/common/interfaces';
import style from './style.less';

const GET_PERMISSIONS = gql`
  query {
    permissions {
      total
      items {
        id
        name
        slug
      }
    }
  }
`;

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
