import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import useForm from 'react-hook-form';

import { IconFont } from '@leaa/app/src/components/IconFont';
import { IScreenProps, INavigationStackOptions } from '@leaa/app/src/interfaces';

import style from './style.less';

interface IProps extends IScreenProps {}

export const LoginScreen = (props: IProps) => {
  const { register, setValue, watch, errors, triggerValidation, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    const result = await triggerValidation();
    console.log(result, data);
  };

  const [inputHash, setInputHash] = useState<number>(0);
  const [actionSubmitButton, setActionSubmitButton] = useState<boolean>(false);

  useEffect(() => {
    if (watch('email') && watch('password')) {
      setActionSubmitButton(true);
    } else {
      setActionSubmitButton(false);
    }
  }, [inputHash]);

  return (
    <SafeAreaView style={style['wrapper']}>
      <View style={style['header-title']}>
        <View style={style['form-wrapper']}>
          <IconFont name="leaa-logo" size={64} style={style['form-logo']} />

          <TextInput
            ref={() => register({ name: 'email', required: true })}
            clearButtonMode="while-editing"
            placeholder="输入邮箱"
            style={style['form-input']}
            autoCompleteType="email"
            onChangeText={text => setValue('email', text)}
            onChange={() => setInputHash(inputHash + 1)}
          />
          {errors.email && <Text>请输入正确的邮箱</Text>}

          <TextInput
            ref={() => register({ name: 'password', required: true })}
            clearButtonMode="while-editing"
            placeholder="输入密码"
            style={style['form-input']}
            autoCompleteType="password"
            secureTextEntry
            onChangeText={text => setValue('password', text)}
            onChange={() => setInputHash(inputHash + 1)}
          />
          {errors.password && <Text>邮箱或密码有误</Text>}

          <TouchableOpacity
            style={[style['form-submit-button'], actionSubmitButton && style['form-submit-button--action']]}
            onPress={handleSubmit(onSubmit) as any}
          >
            <Text style={[style['form-submit-button-text'], style['form-submit-button-text--action']]}>登 录</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

LoginScreen.navigationOptions = (props: IProps): INavigationStackOptions => {
  return {
    // title: 'Login',
    headerTransparent: true,
    headerLeft: () => (
      <Text onPress={() => props.navigation.navigate('App')} style={{ marginLeft: 15, width: 30, textAlign: 'center' }}>
        <IconFont name="close" size={24} />
      </Text>
    ),
    headerRight: (
      <Text onPress={() => props.navigation.navigate('Signup')} style={{ marginRight: 15, textAlign: 'center' }}>
        注册账号
      </Text>
    ),
  };
};
