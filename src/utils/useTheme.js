import { useSelector } from 'react-redux';
import { LIGHT, DARK } from '../theme/tokens';

export const useThemeMode = () => useSelector((state) => state.app.theme || 'light');

export const useTheme = () => {
  const mode = useThemeMode();
  return mode === 'dark' ? DARK : LIGHT;
};

export const useIsDark = () => useThemeMode() === 'dark';
