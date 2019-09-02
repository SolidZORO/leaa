import React, { useEffect } from 'react';
import { ApolloError } from 'apollo-client';
import Toast from 'react-native-tiny-toast';

interface IProps {
  error: ApolloError;
  message?: React.ReactNode | string;
}

export const ErrorCard = (props: IProps) => {
  let message: string | null = null;

  if (props.error) {
    ({ message } = props.error);
  }

  if (props.message) {
    message = typeof props.message === 'string' ? props.message : JSON.stringify(props.message);
  }

  useEffect(() => {
    if (message) {
      Toast.show(message);
    }
  }, [message]);

  return null;
};
