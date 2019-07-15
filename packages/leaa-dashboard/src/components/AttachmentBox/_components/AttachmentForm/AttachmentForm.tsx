import React from 'react';
import cx from 'classnames';
import { Col, Form, Input, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

import { Attachment } from '@leaa/common/entrys';
import { ITfn } from '@leaa/dashboard/interfaces';
import { SwitchNumber } from '@leaa/dashboard/components/SwitchNumber';
import { FormCard } from '@leaa/dashboard/components/FormCard';

import style from './style.less';

interface IFormProps extends FormComponentProps {
  attachment: Attachment;
  className?: string;
  loading?: boolean;
}

type IProps = IFormProps & ITfn;

class AttachmentFormInner extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { props } = this;
    const { getFieldDecorator } = this.props.form;

    // title={t('_page:Article.Component.articleInfo')}
    return (
      <div className={cx(style['wrapper'], props.className)}>
        <FormCard>
          <Form className={style['form-wrapper']}>
            <Row gutter={16} className={style['form-row']}>
              <Col xs={24} sm={8}>
                <Form.Item>
                  {getFieldDecorator('path', {
                    initialValue: props.attachment ? props.attachment.title : undefined,
                    rules: [{ required: true }],
                  })(<img width="40" src={`${process.env.API_HOST}${props.attachment.path}`} alt="" />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                <Form.Item>
                  {getFieldDecorator('title', {
                    initialValue: props.attachment ? props.attachment.title : undefined,
                    rules: [{ required: true }],
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                <Form.Item>
                  {getFieldDecorator('status', {
                    initialValue: props.attachment ? Number(props.attachment.status) : 0,
                  })(<SwitchNumber />)}
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
export const AttachmentForm = Form.create<IFormProps>()(AttachmentFormInner);
