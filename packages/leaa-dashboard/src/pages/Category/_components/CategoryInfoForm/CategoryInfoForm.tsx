import React from 'react';
import cx from 'classnames';
import { Col, Form, Input, Row, Descriptions, Card } from 'antd';
import { withTranslation } from 'react-i18next';
import { FormComponentProps } from 'antd/lib/form';

import { Category } from '@leaa/common/entrys';
import { ITfn } from '@leaa/dashboard/interfaces';

import style from './style.less';

interface IFormProps extends FormComponentProps {
  className?: string;
  item?: Category;
  loading?: boolean;
}

type IProps = IFormProps & ITfn;

class CategoryInfoFormInner extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { t } = this.props;

    const { props } = this;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={cx(style['wrapper'], props.className)}>
        <Form className={style['form-wrapper']}>
          <Card>
            <Descriptions title={t('_page:Category.Component.categoryInfo')} />

            <Row gutter={16} className={style['form-row']}>
              <Col xs={24} sm={6}>
                <Form.Item label={`${t('_lang:parent')} ID`}>
                  {getFieldDecorator('parentId', {
                    initialValue: props.item ? props.item.parentId : undefined,
                    rules: [{ required: true }],
                    normalize: e => Number(e),
                  })(<Input type="number" placeholder={`${t('_lang:parent')} ID`} />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={6}>
                <Form.Item label={t('_lang:name')}>
                  {getFieldDecorator('name', {
                    initialValue: props.item ? props.item.name : undefined,
                    rules: [{ required: true }],
                  })(<Input placeholder={t('_lang:name')} />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={6}>
                <Form.Item label={t('_lang:slug')}>
                  {getFieldDecorator('slug', {
                    initialValue: props.item ? props.item.slug : undefined,
                    rules: [{ required: true }],
                  })(<Input placeholder={t('_lang:slug')} />)}
                </Form.Item>
              </Col>
            </Row>

            {props.item && (
              <Row gutter={16} className={style['form-row']}>
                <Col xs={24} sm={6}>
                  <Form.Item label={t('_lang:createdAt')}>
                    <Input
                      value={props.item ? `${props.item.createdAt}` : undefined}
                      placeholder={t('_lang:createdAt')}
                      readOnly
                      disabled
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={6}>
                  <Form.Item label={t('_lang:updatedAt')}>
                    <Input
                      value={props.item ? `${props.item.updatedAt}` : undefined}
                      placeholder={t('_lang:updatedAt')}
                      readOnly
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}

            <Row gutter={16} className={style['form-row']}>
              <Col xs={24}>
                <Form.Item label={t('_lang:description')}>
                  {getFieldDecorator('description', {
                    initialValue: props.item ? props.item.description : undefined,
                    rules: [],
                  })(<Input.TextArea rows={3} placeholder={t('_lang:description')} />)}
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Form>
      </div>
    );
  }
}

// @ts-ignore
export const CategoryInfoForm = withTranslation()(Form.create<IFormProps>()(CategoryInfoFormInner));
