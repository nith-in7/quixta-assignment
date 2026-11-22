import React, { useState, useEffect } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { canCheckIn } from '../lib/check-in';
import { useTheme } from '../../../shared/hooks/useTheme';

interface CheckInButtonProps {
  startsAt: string;
}

export function CheckInButton({ startsAt }: CheckInButtonProps) {
  const theme = useTheme();

  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isEligible, setIsEligible] = useState(() =>
    canCheckIn(new Date(), new Date(startsAt))
  );

  useEffect(() => {
    const check = () => {
      setIsEligible(canCheckIn(new Date(), new Date(startsAt)));
    };

    check();
    const interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, [startsAt]);

  const handlePress = () => {
    if (isEligible) {
      setIsCheckedIn(true);
    }
  };

  const isDisabled = !isEligible || isCheckedIn;

  return (
    <View style={[styles.container, { marginVertical: theme.spacing.md }]}>
      <Pressable
        onPress={handlePress}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel="Check in"
        accessibilityState={{ disabled: isDisabled }}
        style={({ pressed }) => [
          styles.button,
          {
            minHeight: theme.spacing.huge,
            borderRadius: theme.borderRadius.md,
            backgroundColor: isCheckedIn
              ? theme.colors.status.successSurface
              : isEligible
              ? theme.colors.brand.primary
              : theme.colors.disabled.surface,
            borderColor: isCheckedIn
              ? theme.colors.status.success
              : isEligible
              ? theme.colors.brand.primary
              : theme.colors.disabled.border,
            opacity: pressed && !isDisabled ? 0.85 : 1,
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.lg,
          },
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            {
              color: isCheckedIn
                ? theme.colors.status.success
                : isEligible
                ? theme.colors.brand.primaryText
                : theme.colors.disabled.text,
              fontSize: theme.typography.fontSize.md,
            },
          ]}
        >
          {isCheckedIn ? '✓ Checked in' : 'Check in'}
        </Text>
      </Pressable>
      {!isEligible && (
        <Text
          style={[
            styles.helperText,
            {
              color: theme.colors.text.muted,
              fontSize: theme.typography.fontSize.xs,
              marginTop: theme.spacing.xs,
            },
          ]}
        >
          Check-in opens 15 minutes before start
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  button: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  helperText: {
    textAlign: 'center',
    fontWeight: '400',
  },
});
