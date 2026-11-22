import React, { ReactNode } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';

interface SafeScreenProps {
  children: ReactNode;
  edges?: Edge[];
  style?: ViewStyle;
}

export function SafeScreen({
  children,
  edges = ['top', 'left', 'right', 'bottom'],
  style,
}: SafeScreenProps) {
  const theme = useTheme();

  return (
    <SafeAreaView
      edges={edges}
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
