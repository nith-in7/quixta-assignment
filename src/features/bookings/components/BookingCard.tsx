import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Booking } from '../types/booking';
import { AppNavigationProp } from '../../../navigation/types';
import { useTheme } from '../../../shared/hooks/useTheme';
import { formatLocalTime, formatLocalDate } from '../../../shared/utils/date';

interface BookingCardProps {
  booking: Booking;
}

export function BookingCard({ booking }: BookingCardProps) {
  const navigation = useNavigation<AppNavigationProp>();
  const theme = useTheme();

  const localTime = formatLocalTime(booking.startsAt, booking.timezone);
  const localDate = formatLocalDate(booking.startsAt, booking.timezone);

  const handlePress = () => {
    navigation.navigate('BookingDetail', { id: booking.id });
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${booking.title}`}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border.subtle,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.lg,
          marginVertical: theme.spacing.sm,
          transform: [{ scale: pressed ? 0.99 : 1 }],
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={[styles.content, { gap: theme.spacing.sm }]}>
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.text.primary,
                fontSize: theme.typography.fontSize.lg,
              },
            ]}
          >
            {booking.title}
          </Text>
          <Text
            style={[
              styles.chevron,
              {
                color: theme.colors.text.muted,
                fontSize: theme.typography.fontSize.xl,
                marginLeft: theme.spacing.sm,
              },
            ]}
          >
            ›
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Text
            style={[
              styles.dateText,
              {
                color: theme.colors.text.secondary,
                fontSize: theme.typography.fontSize.sm,
              },
            ]}
          >
            {localDate} · {localTime}
          </Text>
        </View>

        <View style={[styles.badgeRow, { marginTop: theme.spacing.xxs }]}>
          <View
            style={[
              styles.timezoneBadge,
              {
                backgroundColor: theme.colors.surfaceSubtle,
                borderColor: theme.colors.border.subtle,
                borderRadius: theme.borderRadius.xs,
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: theme.spacing.xs,
              },
            ]}
          >
            <Text
              style={[
                styles.timezoneText,
                {
                  color: theme.colors.text.muted,
                  fontSize: theme.typography.fontSize.xs,
                },
              ]}
            >
              {booking.timezone}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  content: {},
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '600',
    flex: 1,
  },
  chevron: {
    fontWeight: '400',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontWeight: '400',
  },
  badgeRow: {
    flexDirection: 'row',
  },
  timezoneBadge: {
    borderWidth: 1,
  },
  timezoneText: {
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});
