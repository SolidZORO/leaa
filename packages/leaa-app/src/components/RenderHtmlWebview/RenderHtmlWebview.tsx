import React, { useRef } from 'react';
import { SafeAreaView, WebView, NavState } from 'react-native';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import { openBrowserAsync } from 'expo-web-browser';

import { htmlContent } from '@leaa/app/src/components/RenderHtmlWebview/htmlContent';
import { htmlScript } from '@leaa/app/src/components/RenderHtmlWebview/htmlScript';

import style from './style.less';

interface IProps {
  content: string;
  title?: string;
  navigation: NavigationScreenProp<NavigationRoute>;
}

export const RenderHtmlWebview = (props: IProps) => {
  // let webViewRef: WebView | null = null;
  const webViewRef = useRef<WebView>(null);

  const onMessage = (e: any) => {
    console.log(e);
    // setHeight(parseInt(e.nativeEvent.data, 10));
  };

  const onNavigationStateChange = (navState: NavState) => {
    if (navState.navigationType === 'click') {
      if (webViewRef.current) {
        webViewRef.current.stopLoading();
      }

      if (navState.url) {
        openBrowserAsync(navState.url, { enableBarCollapsing: true }).then();
      }
      // Linking.openURL(navState.url);
    }
  };

  return (
    <SafeAreaView style={style['wrapper']}>
      <WebView
        ref={webViewRef}
        onMessage={onMessage}
        injectedJavaScript={htmlScript}
        scrollEnabled
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        decelerationRate="normal"
        automaticallyAdjustContentInsets={false}
        onNavigationStateChange={onNavigationStateChange}
        source={{
          html: htmlContent({
            title: `${props.title}`,
            content: `${props.content}`,
          }),
          baseUrl: '',
        }}
      />
    </SafeAreaView>
  );
};
