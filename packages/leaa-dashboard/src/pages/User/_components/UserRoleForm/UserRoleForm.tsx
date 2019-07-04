import React from 'react';
import cx from 'classnames';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Col, Form, Checkbox, Row, Descriptions, Card, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

import { User, Role } from '@leaa/common/entrys';
import style from './style.less';

interface IProps extends FormComponentProps {
  className?: string;
  item?: User;
  roles: Role[];
  loading?: boolean;
}

@observer
class UserRoleFormInner extends React.PureComponent<IProps> {
  @observable checkAll: boolean = false;
  @observable indeterminate: boolean = true;

  constructor(props: IProps) {
    super(props);
  }

  @action.bound
  setCheckAll = (value: boolean) => {
    this.checkAll = value;
  };

  @action.bound
  setIndeterminate = (value: boolean) => {
    this.indeterminate = value;
  };

  onCheckAllChange = (event: CheckboxChangeEvent): void => {
    this.setIndeterminate(false);
    this.setCheckAll(event.target.checked);
    this.props.form.setFieldsValue({ roleIds: event.target.checked ? this.props.roles.map(r => r.id) : [] });
  };

  onChange = (value: CheckboxValueType[]) => {
    const nextValue = value.map(v => Number(v));
    this.props.form.setFieldsValue({ roleIds: nextValue });

    if (nextValue.length > 0) {
      this.setIndeterminate(true);
    }

    if (nextValue.length === 0) {
      this.setCheckAll(false);
      this.setIndeterminate(false);
    }
  };

  render() {
    const { props } = this;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={cx(style['wrapper'], props.className)}>
        <Form className={style['form-wrapper']}>
          <Card>
            <Descriptions title="Permissions" />
            {props.roles && (
              <Row gutter={16} className={style['form-row']}>
                <Checkbox
                  indeterminate={this.indeterminate}
                  checked={this.checkAll}
                  onChange={this.onCheckAllChange}
                  className={style['check-all']}
                >
                  Check all
                </Checkbox>

                {getFieldDecorator('roleIds', {
                  validateTrigger: ['onBlur'],
                  initialValue: this.props.item && this.props.item.roles && this.props.item.roles.map(r => r.id),
                })(
                  <Checkbox.Group onChange={this.onChange}>
                    <Row gutter={16} type="flex">
                      {props.roles.map(r => (
                        <Col key={r.id}>
                          <Checkbox value={r.id}>{r.name}</Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>,
                )}
              </Row>
            )}
          </Card>
        </Form>
      </div>
    );
  }
}

export const UserRoleForm = Form.create<IProps>()(UserRoleFormInner);
