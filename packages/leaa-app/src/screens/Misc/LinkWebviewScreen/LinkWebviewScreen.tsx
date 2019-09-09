import React, { useState } from 'react';
import { SafeAreaView, RefreshControl, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';

import { IScreenProps } from '@leaa/app/src/interfaces';

import style from './style.less';

interface IProps extends IScreenProps {}

export const LinkWebviewScreen = (props: IProps) => {
  const uri = props.navigation.state.params && props.navigation.state.params.uri;
  const [loading, setLoading] = useState<boolean>(false);

  let webViewRef: WebView | null;

  const pullRerefresh = () => {
    setLoading(true);
    if (webViewRef) {
      webViewRef.reload();
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={style['wrapper']}>
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={pullRerefresh} />}
      >
        <WebView
          ref={r => (webViewRef = r)} // eslint-disable-line no-return-assign
          startInLoadingState
          javaScriptEnabled
          domStorageEnabled
          source={{ uri }}
          // source={{ uri: 'https://bing.com' }}
          // injectedJavaScript={injectJs}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
