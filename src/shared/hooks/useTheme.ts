import { useColorScheme } from 'react-native';
import { getAppTheme, AppTheme } from '../theme';

export function useTheme(): AppTheme {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  return getAppTheme(isDark);
}
