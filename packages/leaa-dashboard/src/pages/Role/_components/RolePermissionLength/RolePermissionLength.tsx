import React from 'react';

import style from './style.module.less';

interface IProps {
  allPermissionsLength?: number;
  rolePermissionsLength?: number;
}

export const RolePermissionLength = (props: IProps) => {
  const allPL = props.allPermissionsLength || 0;
  const rPL = props.rolePermissionsLength || 0;

  let length: number | string = `${rPL} / ${allPL}`;

  if (allPL > 0 && allPL === rPL) {
    length = 'All';
  }

  return <div className={style['permissions-length']}>({length})</div>;
};
