import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Booking } from '../../bookings/types/booking';
import { useTheme } from '../../../shared/hooks/useTheme';
import { formatLocalTime, formatLocalDate } from '../../../shared/utils/date';

interface BookingMetaCardProps {
  booking: Booking;
}

export function BookingMetaCard({ booking }: BookingMetaCardProps) {
  const theme = useTheme();

  const localTime = formatLocalTime(booking.startsAt, booking.timezone);
  const localDate = formatLocalDate(booking.startsAt, booking.timezone);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border.subtle,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.xl,
          marginBottom: theme.spacing.sm,
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.text.primary,
            fontSize: theme.typography.fontSize.xxl,
            marginBottom: theme.spacing.lg,
          },
        ]}
      >
        {booking.title}
      </Text>

      <View
        style={[
          styles.divider,
          {
            backgroundColor: theme.colors.border.subtle,
            marginBottom: theme.spacing.lg,
          },
        ]}
      />

      <View style={[styles.metaGrid, { gap: theme.spacing.lg }]}>
        <View style={[styles.metaItem, { gap: theme.spacing.xs }]}>
          <Text
            style={[
              styles.metaLabel,
              {
                color: theme.colors.text.muted,
                fontSize: theme.typography.fontSize.xs,
              },
            ]}
          >
            CALENDAR DATE
          </Text>
          <Text
            style={[
              styles.metaValue,
              {
                color: theme.colors.text.primary,
                fontSize: theme.typography.fontSize.md,
              },
            ]}
          >
            {localDate}
          </Text>
        </View>

        <View style={[styles.metaItem, { gap: theme.spacing.xs }]}>
          <Text
            style={[
              styles.metaLabel,
              {
                color: theme.colors.text.muted,
                fontSize: theme.typography.fontSize.xs,
              },
            ]}
          >
            LOCAL TIME
          </Text>
          <Text
            style={[
              styles.metaValue,
              {
                color: theme.colors.brand.accent,
                fontSize: theme.typography.fontSize.md,
              },
            ]}
          >
            {localTime}
          </Text>
        </View>

        <View style={[styles.metaItem, { gap: theme.spacing.xs }]}>
          <Text
            style={[
              styles.metaLabel,
              {
                color: theme.colors.text.muted,
                fontSize: theme.typography.fontSize.xs,
              },
            ]}
          >
            TIMEZONE ID
          </Text>
          <View
            style={[
              styles.tzBadge,
              {
                backgroundColor: theme.colors.surfaceSubtle,
                borderColor: theme.colors.border.subtle,
                borderRadius: theme.borderRadius.xs,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.xs,
                marginTop: theme.spacing.xxs,
              },
            ]}
          >
            <Text
              style={[
                styles.tzText,
                {
                  color: theme.colors.text.primary,
                  fontSize: theme.typography.fontSize.sm,
                },
              ]}
            >
              {booking.timezone}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  title: {
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  divider: {
    height: 1,
    opacity: 0.6,
  },
  metaGrid: {},
  metaItem: {},
  metaLabel: {
    fontWeight: '600',
    letterSpacing: 1.0,
  },
  metaValue: {
    fontWeight: '600',
  },
  tzBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  tzText: {
    fontWeight: '500',
  },
});
