import React, { useState } from 'react';
import { SafeAreaView, WebView, RefreshControl, ScrollView } from 'react-native';
import { IScreenProps } from '@leaa/app/src/interfaces';

import style from './style.less';

interface IProps extends IScreenProps {}

export const LinkWebview = (props: IProps) => {
  const uri = props.navigation.state.params && props.navigation.state.params.uri;
  let webViewRef: WebView | null;
  const [loading, setLoading] = useState<boolean>(false);

  const pullRerefresh = () => {
    setLoading(true);
    // @ts-ignore
    webViewRef.reload();
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

LinkWebview.navigationOptions = {
  title: 'LinkWebview',
};
