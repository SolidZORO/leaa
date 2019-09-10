import React, { useRef, useState } from 'react';
import { SafeAreaView, Modal, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import { openBrowserAsync } from 'expo-web-browser';
import ImageViewer from 'react-native-image-zoom-viewer';
import { IImageInfo } from 'react-native-image-zoom-viewer/src/image-viewer.type';

import { htmlContent } from '@leaa/app/src/components/RenderHtml/htmlContent';
import { htmlScript } from '@leaa/app/src/components/RenderHtml/htmlScript';

import style from './style.less';

interface IProps {
  content: string;
  title?: string;
  navigation: NavigationScreenProp<NavigationRoute>;
}

export const RenderHtml = (props: IProps) => {
  const webViewRef = useRef<WebView>(null);

  const [imageUrls, setImageUrls] = useState<IImageInfo[]>([]);
  const [imageIndex, setImageIndex] = useState<number>(-1);

  const onMessage = (event: any) => {
    try {
      const jsonData = JSON.parse(event.nativeEvent.data);
      const { type, url } = jsonData;
      const imagesData = jsonData.images;

      setImageUrls(jsonData.images.map((i: string) => ({ url: i })));

      if (type === 'images') {
        if (imagesData && imagesData.length > 0) {
          setImageIndex(imagesData.indexOf(url));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onNavigationStateChange = (newNavState: WebViewNavigation) => {
    const { url } = newNavState;
    const isImage = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|bmp)\??$)/i.test(url);

    if (!url || !webViewRef || !webViewRef.current) {
      return;
    }

    if (isImage) {
      webViewRef.current.stopLoading();

      return;
    }

    if (newNavState.navigationType === 'click') {
      webViewRef.current.stopLoading();
      openBrowserAsync(newNavState.url, { enableBarCollapsing: true }).then();

      // Linking.openURL(navState.url);
    }
  };

  const clearImageUrls = () => {
    setImageUrls([]);
    setImageIndex(-1);
  };

  return (
    <SafeAreaView style={style['wrapper']}>
      <Modal visible={imageIndex !== -1} transparent>
        <ImageViewer
          imageUrls={imageUrls}
          index={imageIndex}
          loadingRender={() => <ActivityIndicator />}
          enableSwipeDown
          onSwipeDown={clearImageUrls}
          onClick={clearImageUrls}
        />
      </Modal>

      <WebView
        ref={webViewRef}
        onMessage={onMessage}
        javaScriptEnabled
        injectedJavaScript={htmlScript}
        scrollEnabled
        originWhitelist={['*']}
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
