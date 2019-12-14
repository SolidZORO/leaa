import cx from 'classnames';
import moment from 'moment';
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Input, InputNumber, Row, DatePicker } from 'antd';
import { RangePickerValue } from 'antd/lib/date-picker/interface';

import { useTranslation } from 'react-i18next';

import { Promo } from '@leaa/common/src/entrys';
import { messageUtil, dateUtil } from '@leaa/dashboard/src/utils';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { UpdatePromoInput } from '@leaa/common/src/dtos/promo';

import { FormCard, EntryInfoDate, SwitchNumber } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  item?: Promo;
  loading?: boolean;
  className?: string;
}

const AVAILABLE_DATE_TIPS_FORMAT = 'YYYY-MM-DD (HH:mm:ss)';
const currentDayZeroTime = moment();
const defaultTimeRange: RangePickerValue = [currentDayZeroTime, moment(currentDayZeroTime).add(3, 'day')];

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
      });

      form.setFields([
        { name: 'start_time', value: defaultTimeRange[0] },
        { name: 'expire_time', value: defaultTimeRange[1] },
      ]);

      return undefined;
    }

    // if APIs return error, do not flush out edited data
    if (form.getFieldValue('updated_at') && !item.updated_at) return undefined;

    // update was successful, keeping the form data and APIs in sync.
    if (form.getFieldValue('updated_at') !== item.updated_at) {
      form.setFieldsValue({
        ...item,
      });

      form.setFields([
        { name: 'start_time', value: props.item?.start_time || defaultTimeRange[0] },
        { name: 'expire_time', value: props.item?.expire_time || defaultTimeRange[1] },
      ]);
    }

    return undefined;
  };

  const updateTimeRange = (date: RangePickerValue) => {
    let nextDate: RangePickerValue = defaultTimeRange;

    if (date) nextDate = date;

    form.setFields([
      { name: 'start_time', value: nextDate[0] },
      { name: 'expire_time', value: nextDate[1] },
    ]);

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
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={6}>
              <Form.Item name="name" rules={[{ required: true }]} label={t('_lang:name')}>
                <Input placeholder={t('_lang:name')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={4}>
              <Form.Item name="amount" rules={[{ required: true }]} label={t('_page:Promo.amount')}>
                <InputNumber className="g-input-number" placeholder={t('_page:Promo.amount')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={4}>
              <Form.Item name="over_amount" rules={[{ required: true }]} label={t('_page:Promo.overAmount')}>
                <InputNumber className="g-input-number" placeholder={t('_lang:over_amount')} />
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
                <DatePicker.RangePicker value={timeRange} onChange={updateTimeRange} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </FormCard>
    </div>
  );
});
