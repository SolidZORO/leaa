import React, { useState, useEffect, forwardRef } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Row, Col, Checkbox } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

import style from './style.module.less';

interface IProps {
  permissionsFlat: any[];
  value?: any;
  onChangePermissionIds?: (PermissionIds: CheckboxValueType[]) => void;
  className?: string;
}

export const RolePermissionsCheckbox = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const permissionsGroup = _.groupBy(props.permissionsFlat, 'slugGroup');
  const permissionsLength = Array.isArray(props.permissionsFlat) ? props.permissionsFlat.length : 0;

  const [value, setValue] = useState(props.value || []);

  const onCheckedAll = (event: CheckboxChangeEvent) => {
    const ids = event.target.checked ? props.permissionsFlat.map((p) => p.id) : [];

    setValue(ids);
    if (props.onChangePermissionIds) {
      props.onChangePermissionIds(ids);
    }
  };

  const onChange = (ids: CheckboxValueType[]) => {
    setValue(ids);

    if (props.onChangePermissionIds) {
      props.onChangePermissionIds(ids);
    }
  };

  const onClacIndeterminate = () => permissionsLength > 0 && value.length > 0 && value.length < permissionsLength;
  const onClacChecked = () => permissionsLength > 0 && value.length === permissionsLength;

  useEffect(() => {
    if (props.value) setValue(props.value);
  }, [props.value]);

  return (
    <div className={style['form-row']} ref={ref}>
      <Checkbox
        indeterminate={onClacIndeterminate()}
        checked={onClacChecked()}
        onChange={onCheckedAll}
        className={style['check-all']}
        value={value}
      >
        {t('_lang:checkAll')}
      </Checkbox>

      <Checkbox.Group onChange={onChange} value={value}>
        {permissionsGroup &&
          _.map(permissionsGroup, (pg, key) => (
            <div key={key} className={style['permission-key-group']}>
              <div className={style['module-check-all-title']}>{t(`_route:${key}`)}</div>

              <Row gutter={16} className={style['permission-group']}>
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
