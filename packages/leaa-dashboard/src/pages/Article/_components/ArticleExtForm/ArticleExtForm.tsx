import React from 'react';
import cx from 'classnames';
import moment from 'moment';
import { Form, Input, DatePicker } from 'antd';
import { withTranslation } from 'react-i18next';
import { FormComponentProps } from 'antd/lib/form';

import { Article } from '@leaa/common/src/entrys';
import { ITfn } from '@leaa/dashboard/src/interfaces';

import { FormCard } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IFormProps extends FormComponentProps {
  className?: string;
  item?: Article;
  loading?: boolean;
}

type IProps = IFormProps & ITfn;

class ArticleExtFormInner extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { t } = this.props;

    const { props } = this;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={cx(style['wrapper'], props.className)}>
        <FormCard title={t('_page:Article.Component.extendedInfo')}>
          <Form className={cx('g-form--zero-margin', style['form-wrapper'])}>
            <Form.Item label={t('_lang:description')}>
              {getFieldDecorator('description', {
                initialValue: props.item ? props.item.description : undefined,
                rules: [],
              })(<Input.TextArea rows={4} placeholder={t('_lang:description')} />)}
            </Form.Item>

            <Form.Item label={t('_lang:created_at')}>
              {getFieldDecorator('created_at', {
                initialValue: props.item ? moment(props.item.created_at) : moment(undefined),
                rules: [],
              })(<DatePicker showTime />)}
            </Form.Item>

            <Form.Item label={t('_lang:updated_at')}>
              <DatePicker
                showTime
                value={props.item && props.item.updated_at ? moment(props.item.updated_at) : moment()}
                disabled
              />
            </Form.Item>
          </Form>
        </FormCard>
      </div>
    );
  }
}

// @ts-ignore
export const ArticleExtForm = withTranslation()(Form.create<IFormProps>()(ArticleExtFormInner));
