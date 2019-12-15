import cx from 'classnames';
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Row, Checkbox } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

import { useTranslation } from 'react-i18next';

import { User, Role } from '@leaa/common/src/entrys';
import { messageUtil } from '@leaa/dashboard/src/utils';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { UpdateUserInput } from '@leaa/common/src/dtos/user';

import { FormCard } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  className?: string;
  item?: User;
  roles: Role[];
  loading?: boolean;
}

export const UserRolesForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const rolesLength = Array.isArray(props.roles) ? props.roles.length : 0;

  const [form] = Form.useForm();

  const getRoleIds = (roles: Role[] | undefined): number[] => roles?.map(r => r.id) || [];

  const [roleIds, setRoleIds] = useState<number[]>(getRoleIds(props.item?.roles));

  const onValidateForm = async (): IOnValidateFormResult<UpdateUserInput> => {
    try {
      return await form.validateFields();
    } catch (error) {
      return messageUtil.error(error.errorFields[0]?.errors[0]);
    }
  };

  const onCheckedAll = (event: CheckboxChangeEvent): void => {
    const ids = event.target.checked ? props.roles.map(r => r.id) : [];

    setRoleIds(ids);
    form.setFieldsValue({ roleIds: ids });
  };

  const onChange = (value: CheckboxValueType[]): void => {
    const ids = value.map(v => Number(v));

    setRoleIds(ids);
    form.setFieldsValue({ roleIds: ids });
  };

  const onUpdateForm = (item?: User): void => {
    if (!item) return undefined;

    // if APIs return error, do not flush out edited data
    if (form.getFieldValue('updated_at') && !item.updated_at) return undefined;

    // update was successful, keeping the form data and APIs in sync.
    if (form.getFieldValue('updated_at') !== item.updated_at) {
      form.setFieldsValue({
        ...item,
        roleIds: getRoleIds(props.item?.roles),
      });
    }

    return undefined;
  };

  const onClacIndeterminate = () => rolesLength > 0 && roleIds.length > 0 && roleIds.length < rolesLength;
  const onClacChecked = () => rolesLength > 0 && roleIds.length === rolesLength;

  useEffect(() => {
    if (props.item?.roles) setRoleIds(props.item?.roles?.map(r => r.id));
  }, [props.item]);

  useEffect(() => onUpdateForm(props.item), [form, props.item]);
  useImperativeHandle(ref, () => ({ form, onValidateForm }));

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <FormCard title={t('_page:User.userRoles')}>
        <Checkbox
          indeterminate={onClacIndeterminate()}
          checked={onClacChecked()}
          onChange={onCheckedAll}
          className={style['check-all']}
          value={roleIds}
        >
          {t('_lang:checkAll')}
        </Checkbox>

        <Form form={form} layout="vertical">
          <Form.Item name="roleIds" rules={[]}>
            <Checkbox.Group onChange={onChange}>
              <Row gutter={16}>
                {props.roles.map(r => (
                  <Col key={r.id}>
                    <Checkbox value={r.id}>{r.name}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </FormCard>
    </div>
  );
});
