import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { formatUpdatedTimestamp } from '../../../shared/utils/date';

interface UpdatedTimestampProps {
  updatedAt: number | null;
}

export function UpdatedTimestamp({ updatedAt }: UpdatedTimestampProps) {
  const theme = useTheme();

  if (!updatedAt) {
    return null;
  }

  const formattedTime = formatUpdatedTimestamp(updatedAt);

  return (
    <View
      style={[
        styles.container,
        {
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.xxs,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: theme.colors.text.muted,
            fontSize: theme.typography.fontSize.xs,
          },
        ]}
      >
        Updated {formattedTime}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  text: {
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});
