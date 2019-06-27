import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import { urlUtil } from '@leaa/dashboard/utils';

const CATCH_HAS_REFRESH_URL_PARAM = '____catch-has-refresh';

interface IProps {
  children: any;
}

interface IState {
  error: boolean;
}

export class ErrorBoundary extends React.Component<IProps, IState> {
  static propTypes = {
    children: PropTypes.object.isRequired,
  };

  constructor(props: IProps) {
    super(props);

    this.state = {
      error: false,
    };
  }

  async componentDidCatch(error: any, info: any) {
    // autoReFresh
    const qs = queryString.parse(window.location.search);

    if (!qs[CATCH_HAS_REFRESH_URL_PARAM]) {
      console.log('CATCH_HAS_REFRESH_URL_PARAM', CATCH_HAS_REFRESH_URL_PARAM);

      const url = await urlUtil.mergeParamToUrlQuery({
        window,
        paramList: { [CATCH_HAS_REFRESH_URL_PARAM]: 1 },
        replaceUrl: false,
      });

      window.location.href = await url;
    } else {
      console.log('DID CATCH ERROR');
    }
  }

  render() {
    if (this.state.error) {
      return <code>SERVER ERROR</code>;
    }

    return this.props.children;
  }
}
