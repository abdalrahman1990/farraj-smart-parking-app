import * as ReactNativeWeb from 'react-native-web';

// Mock ViewPropTypes to prevent crashes in react-native-snap-carousel and others
export const ViewPropTypes = { style: () => null };

export * from 'react-native-web';
export default ReactNativeWeb;
