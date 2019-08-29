/* eslint-disable */
import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';

import WxParse from './_libs/wxParse/wxParse';
import './style.global.less';

interface HtmlParseProps {
  html?: string;
}

export class HtmlParse extends Component<HtmlParseProps, {}> {
  static defaultProps = {
    html: '',
  };

  componentDidMount() {
    WxParse.wxParse('article', 'html', this.props.html, this.$scope, 10);
  }

  render() {
    return (
      <View>
        <import src="./_libs/wxParse/wxParse.wxml" />
        {/* prettier-ignore */}
        <
          // @ts-ignore
          template is="wxParse" data="{{wxParseData:article.nodes}}"
        />
      </View>
    );
  }
}
