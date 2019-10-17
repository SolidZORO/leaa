import React from 'react';
import cx from 'classnames';
import { Col, Form, Input, Row } from 'antd';
import { withTranslation } from 'react-i18next';
import { FormComponentProps } from 'antd/lib/form';

import { Article } from '@leaa/common/src/entrys';
import { ITfn } from '@leaa/dashboard/src/interfaces';
import { FormCard } from '@leaa/dashboard/src/components/FormCard';
import { SwitchNumber } from '@leaa/dashboard/src/components/SwitchNumber';
import { SelectCategoryIdByTree } from '@leaa/dashboard/src/components/SelectCategoryIdByTree';

import style from './style.less';

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

  componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<{}>, snapshot?: any): void {
    if (prevProps.item && this.props.item && prevProps.item.updated_at !== this.props.item.updated_at) {
      this.props.form.setFieldsValue({
        slug: this.props.item.slug,
        description: this.props.item.description,
      });
    }
  }

  render() {
    const { t } = this.props;

    const { props } = this;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={cx(style['wrapper'], props.className)}>
        <FormCard>
          <Form className={cx('g-form--zero-margin-bottom', style['form-wrapper'])}>
            <Row gutter={16} className={style['form-row']}>
              <Col xs={19} sm={16}>
                <Form.Item label={t('_lang:category')}>
                  {getFieldDecorator('category_id', {
                    initialValue: props.item ? props.item.category_id : undefined,
                    rules: [{ required: true }],
                    normalize: e => e && Number(e),
                  })(<SelectCategoryIdByTree />)}
                </Form.Item>
              </Col>

              <Col xs={5} sm={8}>
                <Form.Item label={t('_lang:status')}>
                  {getFieldDecorator('status', {
                    initialValue: props.item ? Number(props.item.status) : 0,
                  })(<SwitchNumber />)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16} className={style['form-row']}>
              <Col xs={24}>
                <Form.Item label={false}>
                  {getFieldDecorator('slug', {
                    initialValue: props.item ? props.item.slug : undefined,
                    rules: [],
                  })(<Input placeholder={t('_lang:slug')} />)}
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item label={false}>
                  {getFieldDecorator('description', {
                    initialValue: props.item ? props.item.description : undefined,
                    rules: [],
                  })(<Input.TextArea rows={5} placeholder={t('_lang:description')} />)}
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item label={false}>
                  <Input
                    value={props.item ? `${props.item.created_at}` : undefined}
                    placeholder={t('_lang:created_at')}
                    readOnly
                    disabled
                  />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item label={false} style={{ marginBottom: 0 }}>
                  <Input
                    value={props.item ? `${props.item.updated_at}` : undefined}
                    placeholder={t('_lang:updated_at')}
                    readOnly
                    disabled
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
export const ArticleExtForm = withTranslation()(Form.create<IFormProps>()(ArticleExtFormInner));
