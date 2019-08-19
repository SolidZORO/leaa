import React from 'react';
import cx from 'classnames';
import { Col, Form, Input, Row } from 'antd';
import { withTranslation } from 'react-i18next';
import { FormComponentProps } from 'antd/lib/form';

import { Category } from '@leaa/common/src/entrys';
import { ITfn } from '@leaa/dashboard/src/interfaces';
import { FormCard } from '@leaa/dashboard/src/components/FormCard';
import { SelectCategoryIdByTree } from '@leaa/dashboard/src/components/SelectCategoryIdByTree';

import style from './style.less';

interface IFormProps extends FormComponentProps {
  className?: string;
  item?: Category;
  categorys?: Category[];
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
        <FormCard title={t('_page:Category.Component.categoryInfo')}>
          <Form className={cx('g-form--zero-margin-bottom', style['form-wrapper'])}>
            <Row gutter={16} className={style['form-row']}>
              <Col xs={24} sm={6}>
                <Form.Item label={`${t('_lang:parent')} ID`}>
                  {getFieldDecorator('parent_id', {
                    initialValue: props.item ? props.item.parent_id : 0,
                    rules: [{ required: true }],
                    normalize: e => e && Number(e),
                  })(<SelectCategoryIdByTree />)}
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
                  <Form.Item label={t('_lang:created_at')}>
                    <Input
                      value={props.item ? `${props.item.created_at}` : undefined}
                      placeholder={t('_lang:created_at')}
                      readOnly
                      disabled
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={6}>
                  <Form.Item label={t('_lang:updated_at')}>
                    <Input
                      value={props.item ? `${props.item.updated_at}` : undefined}
                      placeholder={t('_lang:updated_at')}
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
          </Form>
        </FormCard>
      </div>
    );
  }
}

// @ts-ignore
export const CategoryInfoForm = withTranslation()(Form.create<IFormProps>()(CategoryInfoFormInner));
