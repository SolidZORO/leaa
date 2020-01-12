import cx from 'classnames';
import moment from 'moment';
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Input, InputNumber, Row, DatePicker } from 'antd';

import { useTranslation } from 'react-i18next';

import { Promo } from '@leaa/common/src/entrys';
import { messageUtil, dateUtil } from '@leaa/dashboard/src/utils';
import { IOnValidateFormResult, IDateRange } from '@leaa/dashboard/src/interfaces';
import { UpdatePromoInput } from '@leaa/common/src/dtos/promo';

import { FormCard, EntryInfoDate, SwitchNumber, PriceInput } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  item?: Promo;
  loading?: boolean;
  className?: string;
}

const AVAILABLE_DATE_TIPS_FORMAT = 'YYYY-MM-DD (HH:mm:ss)';
const currentDayZeroTime = moment();
const defaultTimeRange: IDateRange = [currentDayZeroTime, moment(currentDayZeroTime).add(3, 'day')];

export const PromoInfoForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [timeRange, setTimeRange] = useState<any[]>(defaultTimeRange);

  const onValidateForm = async (): IOnValidateFormResult<UpdatePromoInput> => {
    try {
      return await form.validateFields();
    } catch (error) {
      return messageUtil.error(error.errorFields[0]?.errors[0]);
    }
  };

  const onUpdateForm = (item?: Promo) => {
    if (!item) {
      form.setFieldsValue({
        amount: 0,
        over_amount: 0,
        quantity: 1,
        redeemed_quantity: 0,
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
        name: item.name,
        amount: item.amount,
        over_amount: item.over_amount,
        quantity: item.quantity,
        status: item.status,
        //
        start_time: item.start_time || defaultTimeRange[0],
        expire_time: item.expire_time || defaultTimeRange[1],
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
        title={t('_page:Promo.promoInfo')}
        extra={<EntryInfoDate date={props.item && [props.item.created_at, props.item.updated_at]} />}
      >
        <Form form={form} name="promo-info" layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={6}>
              <Form.Item name="name" rules={[{ required: true }]} label={t('_lang:name')}>
                <Input placeholder={t('_lang:name')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={4}>
              <Form.Item name="amount" rules={[{ required: true }]} label={t('_page:Promo.amount')}>
                <PriceInput className="g-input-number" placeholder={t('_page:Promo.amount')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={4}>
              <Form.Item name="over_amount" rules={[{ required: true }]} label={t('_page:Promo.overAmount')}>
                <PriceInput className="g-input-number" placeholder={t('_lang:over_amount')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={4}>
              <Form.Item name="quantity" rules={[{ required: true }]} label={t('_lang:quantity')}>
                <InputNumber placeholder={t('_lang:quantity')} className="g-input-number" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={4}>
              <Form.Item
                name="status"
                normalize={e => e && Number(e)}
                rules={[{ required: true }]}
                label={t('_lang:status')}
              >
                <SwitchNumber />
              </Form.Item>
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
                    <strong>{t('_page:Promo.availableDate')} : </strong>
                    <em>
                      {moment(dateUtil.formatDateTimeToDayStartOrEnd('start', timeRange[0])).format(
                        AVAILABLE_DATE_TIPS_FORMAT,
                      )}
                      ~
                      {moment(dateUtil.formatDateTimeToDayStartOrEnd('end', timeRange[1])).format(
                        AVAILABLE_DATE_TIPS_FORMAT,
                      )}
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
