import React from 'react';
import cx from 'classnames';
import queryString from 'query-string';
import { Col, Form, Input, Row } from 'antd';
import { withTranslation } from 'react-i18next';
import { FormComponentProps } from 'antd/lib/form';

import { Category } from '@leaa/common/src/entrys';
import { ITfn } from '@leaa/dashboard/src/interfaces';

import { FormCard, SelectCategoryIdByTree, EntryInfoDate } from '@leaa/dashboard/src/components';

import style from './style.module.less';

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
    const parentId = () => {
      if (props.item) return props.item.parent_id;

      const urlParams = queryString.parse(window.location.search);

      return urlParams.parent_id || 0;
    };

    return (
      <div className={cx(style['wrapper'], props.className)}>
        <FormCard
          title={t('_page:Category.Component.categoryInfo')}
          extra={<EntryInfoDate date={props.item && [props.item.created_at, props.item.updated_at]} />}
        >
          <Form className={cx('g-form--zero-margin-bottom', style['form-wrapper'])}>
            <Row gutter={16} className={style['form-row']}>
              <Col xs={24} sm={6}>
                <Form.Item label={`${t('_lang:parent')} ID`}>
                  {getFieldDecorator('parent_id', {
                    initialValue: parentId(),
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
