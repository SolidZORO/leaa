import React from 'react';
import cx from 'classnames';
import { Col, Form, Input, InputNumber, Row } from 'antd';
import { withTranslation } from 'react-i18next';
import { FormComponentProps } from 'antd/lib/form';

import { Coupon, Tag as TagEntry } from '@leaa/common/src/entrys';
import { ITfn } from '@leaa/dashboard/src/interfaces';

import { FormCard, SelectUserSearchBox, SelectTagSearchBox } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IFormProps extends FormComponentProps {
  className?: string;
  item?: Coupon;
  loading?: boolean;
}

type IProps = IFormProps & ITfn;

class ConvertCouponFormInner extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { t } = this.props;

    const { props } = this;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={cx(style['wrapper'], props.className)}>
        <FormCard title={t('_page:Coupon.Component.couponInfo')}>
          <Form className={cx('g-form--zero-margin-bottom', style['form-wrapper'])}>
            <Row gutter={16} className={style['form-row']}>
              <Col xs={24} sm={6}>
                <Form.Item label={t('_page:Coupon.Component.code')}>
                  {getFieldDecorator('code', {
                    initialValue: undefined,
                    rules: [{ required: true }],
                  })(<Input placeholder={t('_page:Coupon.Component.code')} />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={6}>
                <Form.Item label={t('_lang:user')}>
                  {getFieldDecorator('amount', {
                    initialValue: undefined,
                    rules: [{ required: true }],
                  })(
                    <SelectUserSearchBox
                      // className={style['filter-bar-tag']}
                      useOnBlur
                      // onSelectTagCallback={(v: TagEntry) => onFilter({ field: 'tagName', value: v.name })}
                      // onEnterCallback={(v: string | undefined) => onFilter({ field: 'tagName', value: v })}
                      // onSelectTagCallback={(v: TagEntry) => console.log(v)}
                      onEnterCallback={(v: string | undefined) => console.log(v)}
                      // value={tagName}
                      placeholder={t('_lang:user')}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </FormCard>
      </div>
    );
  }
}

// @ts-ignore
export const ConvertCouponForm = withTranslation()(Form.create<IFormProps>()(ConvertCouponFormInner));
