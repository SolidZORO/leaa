import React from 'react';
import cx from 'classnames';
import { Button, Form, Input } from 'antd';
import { withTranslation } from 'react-i18next';
import { FormComponentProps } from 'antd/lib/form';

import { Setting } from '@leaa/common/entrys';
import { ITfn } from '@leaa/dashboard/interfaces';
import { FormCard } from '@leaa/dashboard/components/FormCard';

import style from './style.less';

interface IFormProps extends FormComponentProps {
  className?: string;
  settings?: Setting[];
  loading?: boolean;
  onClickLabelEditCallback: (setting: Setting) => void;
}

type IProps = IFormProps & ITfn;

class SettingInfoFormInner extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { t } = this.props;

    const { props } = this;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const buildTypeDom = (setting: Setting) => {
      let dom = <span>NOT-SUPPORT-TYPE</span>;
      const { type } = setting;

      if (type === 'input') {
        dom = <Input placeholder={setting.name} />;
      }

      if (type === 'textarea') {
        dom = <Input.TextArea placeholder={setting.name} />;
      }

      return dom;
    };

    const buildLabelDom = (setting: Setting) => {
      return (
        <span>
          <strong className={cx(style['label-text'])}>{setting.name}</strong>
          <em className={cx(style['label-fn'])}>
            <Button icon="edit" size="small" type="link" onClick={() => props.onClickLabelEditCallback(setting)} />
          </em>
        </span>
      );
    };

    return (
      <div className={cx(style['wrapper'], props.className)}>
        <FormCard title=" ">
          <Form
            className={cx('g-form--zero-margin-bottom', style['form-wrapper'])}
            hideRequiredMark
            {...formItemLayout}
          >
            {props.settings &&
              props.settings.map(setting => (
                <Form.Item key={setting.slug} label={buildLabelDom(setting)}>
                  {getFieldDecorator(`${setting.slug}`, {
                    initialValue: setting.value || null,
                    rules: [{ required: true }],
                  })(buildTypeDom(setting))}
                </Form.Item>
              ))}
          </Form>
        </FormCard>
      </div>
    );
  }
}

// @ts-ignore
export const SettingListForm = withTranslation()(Form.create<IFormProps>()(SettingInfoFormInner));
