import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';

interface IProps {
  loader: any;
  matchProps: any;
}

interface IState {}

export class RouterLazyLoader extends React.PureComponent<IProps, IState> {
  static propTypes = {
    loader: PropTypes.any.isRequired,
  };

  static defaultProps = {};

  render() {
    const C = React.lazy(this.props.loader);
    const loadingSpin = (
      <Spin
        size="small"
        style={{
          zIndex: 999999,
          position: 'absolute',
          top: 2,
          right: 3,
        }}
      />
    );

    return (
      <React.Suspense fallback={loadingSpin}>
        <C {...this.props.matchProps} />
      </React.Suspense>
    );
  }
}
