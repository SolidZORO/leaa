import cx from 'classnames';
import moment from 'moment';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Input, Row, DatePicker } from 'antd';

import { useTranslation } from 'react-i18next';

import { Article } from '@leaa/common/src/entrys';
import { errorMsg, formatFieldsToMoment } from '@leaa/dashboard/src/utils';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { ArticleUpdateOneReq } from '@leaa/common/src/dtos/article';

import { FormCard, EntryInfoDate } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  item?: Article;
  className?: string;
  loading?: boolean;
}

export const ArticleExtForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onValidateForm = async (): IOnValidateFormResult<ArticleUpdateOneReq> => {
    try {
      return await form.validateFields();
    } catch (err) {
      return errorMsg(err.errorFields[0]?.errors[0]);
    }
  };

  const onRefreshForm = (item?: Article) => {
    if (!item) return form.setFieldsValue({});

    form.resetFields();
    form.setFieldsValue(formatFieldsToMoment(item, { fields: ['released_at', 'updated_at'] }));

    return undefined;
  };

  useEffect(() => onRefreshForm(props.item), [form, props.item]);
  useImperativeHandle(ref, () => ({ form, onValidateForm }));

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <FormCard
        title={null}
        extra={<EntryInfoDate date={props.item && [props.item.created_at, props.item.updated_at]} />}
      >
        <Form form={form} name="article-ext" layout="vertical">
          <Row gutter={16} className={style['form-row']}>
            <Col xs={24}>
              <Form.Item name="description" label={t('_lang:description')}>
                <Input.TextArea rows={3} placeholder={t('_lang:description')} />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item name="released_at" label={t('_lang:releasedAt')}>
                <DatePicker showTime />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label={t('_lang:updatedAt')}>
                <DatePicker showTime disabled value={moment(props.item?.updated_at)} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </FormCard>
    </div>
  );
});
