import React, { useEffect, useState } from 'react';
import { Text, View, TextInput } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import useForm from 'react-hook-form';
import { Button } from '@ant-design/react-native';

import { LOGIN_FOR_WWW } from '@leaa/common/src/graphqls';
import { ILogin, IAuthBaseInfo } from '@leaa/app/src/interfaces';
import { User } from '@leaa/app/src/entrys';
import { authUtil } from '@leaa/app/src/utils';

import { IconFont } from '@leaa/app/src/components/IconFont';
import { ErrorCard } from '@leaa/app/src/components/ErrorCard';

import style from './style.less';

interface IProps {
  onSubmitCallback: (data: IAuthBaseInfo) => void;
}

export const LoginForm = (props: IProps) => {
  const { register, setValue, watch, errors, triggerValidation, handleSubmit } = useForm();

  const [inputHash, setInputHash] = useState<number>(0);
  const [actionSubmitButton, setActionSubmitButton] = useState<boolean>(false);

  const [submitLoginMutate, submitLoginMutation] = useMutation<{ login: User }>(LOGIN_FOR_WWW, {
    async onCompleted({ login }) {
      if (login && login.name) {
        const authInfo: IAuthBaseInfo = {
          email: login.email,
          name: login.name,
        };

        await authUtil.setAuthInfo(authInfo);
        props.onSubmitCallback(authInfo);
      }

      if (login && login.authToken && login.authExpiresIn) {
        await authUtil.setAuthToken(login.authToken, login.authExpiresIn);
        await authUtil.setAuthToken(login.authToken, login.authExpiresIn);
      }
    },
  });

  useEffect(() => {
    if (watch('email') && watch('password')) {
      triggerValidation().then();
      setActionSubmitButton(true);
    } else {
      setActionSubmitButton(false);
    }
  }, [inputHash]);

  const onSubmit = async (data: any) => {
    // if (!actionSubmitButton) {
    //   return;
    // }

    const result = await triggerValidation();

    if (result) {
      const variables: { user: ILogin } = {
        // user: data,
        // DEBUG
        user: {
          email: 'admin@leaa.com',
          password: 'h8Hx9qvPKoHMLQgj',
        },
      };

      await submitLoginMutate({ variables });
    }
  };

  return (
    <View style={style['form-wrapper']}>
      {submitLoginMutation.error ? <ErrorCard error={submitLoginMutation.error} message="登录信息有误" /> : null}

      <IconFont name="leaa-logo" size={64} style={style['form-logo']} />

      <View style={style['form-item']}>
        <TextInput
          placeholder="输入邮箱"
          defaultValue="admin@leaa.com"
          // ref={() => register({ name: 'email' }, { required: true, min: 1, pattern: /.*@.*/ })}
          ref={() => register({ name: 'email' })}
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
          // ref={() => register({ name: 'password' }, { required: true, min: 1 })}
          ref={() => register({ name: 'password' })}
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
        // disabled={!actionSubmitButton}
        onPress={handleSubmit(onSubmit) as any}
        style={[style['form-submit-button'], actionSubmitButton && style['form-submit-button--action']]}
      >
        <Text style={[style['form-submit-button-text'], style['form-submit-button-text--action']]}>登录</Text>
      </Button>
    </View>
  );
};
