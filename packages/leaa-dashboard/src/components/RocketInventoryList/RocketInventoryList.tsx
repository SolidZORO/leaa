import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { IPermission } from '@leaa/common/interfaces';
import style from './style.less';

// const GET_USERS = gql`
//   query {
//     users {
//       total
//       items {
//         name
//       }
//     }
//   }
// `;

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

export function RocketInventoryList() {
  const { loading, data, variables } = useQuery(GET_PERMISSIONS);
  return (
    <div>
      <div>
        <h3 className={style.aaa}>Available Inventory</h3>
        {loading ? (
          <p>Loading ...</p>
        ) : (
          <div>
            <p>{JSON.stringify(variables)}</p>
            <p>
              {data.permissions.items.map((p: IPermission) => (
                <li key={p.slug}>{p.name}</li>
              ))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
