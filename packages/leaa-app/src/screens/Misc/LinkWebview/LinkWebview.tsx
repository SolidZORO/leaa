import React, { useState } from 'react';
import { SafeAreaView, WebView, RefreshControl, ScrollView } from 'react-native';

import { IScreenProps } from '@leaa/app/src/interfaces';

import style from './style.less';

interface IProps extends IScreenProps {}

export const LinkWebview = (props: IProps) => {
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

// LinkWebview.navigationOptions = (props: IScreenProps) => {
//   const title = props.navigation.state.params && props.navigation.state.params.title;
//   const gobackKey = props.navigation.state.params && props.navigation.state.params.gobackKey;
//
//   console.log('gobackKey', gobackKey);
//
//   return {
//     // header: null,
//     headerTransparent: true,
//     headerStyle: { borderBottomWidth: 0 },
//     title,
//     headerLeft: (
//       <Text
//         onPress={() => props.navigation.goBack(gobackKey)}
//         style={{ marginLeft: 10, width: 30, textAlign: 'center' }}
//       >
//         <IconFont name="return" size={24} />
//       </Text>
//     ),
//   };
// };
