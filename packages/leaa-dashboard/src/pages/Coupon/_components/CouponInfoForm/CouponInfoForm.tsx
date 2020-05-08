import cx from 'classnames';
import moment from 'moment';
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Input, InputNumber, Row, DatePicker } from 'antd';

import { useTranslation } from 'react-i18next';

import { Coupon } from '@leaa/common/src/entrys';
import { errorMessage, formatDateTimeToDayStartOrEnd } from '@leaa/dashboard/src/utils';
import { IOnValidateFormResult, IDateRange } from '@leaa/dashboard/src/interfaces';
import { UpdateCouponInput } from '@leaa/common/src/dtos/coupon';

import { FormCard, EntryInfoDate, SwitchNumber, IdTag, Rcon, PriceInput } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  item?: Coupon;
  loading?: boolean;
  className?: string;
}

const AVAILABLE_DATE_TIPS_FORMAT = 'YYYY-MM-DD (HH:mm:ss)';
const currentDayZeroTime = moment();
const defaultTimeRange: IDateRange = [currentDayZeroTime, moment(currentDayZeroTime).add(3, 'day')];

export const CouponInfoForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [timeRange, setTimeRange] = useState<IDateRange>(defaultTimeRange);

  const onValidateForm = async (): IOnValidateFormResult<UpdateCouponInput> => {
    try {
      return await form.validateFields();
    } catch (err) {
      return errorMessage(err.errorFields[0]?.errors[0]);
    }
  };

  const onUpdateForm = (item?: Coupon) => {
    if (!item) {
      form.setFieldsValue({
        type: 'coupon',
        amount: 0,
        over_amount: 0,
        quantity: 1,
        status: 1,
        //
        start_time: defaultTimeRange[0],
        expire_time: defaultTimeRange[1],
      });

      return undefined;
    }

    // if APIs return error, do not flush out edited data
    if (form.getFieldValue('updated_at') && !item.updated_at) {
      form.resetFields();
      return undefined;
    }

    // update was successful, keeping the form data and APIs in sync.
    if (form.getFieldValue('updated_at') !== item.updated_at) {
      form.resetFields();
      form.setFieldsValue({
        type: 'coupon',
        name: item.name,
        amount: item.amount,
        over_amount: item.over_amount,
        status: item.status,
        //
        start_time: item.start_time,
        expire_time: item.expire_time,
      });
    }

    return undefined;
  };

  const updateTimeRange = (date: IDateRange | any) => {
    let nextDate: IDateRange = defaultTimeRange;

    if (date) nextDate = date;

    form.setFieldsValue({
      start_time: nextDate[0],
      expire_time: nextDate[1],
    });

    setTimeRange(nextDate);
  };

  useEffect(() => {
    onUpdateForm(props.item);

    if (props.item && props.item.start_time && props.item.expire_time) {
      updateTimeRange([moment(props.item.start_time), moment(props.item.expire_time)]);
    }
  }, [props.item]);

  useImperativeHandle(ref, () => ({ form, onValidateForm }));

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <FormCard
        title={t('_page:Coupon.couponInfo')}
        extra={<EntryInfoDate date={props.item && [props.item.created_at, props.item.updated_at]} />}
      >
        <Form form={form} name="coupon-info" layout="vertical">
          <Row gutter={16}>
            <div style={{ display: 'none' }}>
              <Form.Item name="type" noStyle rules={[{ required: true }]} label={t('_lang:type')}>
                <Input placeholder={t('_lang:type')} />
              </Form.Item>
            </div>

            <Col xs={24} sm={6}>
              <Form.Item name="name" rules={[{ required: true }]} label={t('_lang:name')}>
                <Input placeholder={t('_lang:name')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={4}>
              <Form.Item name="amount" rules={[{ required: true }]} label={t('_page:Coupon.amount')}>
                <PriceInput className="g-input-number" placeholder={t('_page:Coupon.amount')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={4}>
              <Form.Item name="over_amount" rules={[{ required: true }]} label={t('_page:Coupon.overAmount')}>
                <PriceInput className="g-input-number" placeholder={t('_lang:over_amount')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={3}>
              <Form.Item
                name="status"
                normalize={(e) => e && Number(e)}
                rules={[{ required: true }]}
                label={t('_lang:status')}
              >
                <SwitchNumber />
              </Form.Item>
            </Col>

            <Col xs={24} sm={3}>
              {props.item ? (
                <Form.Item label={t('_page:Coupon.redeemUser')}>
                  <IdTag
                    id={props.item?.user_id}
                    link={`/users/${props.item?.user_id}`}
                    icon={<Rcon type="ri-user-3-line" />}
                  />
                </Form.Item>
              ) : (
                <Form.Item name="quantity" rules={[{ required: true }]} label={t('_lang:quantity')}>
                  <InputNumber placeholder={t('_lang:quantity')} className="g-input-number" />
                </Form.Item>
              )}
            </Col>
          </Row>

          <Row gutter={16}>
            <div style={{ display: 'none' }}>
              <Form.Item name="start_time" noStyle rules={[{ required: true }]}>
                <DatePicker />
              </Form.Item>

              <Form.Item name="expire_time" noStyle rules={[{ required: true }]}>
                <DatePicker />
              </Form.Item>
            </div>

            <Col xs={24}>
              <Form.Item
                colon={false}
                label={
                  <span className={style['available-date-row']}>
                    <strong>{t('_page:Coupon.availableDate')} : </strong>
                    <em>
                      {moment(formatDateTimeToDayStartOrEnd('start', timeRange[0])).format(AVAILABLE_DATE_TIPS_FORMAT)}~
                      {moment(formatDateTimeToDayStartOrEnd('end', timeRange[1])).format(AVAILABLE_DATE_TIPS_FORMAT)}
                    </em>
                  </span>
                }
              >
                <DatePicker.RangePicker value={timeRange as IDateRange} onChange={updateTimeRange} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </FormCard>
    </div>
  );
});
