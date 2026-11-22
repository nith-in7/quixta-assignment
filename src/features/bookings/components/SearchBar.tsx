import React from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import { useUIStore } from '../../../shared/stores/useUIStore';
import { useTheme } from '../../../shared/hooks/useTheme';

export function SearchBar() {
  const { searchQuery, setSearchQuery, clearSearchQuery } = useUIStore();
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border.subtle,
          borderRadius: theme.borderRadius.md,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
        },
      ]}
    >
      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search bookings"
        placeholderTextColor={theme.colors.text.muted}
        style={[
          styles.input,
          {
            color: theme.colors.text.primary,
            fontSize: theme.typography.fontSize.md,
          },
        ]}
        accessibilityLabel="Search bookings"
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {searchQuery.length > 0 && (
        <Pressable
          onPress={clearSearchQuery}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={theme.spacing.sm}
          style={[styles.clearButton, { padding: theme.spacing.xs }]}
        >
          <Text
            style={[
              styles.clearText,
              {
                color: theme.colors.text.muted,
                fontSize: theme.typography.fontSize.sm,
              },
            ]}
          >
            ✕
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  input: {
    flex: 1,
    padding: 0,
  },
  clearButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    fontWeight: '600',
  },
});
