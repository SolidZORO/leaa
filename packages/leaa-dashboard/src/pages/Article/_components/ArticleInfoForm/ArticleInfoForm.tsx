import React from 'react';
import cx from 'classnames';
import { Form, Input } from 'antd';
import { withTranslation } from 'react-i18next';
import { FormComponentProps } from 'antd/lib/form';

import { Article } from '@leaa/common/src/entrys';
import { ITfn } from '@leaa/dashboard/src/interfaces';

import style from './style.less';

interface IFormProps extends FormComponentProps {
  className?: string;
  item?: Article;
  loading?: boolean;
}

type IProps = IFormProps & ITfn;

class ArticleInfoFormInner extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { t } = this.props;

    const { props } = this;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={cx(style['wrapper'], props.className)}>
        <Form className={cx(style['form-wrapper'])}>
          <Form.Item label={false} className={style['form-label']}>
            {getFieldDecorator('title', {
              initialValue: props.item ? props.item.title : undefined,
              rules: [{ required: true }],
            })(<Input placeholder={t('_lang:title')} size="large" />)}
          </Form.Item>
        </Form>
      </div>
    );
  }
}

// @ts-ignore
export const ArticleInfoForm = withTranslation()(Form.create<IFormProps>()(ArticleInfoFormInner));
