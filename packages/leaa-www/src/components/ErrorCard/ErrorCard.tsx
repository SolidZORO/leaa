import React, { useEffect } from 'react';
import { notification } from 'antd';
import { ApolloError } from 'apollo-client';

import style from './style.less';

interface IProps {
  error: ApolloError;
  message?: React.ReactNode | string;
  consoleMessage?: React.ReactNode | string;
}

export const ErrorCard = (props: IProps) => {
  let message: string | null = null;

  console.log(JSON.stringify(props.error.graphQLErrors));

  if (props.error.graphQLErrors && props.error.graphQLErrors[0] && props.error.graphQLErrors[0].message) {
    message = JSON.stringify(props.error.graphQLErrors[0].message);
  } else if (props.error.graphQLErrors && props.error.graphQLErrors[0]) {
    message = JSON.stringify(props.error.graphQLErrors[0]);
  } else if (props.error) {
    ({ message } = props.error);
  } else if (props.message) {
    message = typeof props.message === 'string' ? props.message : JSON.stringify(props.message);
  }

  useEffect(() => {
    if (message) {
      notification.error({ message, className: style['container'] });
    }
  }, [message]);

  return null;
};
