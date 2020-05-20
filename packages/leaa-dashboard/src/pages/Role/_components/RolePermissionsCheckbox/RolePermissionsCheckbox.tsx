import React, { useState, useEffect, forwardRef } from 'react';
import _, { groupBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Row, Col, Checkbox } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

import style from './style.module.less';

interface IProps {
  permissionsFlat?: any[];
  value?: any;
  onChangePermissionIds: (PermissionIds: CheckboxValueType[] | undefined) => void;
  className?: string;
}

export const RolePermissionsCheckbox = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();

  // if (props.permissionsFlat?.length === 0) return null;

  const [permissionsGroup, setPermissionsGroup] = useState<any>({});

  // const permissionsWithSlugGroup = _.groupBy(
  //   props.permissionsFlat?.map((i) => ({
  //     ...i,
  //     slugGroup: i.slug.split('.')[0],
  //   })),
  //   'slugGroup',
  // );

  // const permissionsGroup = _.groupBy(permissionsWithSlugGroup, 'slugGroup');
  // const permissionsGroup = {};

  // console.log('>>>>>>>>>>>>>>>>', permissionsGroup);

  // const permissionsGroup = _.groupBy(props.permissionsFlat, 'slugGroup');
  // const permissionsGroup = {};
  const permissionsLength = _.isArray(props.permissionsFlat) ? props.permissionsFlat?.length : 0;

  const [value, setValue] = useState(props.value || []);

  const onCheckedAll = (event: CheckboxChangeEvent) => {
    const ids = event.target.checked ? props.permissionsFlat?.map((p) => p.id) : [];

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
    // if (props.value) setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    if (_.isEmpty(props.permissionsFlat)) return;

    console.log('>??????', props.permissionsFlat);

    const aaa = [
      {
        id: '031d89d5-8517-464c-a9e8-acca842cb985',
        created_at: '2020-05-11T11:10:39.000Z',
        updated_at: null,
        deleted_at: null,
        name: 'Ad Item Update',
        slug: 'ax.item-update',
        slugGroup: 'ax',
      },
      {
        id: '08629ab5-b024-4e9d-b008-047493749cc0',
        created_at: '2020-05-11T11:10:40.000Z',
        updated_at: null,
        deleted_at: null,
        name: 'Promo Item Create',
        slug: 'promo.item-create',
        slugGroup: 'promo',
      },
      {
        id: '09046b46-b466-49c3-9258-ebe3cd2e94ac',
        created_at: '2020-05-11T11:10:39.000Z',
        updated_at: null,
        deleted_at: null,
        name: 'Role Item Update',
        slug: 'role.item-update',
        slugGroup: 'role',
      },
    ];

    // const pfg = props.permissionsFlat?.map((i) => ({
    //   ...i,
    //   slugGroup: i.slug.split('.')[0],
    // }));

    // const qqq = _.groupBy(aaa, 'slugGroup');
    console.log(groupBy);

    const qqq = groupBy(
      [
        {
          // id: '09046b46-b466-49c3-9258-ebe3cd2e94ac',
          // created_at: '2020-05-11T11:10:39.000Z',
          // updated_at: null,
          // deleted_at: null,
          name: 'Role Item Update',
          // slug: 'role.item-update',
          slugGroup: 'role',
        },
      ],
      'name',
    );

    console.log(qqq);

    // setPermissionsGroup(_.groupBy(aaa, 'slugGroup'));
  }, [props.permissionsFlat]);

  return (
    <div className={style['form-row']} ref={ref}>
      {/*<Checkbox*/}
      {/*  indeterminate={onClacIndeterminate()}*/}
      {/*  checked={onClacChecked()}*/}
      {/*  onChange={onCheckedAll}*/}
      {/*  className={style['check-all']}*/}
      {/*  value={value}*/}
      {/*>*/}
      {/*  {t('_lang:checkAll')}*/}
      {/*</Checkbox>*/}

      {/*<Checkbox.Group onChange={onChange} value={value}>*/}
      {/*  {false && _.isEmpty(permissionsGroup) &&*/}
      {/*    _.map(permissionsGroup, (pg, key) => (*/}
      {/*      <div key={key} className={style['permission-key-group']}>*/}
      {/*        <div className={style['module-check-all-title']}>{t(`_route:${key}`)}</div>*/}

      {/*        <Row gutter={16} className={style['permission-group']}>*/}
      {/*          {pg.map((p: any) => (*/}
      {/*            <Col key={p.id} xs={24} md={12} lg={8} className={style['permission-item']}>*/}
      {/*              <Checkbox value={p.id} className={style['permission-item-checkbox']}>*/}
      {/*                <strong>{p.name}</strong>*/}
      {/*                <em>{p.slug}</em>*/}
      {/*              </Checkbox>*/}
      {/*            </Col>*/}
      {/*          ))}*/}
      {/*        </Row>*/}
      {/*      </div>*/}
      {/*    ))}*/}
      {/*</Checkbox.Group>*/}
    </div>
  );
});
