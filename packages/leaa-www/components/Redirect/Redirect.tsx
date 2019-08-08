import React from 'react';
import Router from 'next/router';

interface IProps {
  to?: string;
}

export const Redirect = (props: IProps) =>
  typeof window !== 'undefined' && props.to ? Router.push(props.to).then(() => null) : null;
