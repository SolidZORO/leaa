import cx from 'classnames';
import moment from 'moment';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Input, Row, DatePicker } from 'antd';

import { useTranslation } from 'react-i18next';

import { Article } from '@leaa/common/src/entrys';
import { msgError } from '@leaa/dashboard/src/utils';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { UpdateArticleInput } from '@leaa/common/src/dtos/article';

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

  const onValidateForm = async (): IOnValidateFormResult<UpdateArticleInput> => {
    try {
      return await form.validateFields();
    } catch (error) {
      return msgError(error.errorFields[0]?.errors[0]);
    }
  };

  const onUpdateForm = (item?: Article) => {
    if (!item) return undefined;

    // if APIs return error, do not flush out edited data
    if (form.getFieldValue('updated_at') && !item.updated_at) {
      form.resetFields();
      return undefined;
    }

    // update was successful, keeping the form data and APIs in sync.
    if (form.getFieldValue('updated_at') !== item.updated_at) {
      form.resetFields();
      form.setFieldsValue({
        description: item.description,
        released_at: item.released_at ? moment(item.released_at) : null,
      });
    }

    return undefined;
  };

  useEffect(() => onUpdateForm(props.item), [form, props.item]);

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
              <Form.Item name="description" rules={[]} label={t('_lang:description')}>
                <Input.TextArea rows={3} placeholder={t('_lang:description')} />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item name="released_at" rules={[]} label={t('_lang:releasedAt')}>
                <DatePicker showTime />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label={t('_lang:updatedAt')}>
                <DatePicker
                  showTime
                  value={props.item?.updated_at ? moment(props.item.updated_at) : moment()}
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </FormCard>
    </div>
  );
});
