import React from 'react';
import cx from 'classnames';
import { Button, Form, Input, Tooltip, Select } from 'antd';
import { withTranslation } from 'react-i18next';
import { FormComponentProps } from 'antd/lib/form';

import { Setting } from '@leaa/common/src/entrys';
import { ITfn } from '@leaa/dashboard/src/interfaces';
import { FormCard, Rcon } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IFormProps extends FormComponentProps {
  className?: string;
  settings?: Setting[];
  loading?: boolean;
  onClickLabelEditCallback: (setting: Setting) => void;
}

type IProps = IFormProps & ITfn;

export const buildTypeDom = (setting: Pick<Setting, 'type' | 'name' | 'options'>) => {
  let dom = <span>----</span>;

  const { type, name, options } = setting;

  if (type === 'input') {
    dom = <Input placeholder={name} />;
  }

  if (['radio'].includes(type)) {
    dom = (
      <Select>
        {options && options.split(/[\n]/).map((option: string) => <Select.Option key={option}>{option}</Select.Option>)}
      </Select>
    );
    // dom = <Input.TextArea placeholder={name} rows={3} />;
  }

  if (['checkbox', 'textarea'].includes(type)) {
    dom = <Input.TextArea placeholder={name} rows={3} />;
  }

  return dom;
};

class SettingInfoFormInner extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
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
                <Rcon type="question-circle" /> {setting.description}
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
              <Rcon type="edit" className={style['label-icon']} />
              <strong className={cx(style['label-text'])}>
                {setting.private ? <Rcon type="ri-lock-2-line" className={style['private-icon']} /> : null}
                {setting.name}
              </strong>
            </Button>
          </Tooltip>
        </span>
      );
    };

    return (
      <div className={cx(style['wrapper'], props.className)}>
        <FormCard>
          <Form
            className={cx('g-form--zero-margin-bottom', style['form-wrapper'])}
            hideRequiredMark
            {...formItemLayout}
          >
            {props.settings &&
              props.settings.map((setting, i) => (
                <div key={setting.id}>
                  {getFieldDecorator(`settings[${i}].id`, {
                    initialValue: setting.id || null,
                    rules: [{ required: true }],
                  })(<Input type="number" placeholder="ID" hidden />)}

                  <Form.Item key={setting.id} label={buildLabelDom(setting)}>
                    {getFieldDecorator(`settings[${i}].value`, {
                      initialValue: setting.value || null,
                      rules: [{ required: true }],
                    })(buildTypeDom(setting))}
                  </Form.Item>
                </div>
              ))}
          </Form>
        </FormCard>
      </div>
    );
  }
}

// @ts-ignore
export const SettingListForm = withTranslation()(Form.create<IFormProps>()(SettingInfoFormInner));
