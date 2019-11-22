import React from 'react';
import cx from 'classnames';
import { Form, Input, Col, Icon, Row } from 'antd';
import { withTranslation } from 'react-i18next';
import { FormComponentProps } from 'antd/lib/form';

import { Article } from '@leaa/common/src/entrys';
import { ITfn } from '@leaa/dashboard/src/interfaces';

import { SwitchNumber, SelectCategoryIdByTree } from '@leaa/dashboard/src/components';

import style from './style.module.less';

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
        <Form className={style['form-wrapper-title']}>
          <Form.Item label={false} className={style['form-item-title']}>
            {getFieldDecorator('title', {
              initialValue: props.item ? props.item.title : undefined,
              rules: [{ required: true }],
            })(<Input placeholder={t('_lang:title')} size="large" className={style['form-item-title-input']} />)}
          </Form.Item>
        </Form>

        <Form className={style['form-wrapper-slug']} layout="inline" hideRequiredMark={Boolean(props.item)}>
          <Row gutter={16} className={style['form-row']} type="flex" justify="space-between">
            {props.item && (
              <Col>
                <Form.Item label={false} className={style['form-item-slug']}>
                  {getFieldDecorator('slug', {
                    initialValue: props.item ? props.item.slug : undefined,
                    rules: [],
                  })(
                    <Input
                      size="small"
                      className={style['form-item-slug-input']}
                      prefix={<Icon type="link" />}
                      placeholder={t('_lang:slug')}
                    />,
                  )}
                </Form.Item>
              </Col>
            )}

            <Col>
              <Form.Item label={t('_lang:category')} className={style['form-item-category']} colon={false}>
                {getFieldDecorator('categoryIds', {
                  initialValue:
                    // TIPS: here you can set up multiple categories, but now just single.
                    props.item && props.item.categories && props.item.categories.length > 0
                      ? props.item.categories[0].id
                      : undefined,
                  rules: [{ required: true }],
                  normalize: e => e && Number(e),
                })(
                  <SelectCategoryIdByTree
                    className={style['form-item-category-select']}
                    componentProps={{ allowClear: true, size: 'small' }}
                  />,
                )}
              </Form.Item>

              <Form.Item label={t('_lang:status')} className={style['form-item-status']} colon={false}>
                {getFieldDecorator('status', {
                  initialValue: props.item ? Number(props.item.status) : 0,
                })(<SwitchNumber size="small" />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

// @ts-ignore
export const ArticleInfoForm = withTranslation()(Form.create<IFormProps>()(ArticleInfoFormInner));
