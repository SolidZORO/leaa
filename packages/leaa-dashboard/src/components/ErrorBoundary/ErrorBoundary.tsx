import React from 'react';
import qs from 'qs';
import { Button } from 'antd';
import { RiArrowLeftLine, RiCloseLine } from 'react-icons/ri';
// import { mergeUrlParamToUrlQuery } from '@leaa/dashboard/src/utils/url.util';
import { getUrlPath } from '@leaa/dashboard/src/utils/url.util';

import style from './style.module.less';

interface IProps {}

interface IState {
  hasError: boolean;
  errorInfo: any;
}

const CATCH_HAS_REFRESH_URL_PARAM = '____CATCH';

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

  componentDidCatch(err: Error, info: any) {
    // TIPS: Many times DidCatch is because the JS file can't be retrieved, so refresh it first.
    // const qsQuery = qs.parse(window.location.search, { ignoreQueryPrefix: true });

    const urlPath = getUrlPath(window);
    const urlQuery = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    const nextQueryStr = qs.stringify({ ...urlQuery, [CATCH_HAS_REFRESH_URL_PARAM]: 1 }, { addQueryPrefix: true });
    const nextUrl = `${urlPath}${nextQueryStr}`;

    console.log('💥 NEXT-URL', nextUrl);

    if (!urlQuery[CATCH_HAS_REFRESH_URL_PARAM]) {
      console.log('💥 RELOAD');
      window.history.pushState(null, '', nextUrl);
    }

    // console.log('---- ALL-STACK ----', info, err);

    this.setState({ errorInfo: err.message });
  }

  onGoToHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={style['error-boundary-wrapper']}>
          <div className={style['error-boundary-container']}>
            <div className={style['title']}>
              <Button
                type="primary"
                shape="circle"
                icon={<RiArrowLeftLine />}
                onClick={this.onGoToHome}
                className={style['goto-home-button']}
              />
              <strong>Server Error</strong>
            </div>

            <div className={style['error-info']}>
              <code>{JSON.stringify(this.state.errorInfo)}</code>
              <Button
                shape="circle"
                icon={<RiCloseLine />}
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
