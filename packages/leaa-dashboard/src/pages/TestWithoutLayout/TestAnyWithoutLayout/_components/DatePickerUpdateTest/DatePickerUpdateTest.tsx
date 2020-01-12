import moment from 'moment';
import React, { useEffect } from 'react';
import { Form, DatePicker, Button } from 'antd';

export const DatePickerUpdateTest = () => {
  const initTime = '2077-07-07 07:07:07';

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ time: moment(initTime) });
  }, [form]);

  return (
    <div style={{ padding: 20 }}>
      <Form form={form} name="date-picker-update" layout="vertical">
        <Form.Item name="time" rules={[]} label="TIME">
          <DatePicker showTime />
        </Form.Item>
      </Form>

      <Button type="primary" onClick={() => form.setFields([{ name: 'time', value: moment() }])}>
        Success Update
      </Button>

      <Button
        danger
        style={{ marginLeft: 10 }}
        // TODO console get some error
        // Uncaught TypeError: val.isValid is not a function
        // The above error occurred in the <PickerWrapper> component:
        onClick={() => form.setFieldsValue({ time: moment() })}
      >
        Fail Update
      </Button>
    </div>
  );
};
