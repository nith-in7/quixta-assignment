import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { QueryProvider } from './src/shared/providers/QueryProvider';
import { AppNavigator } from './src/navigation/AppNavigator';
import { linking } from './src/navigation/linking';
import { useTheme } from './src/shared/hooks/useTheme';

export default function App() {
  const theme = useTheme();
  const baseTheme = theme.isDark ? DarkTheme : DefaultTheme;

  const navigationTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: theme.colors.brand.accent,
      background: theme.colors.background,
      card: theme.colors.background,
      text: theme.colors.text.primary,
      border: theme.colors.border.subtle,
    },
  };

  return (
    <SafeAreaProvider>
      <QueryProvider>
        <NavigationContainer linking={linking} theme={navigationTheme}>
          <StatusBar style={theme.isDark ? 'light' : 'dark'} />
          <AppNavigator />
        </NavigationContainer>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
