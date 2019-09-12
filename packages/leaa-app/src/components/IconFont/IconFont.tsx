import { createIconSet } from 'react-native-vector-icons';
import glyphMap from '@leaa/app/src/assets/fonts/fi/iconfont.json';

const iconSet = createIconSet(glyphMap, 'iconfont', require('@leaa/app/src/assets/fonts/fi/iconfont.ttf'));

export default iconSet;

export const { Button, TabBarItem, TabBarItemIOS, ToolbarAndroid, getImageSource } = iconSet;

// usage:
//                  |---- `name` see iconfont.json
//                  v
// <IconFont name="x-account" size={18} /> hello-leaa-app
