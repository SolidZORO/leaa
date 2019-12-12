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
  const [form] = Form.useForm();

  const [checkAll, setCheckAll] = useState<boolean>(false);
  const [indeterminate, setIndeterminate] = useState<boolean>(false);

  const onValidateForm = async (): IOnValidateFormResult<UpdateUserInput> => {
    try {
      return await form.validateFields();
    } catch (error) {
      return messageUtil.error(error.errorFields[0]?.errors[0]);
    }
  };

  const onCheckAllChange = (event: CheckboxChangeEvent): void => {
    setIndeterminate(false);
    setCheckAll(event.target.checked);
    form.setFieldsValue({ roleIds: event.target.checked ? props.roles.map(r => r.id) : [] });
  };

  const getUserRoleIds = (userItem: User | undefined): number[] => {
    // const userRoles = userItem && userItem?.roles;
    return userItem?.roles?.map(r => r.id) || [];
  };

  // TODO v1 checked all error
  const calcCheckStatus = (selected: number[]) => {
    if (typeof selected === 'undefined' || typeof props.roles === 'undefined') {
      return;
    }

    if (selected.length > 0 && props.roles.length > 0 && selected.length === props.roles.length) {
      setCheckAll(true);
      setIndeterminate(false);
      return;
    }

    if (selected.length > 0) {
      setCheckAll(false);
      setIndeterminate(true);
      return;
    }

    setCheckAll(false);
    setIndeterminate(false);
  };

  const onChange = (value: CheckboxValueType[]) => {
    const nextValue = value.map(v => Number(v));
    form.setFieldsValue({ roleIds: nextValue });

    calcCheckStatus(nextValue);
  };

  const onUpdateForm = (item?: User) => {
    if (!item) return undefined;

    // if APIs return error, do not flush out edited data
    if (form.getFieldValue('updated_at') && !item.updated_at) return undefined;

    // update was successful, keeping the form data and APIs in sync.
    if (form.getFieldValue('updated_at') !== item.updated_at) {
      form.setFieldsValue({
        ...item,
        roleIds: getUserRoleIds(props.item),
      });
    }

    return undefined;
  };

  useEffect(() => onUpdateForm(props.item), [form, props.item]);

  useImperativeHandle(ref, () => ({ form, onValidateForm }));

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <FormCard title={t('_page:User.userRoles')}>
        <Checkbox
          indeterminate={indeterminate}
          checked={checkAll}
          onChange={onCheckAllChange}
          className={style['check-all']}
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
