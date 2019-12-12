import React from 'react';
import cx from 'classnames';
import moment from 'moment';
import { Col, Form, Input, InputNumber, Row, DatePicker } from 'antd';
import { withTranslation } from 'react-i18next';
import { FormComponentProps } from 'antd/lib/form';

import { Promo } from '@leaa/common/src/entrys';
import { ITfn } from '@leaa/dashboard/src/interfaces';

import { FormCard, SwitchNumber, EntryInfoDate } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IFormProps extends FormComponentProps {
  className?: string;
  item?: Promo;
  loading?: boolean;
}

type IProps = IFormProps & ITfn;
type ITimeRange = [moment.Moment, moment.Moment];

interface IState {
  timeRange: ITimeRange;
}

const currentDayZeroTime = moment();
const defaultTimeRange: ITimeRange = [currentDayZeroTime, moment(currentDayZeroTime).add(3, 'day')];

const AVAILABLE_DATE_TIPS_FORMAT = 'YYYY-MM-DD (HH:mm:ss)';

class PromoInfoFormInner extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = { timeRange: defaultTimeRange };
  }

  componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>): void {
    if (
      this.props.item &&
      this.props.item !== prevProps.item &&
      this.props.item.start_time &&
      this.props.item.expire_time
    ) {
      this.updateTimeRange([moment(this.props.item.start_time), moment(this.props.item.expire_time)]);
    }
  }

  updateTimeRange = (timeRange: ITimeRange) => {
    const nextTimeRange: ITimeRange = [moment(timeRange[0]), moment(timeRange[1])];

    this.props.form.setFieldsValue({
      start_time: nextTimeRange[0],
      expire_time: nextTimeRange[1],
    });

    this.setState({ timeRange: nextTimeRange });
  };

  render() {
    const { t } = this.props;

    const { props } = this;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={cx(style['wrapper'], props.className)}>
        <FormCard
          title={t('_page:Promo.promoInfo')}
          extra={<EntryInfoDate date={props.item && [props.item.created_at, props.item.updated_at]} />}
        >
          <Form className={cx('g-form--zero-margin-bottom', style['form-wrapper'])}>
            <Row gutter={16} className={style['form-row']}>
              <Col xs={24} sm={6}>
                <Form.Item label={t('_lang:name')}>
                  {getFieldDecorator('name', {
                    initialValue: props.item ? props.item.name : undefined,
                    rules: [{ required: true }],
                  })(<Input placeholder={t('_lang:name')} />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={3}>
                <Form.Item label={t('_page:Promo.amount')}>
                  {getFieldDecorator('amount', {
                    initialValue: props.item ? props.item.amount : 0,
                    rules: [{ required: true }],
                  })(<InputNumber placeholder={t('_lang:amount')} className="g-input-number" />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={3}>
                <Form.Item label={t('_page:Promo.overAmount')}>
                  {getFieldDecorator('over_amount', {
                    initialValue: props.item ? props.item.over_amount : 0,
                    rules: [{ required: true }],
                  })(<InputNumber placeholder={t('_lang:over_amount')} className="g-input-number" />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={3}>
                <Form.Item label={t('_lang:status')}>
                  {getFieldDecorator('status', {
                    initialValue: props.item ? Number(props.item.status) : 1,
                    rules: [{ required: true }],
                  })(<SwitchNumber />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={3}>
                <Form.Item label={t('_lang:quantity')}>
                  {getFieldDecorator('quantity', {
                    initialValue:
                      props.item && typeof props.item.quantity !== 'undefined' ? Number(props.item.quantity) : 1,
                    rules: [{ required: true }],
                  })(<InputNumber placeholder={t('_lang:quantity')} className="g-input-number" />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={3}>
                <Form.Item label={t('_page:Promo.redeemedQuantity')}>
                  {getFieldDecorator('redeemed_quantity', {
                    initialValue:
                      props.item && typeof props.item.redeemed_quantity !== 'undefined'
                        ? Number(props.item.redeemed_quantity)
                        : 0,
                    rules: [{ required: true }],
                  })(
                    <InputNumber placeholder={t('_lang:quantity')} className="g-input-number" disabled={!props.item} />,
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16} className={style['form-row']}>
              <Col xs={24}>
                {getFieldDecorator('start_time', {
                  initialValue:
                    props.item && props.item.start_time ? moment(this.state.timeRange[0]) : defaultTimeRange[0],
                  rules: [{ required: true }],
                })(<Input type="hidden" />)}
                {getFieldDecorator('expire_time', {
                  initialValue:
                    props.item && props.item.expire_time ? moment(this.state.timeRange[1]) : defaultTimeRange[1],
                  rules: [{ required: true }],
                })(<Input type="hidden" />)}

                <Form.Item
                  colon={false}
                  label={
                    <span className={style['available-date-row']}>
                      <strong>{t('_page:Promo.availableDate')} : </strong>
                      <em>
                        {moment(this.state.timeRange[0]).format(AVAILABLE_DATE_TIPS_FORMAT)} ~{' '}
                        {moment(this.state.timeRange[1]).format(AVAILABLE_DATE_TIPS_FORMAT)}
                      </em>
                    </span>
                  }
                >
                  <DatePicker.RangePicker
                    value={this.state.timeRange}
                    onChange={e => this.updateTimeRange(e as ITimeRange)}
                  />
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
export const PromoInfoForm = withTranslation()(Form.create<IFormProps>()(PromoInfoFormInner));
