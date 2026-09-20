import { Dimensions, PixelRatio, Platform } from 'react-native';

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

export const screenWidth = () => Dimensions.get('window').width;
export const screenHeight = () => Dimensions.get('window').height;

export const wp = (percent) => (screenWidth() * percent) / 100;
export const hp = (percent) => (screenHeight() * percent) / 100;

export const scale = (size) => {
  const ratio = screenWidth() / BASE_WIDTH;
  const clamped = Math.max(0.65, Math.min(1.3, ratio));
  return Math.round(size * clamped);
};

export const vScale = (size) => {
  const ratio = screenHeight() / BASE_HEIGHT;
  const clamped = Math.max(0.65, Math.min(1.3, ratio));
  return Math.round(size * clamped);
};

export const fontSize = (size) => scale(size);

export const isSmallScreen = () => screenWidth() < 360;
export const isMediumScreen = () => screenWidth() >= 360 && screenWidth() < 400;
export const isLargeScreen = () => screenWidth() >= 400;
export const isTablet = () => screenWidth() >= 600;
export const isLandscape = () => screenWidth() > screenHeight();

export const getResponsivePadding = () => {
  if (isSmallScreen()) return 8;
  if (isMediumScreen()) return 12;
  if (isLargeScreen()) return 16;
  return 18;
};

export const getResponsiveSpacing = () => {
  if (isSmallScreen()) return 4;
  if (isMediumScreen()) return 8;
  if (isLargeScreen()) return 12;
  return 14;
};

export const getResponsiveVerticalSpacing = () => {
  const height = screenHeight();
  if (height < 650) return 6;
  if (height < 700) return 8;
  if (height < 800) return 10;
  return 12;
};

export const getSafeAreaPadding = () => {
  if (Platform.OS === 'android') {
    return { top: 0, bottom: 0 };
  }
  return { top: 44, bottom: 34 };
};

export const columnsFor = (minTile, gap = 10, padding = 32) => {
  const usable = screenWidth() - padding;
  return Math.max(2, Math.floor((usable + gap) / (minTile + gap)));
};

export const tileSize = (columns, gap = 10, padding = 32) => {
  const usable = screenWidth() - padding;
  return Math.floor((usable - gap * (columns - 1)) / columns);
};

export const normalize = (size) => {
  const newSize = scale(size);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};
