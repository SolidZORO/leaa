import { createIconSet } from 'react-native-vector-icons';
import glyphMap from '@leaa/app/src/assets/fonts/fi/iconfont.json';

const iconSet = createIconSet(glyphMap, 'iconfont', require('@leaa/app/src/assets/fonts/fi/iconfont.ttf'));

export default iconSet;

export const { Button } = iconSet;
export const { TabBarItem } = iconSet;
export const { TabBarItemIOS } = iconSet;
export const { ToolbarAndroid } = iconSet;
export const { getImageSource } = iconSet;

// usage:
//                  |---- `name` see iconfont.json
//                  v
// <IconFont name="x-account" size={18} /> hello-leaa-app
