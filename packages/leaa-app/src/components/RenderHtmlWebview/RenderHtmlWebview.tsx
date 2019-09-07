import React, { useRef } from 'react';
import { SafeAreaView, WebView } from 'react-native';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';

import { htmlContent } from '@leaa/app/src/components/RenderHtmlWebview/htmlContent';
import { htmlScript } from '@leaa/app/src/components/RenderHtmlWebview/htmlScript';

import style from './style.less';

interface IProps {
  content: string;
  title?: string;
  navigation: NavigationScreenProp<NavigationRoute>;
}

export const RenderHtmlWebview = (props: IProps) => {
  const webViewRef = useRef<WebView>(null);

  const onMessage = (e: any) => {
    console.log(e);
    // setHeight(parseInt(e.nativeEvent.data, 10));
  };

  const onNavigationStateChange = (e: any) => {
    if (e.navigationType === 'click') {
      if (webViewRef.current) {
        webViewRef.current.stopLoading();
      }

      console.log(e.url);
      props.navigation.navigate('LinkWebview', { uri: e.url });
      // Linking.openURL(e.url).catch(err => console.error('An error occurred', err));
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
