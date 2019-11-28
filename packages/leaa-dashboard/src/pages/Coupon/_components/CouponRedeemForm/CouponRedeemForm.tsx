import React from 'react';
import cx from 'classnames';
import { Col, Form, Input, Row } from 'antd';
import { withTranslation } from 'react-i18next';
import { FormComponentProps } from 'antd/lib/form';

import { Coupon } from '@leaa/common/src/entrys';
import { ITfn } from '@leaa/dashboard/src/interfaces';

import { FormCard, EntryInfoDate, UserSearchBox } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IFormProps extends FormComponentProps {
  className?: string;
  item?: Coupon;
  loading?: boolean;
  submitButton?: React.ReactNode;
}

type IProps = IFormProps & ITfn;

class CouponRedeemFormInner extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { t } = this.props;

    const { props } = this;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={cx(style['wrapper'], props.className)}>
        <FormCard
          title={t('_page:Coupon.Component.couponInfo')}
          extra={<EntryInfoDate date={props.item && [props.item.created_at, props.item.updated_at]} />}
        >
          <Form className={cx('g-form--zero-margin-bottom', style['form-wrapper'])}>
            <Row gutter={16} className={style['form-row']}>
              <Col xs={24} sm={8}>
                <Form.Item label={t('_page:Coupon.Component.code')}>
                  {getFieldDecorator('code', {
                    // initialValue: undefined,
                    initialValue: 'Tooltip',
                    rules: [{ required: true }],
                  })(<Input size="large" placeholder={t('_page:Coupon.Component.code')} />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                <Form.Item label={t('_lang:user')}>
                  {getFieldDecorator('userId', {
                    // initialValue: undefined,
                    initialValue: 1,
                    rules: [{ required: true }],
                  })(
                    <Input />
                    // <UserSearchBox
                    //   size="large"
                    //   useOnBlur
                    //   onSelectUserCallback={user => this.props.form.setFieldsValue({ userId: user && user.id })}
                    // />,
                  )}
                </Form.Item>
              </Col>

              {props.submitButton && (
                <Col xs={24} sm={4}>
                  <Form.Item label={' '} colon={false}>
                    {props.submitButton}
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Form>
        </FormCard>
      </div>
    );
  }
}

// @ts-ignore
export const CouponRedeemForm = withTranslation()(Form.create<IFormProps>()(CouponRedeemFormInner));
