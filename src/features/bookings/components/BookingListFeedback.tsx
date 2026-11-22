import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';

interface EmptyStateProps {
  message: 'No bookings' | 'No bookings match';
}

export function EmptyState({ message }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.centerContainer,
        {
          paddingVertical: theme.spacing.huge,
          paddingHorizontal: theme.spacing.xxl,
        },
      ]}
    >
      <Text
        style={[
          styles.emptyText,
          {
            color: theme.colors.text.secondary,
            fontSize: theme.typography.fontSize.md,
          },
        ]}
      >
        {message}
      </Text>
    </View>
  );
}

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.centerContainer,
        {
          paddingVertical: theme.spacing.huge,
          paddingHorizontal: theme.spacing.xxl,
        },
      ]}
    >
      <Text
        style={[
          styles.errorText,
          {
            color: theme.colors.status.error,
            fontSize: theme.typography.fontSize.md,
            marginBottom: theme.spacing.lg,
          },
        ]}
      >
        Could not load bookings
      </Text>
      <Pressable
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Try again"
        style={({ pressed }) => [
          styles.retryButton,
          {
            backgroundColor: theme.colors.brand.primary,
            borderRadius: theme.borderRadius.md,
            paddingHorizontal: theme.spacing.xl,
            paddingVertical: theme.spacing.md,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Text
          style={[
            styles.retryButtonText,
            {
              color: theme.colors.brand.primaryText,
              fontSize: theme.typography.fontSize.sm,
            },
          ]}
        >
          Try again
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontWeight: '500',
    textAlign: 'center',
  },
  errorText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  retryButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButtonText: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
