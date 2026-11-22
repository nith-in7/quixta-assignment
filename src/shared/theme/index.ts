import { lightColors, darkColors, ThemeColors } from './colors';
import { typography, Typography } from './typography';
import { spacing, Spacing } from './spacing';
import { borderRadius, BorderRadius } from './borderRadius';

export interface AppTheme {
  isDark: boolean;
  colors: ThemeColors;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
}

export function getAppTheme(isDark: boolean): AppTheme {
  return {
    isDark,
    colors: isDark ? darkColors : lightColors,
    typography,
    spacing,
    borderRadius,
  };
}

export const defaultTheme = getAppTheme(false);

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './borderRadius';
