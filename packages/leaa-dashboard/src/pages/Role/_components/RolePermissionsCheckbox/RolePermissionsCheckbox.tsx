import React, { useState, useEffect, forwardRef } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Row, Col, Checkbox } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

import { Permission } from '@leaa/common/src/entrys';

import style from './style.module.less';

interface IProps {
  className?: string;
  permissionsFlat: any;
  value?: any;
  onChangePermissionIds?: (PermissionIds: Array<CheckboxValueType>) => void;
}

export const RolePermissionsCheckbox = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();

  const permissionsGroup = _.groupBy(props.permissionsFlat, 'slugGroup');
  const allPermissionsIds = props.permissionsFlat.map((p: Permission) => p.id);

  const [value, setValue] = useState(props.value || []);

  const onCheckedAllStatus = () => {
    const checkedIds = value.length === allPermissionsIds.length ? [] : allPermissionsIds;

    if (props.onChangePermissionIds) {
      props.onChangePermissionIds(checkedIds);
    }
  };

  const onCheckPermission = (ids: Array<CheckboxValueType>) => {
    setValue(ids);

    if (props.onChangePermissionIds) {
      props.onChangePermissionIds(ids);
    }
  };

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    if (props.onChangePermissionIds) {
      props.onChangePermissionIds(value);
    }
  }, [value]);

  return (
    <div className={style['form-row']} ref={ref}>
      <Checkbox
        indeterminate={value.length && value.length < allPermissionsIds.length}
        checked={value.length === allPermissionsIds.length}
        onChange={onCheckedAllStatus}
        className={style['check-all']}
        value={value}
      >
        {t('_lang:checkAll')}
      </Checkbox>

      <Checkbox.Group onChange={onCheckPermission} value={value}>
        {_.map(permissionsGroup, (pg, key) => (
          <div key={key} className={style['permission-key-group']}>
            <div className={style['module-check-all-title']}>{t(`_route:${key}`)}</div>

            <Row gutter={16} type="flex" className={style['permission-group']}>
              {pg.map((p: any) => (
                <Col key={p.id} xs={24} md={12} lg={8} className={style['permission-item']}>
                  <Checkbox value={p.id} className={style['permission-item-checkbox']}>
                    <strong>{p.name}</strong>
                    <em>{p.slug}</em>
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </Checkbox.Group>
    </div>
  );
});
