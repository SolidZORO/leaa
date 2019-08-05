import React from 'react';
import cx from 'classnames';
import { Button, Form, Input, Icon, Tooltip } from 'antd';
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

export const buildTypeDom = (setting: Setting) => {
  let dom = <span>----</span>;

  const { type, description, name } = setting;

  if (type === 'input') {
    dom = <Input placeholder={name} />;
  }

  if (['radio', 'checkbox', 'textarea'].includes(type)) {
    dom = <Input.TextArea placeholder={name} rows={3} />;
  }

  return dom;
};

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

    const buildLabelDom = (setting: Setting) => {
      return (
        <span>
          <Tooltip
            title={
              <>
                <Icon type="question-circle" /> {setting.description}
              </>
            }
            trigger="hover"
          >
            <Button
              size="small"
              type="link"
              onClick={() => props.onClickLabelEditCallback(setting)}
              className={cx(style['label-button'])}
            >
              <Icon type="edit" className={cx(style['label-icon'])} />
              <strong className={cx(style['label-text'])}>{setting.name}</strong>
            </Button>
          </Tooltip>
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
                <Form.Item key={setting.id} label={buildLabelDom(setting)}>
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
