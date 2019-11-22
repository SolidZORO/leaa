import React from 'react';
import { Button } from 'antd';

import style from './style.module.less';

interface IProps {}

interface IState {
  hasError: boolean;
  errorInfo: {};
}

export class ErrorBoundary extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      hasError: false,
      errorInfo: {},
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: {}) {
    this.setState({ errorInfo: info });
  }

  onGoToHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={style['wrapper']}>
          <div className={style['container']}>
            <div className={style['title']}>
              <Button type="primary" shape="circle" icon="disconnect" onClick={this.onGoToHome} />
              <strong>Server Error</strong>
            </div>

            <div className={style['error-info']}>
              <code>{JSON.stringify(this.state.errorInfo)}</code>
              <Button
                shape="circle"
                icon="close"
                size="small"
                onClick={this.onGoToHome}
                className={style['close-error-info']}
              />
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
