import React, { useEffect, useState } from 'react';
import { Text, View, TextInput } from 'react-native';
import useForm from 'react-hook-form';
import { Button } from '@ant-design/react-native';

import { IconFont } from '@leaa/app/src/components/IconFont';
import { ILogin } from '@leaa/app/src/interfaces';

import style from './style.less';

interface IProps {
  onSubmitCallback: (loginData: ILogin) => void;
}

export const LoginForm = (props: IProps) => {
  const { register, setValue, watch, errors, triggerValidation, handleSubmit } = useForm();

  const [inputHash, setInputHash] = useState<number>(0);
  const [actionSubmitButton, setActionSubmitButton] = useState<boolean>(false);

  useEffect(() => {
    if (watch('email') && watch('password')) {
      triggerValidation().then();
      setActionSubmitButton(true);
    } else {
      setActionSubmitButton(false);
    }
  }, [inputHash]);

  const onSubmit = async (data: any) => {
    if (!actionSubmitButton) {
      return;
    }

    const result = await triggerValidation();

    if (result) {
      props.onSubmitCallback(data);
    }
  };

  return (
    <View style={style['form-wrapper']}>
      <IconFont name="leaa-logo" size={64} style={style['form-logo']} />

      <View style={style['form-item']}>
        <TextInput
          placeholder="输入邮箱"
          defaultValue="admin@leaa.com"
          ref={() => register({ name: 'email' }, { required: true, min: 1, pattern: /.*@.*/ })}
          clearButtonMode="while-editing"
          style={style['form-input']}
          autoCompleteType="email"
          onChangeText={text => setValue('email', text)}
          onChange={() => setInputHash(inputHash + 1)}
        />
        <Text style={style['form-input-tips-text']}>{errors.email ? '请输入正确的邮箱' : ' '}</Text>
      </View>

      <View style={style['form-item']}>
        <TextInput
          placeholder="输入密码"
          defaultValue="h8Hx9qvPKoHMLQgj"
          ref={() => register({ name: 'password' }, { required: true, min: 1 })}
          clearButtonMode="while-editing"
          style={style['form-input']}
          autoCompleteType="password"
          secureTextEntry
          onChangeText={text => setValue('password', text)}
          onChange={() => setInputHash(inputHash + 1)}
        />
        <Text style={style['form-input-tips-text']}>{errors.password ? '请输入密码' : ' '} </Text>
      </View>

      <Button
        type="primary"
        disabled={!actionSubmitButton}
        onPress={handleSubmit(onSubmit) as any}
        style={[style['form-submit-button'], actionSubmitButton && style['form-submit-button--action']]}
      >
        <Text style={[style['form-submit-button-text'], style['form-submit-button-text--action']]}>登录</Text>
      </Button>
    </View>
  );
};
