import { Dimensions } from 'react-native';

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

export const screenWidth = () => Dimensions.get('window').width;
export const screenHeight = () => Dimensions.get('window').height;

export const wp = (percent) => (screenWidth() * percent) / 100;
export const hp = (percent) => (screenHeight() * percent) / 100;

export const scale = (size) => {
  const ratio = screenWidth() / BASE_WIDTH;
  const clamped = Math.max(0.85, Math.min(1.3, ratio));
  return Math.round(size * clamped);
};

export const vScale = (size) => {
  const ratio = screenHeight() / BASE_HEIGHT;
  const clamped = Math.max(0.85, Math.min(1.3, ratio));
  return Math.round(size * clamped);
};

export const fontSize = (size) => scale(size);

export const isSmallScreen = () => screenWidth() < 360;
export const isTablet = () => screenWidth() >= 600;
export const isLandscape = () => screenWidth() > screenHeight();

export const columnsFor = (minTile, gap = 10, padding = 32) => {
  const usable = screenWidth() - padding;
  return Math.max(2, Math.floor((usable + gap) / (minTile + gap)));
};

export const tileSize = (columns, gap = 10, padding = 32) => {
  const usable = screenWidth() - padding;
  return Math.floor((usable - gap * (columns - 1)) / columns);
};
