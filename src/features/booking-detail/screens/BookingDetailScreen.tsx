import React from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { BookingDetailScreenProps } from '../../../navigation/types';
import { useBookingsQuery } from '../../bookings';
import { BookingMetaCard } from '../components/BookingMetaCard';
import { CheckInButton } from '../../check-in';
import { NoteSection } from '../../notes';
import { SafeScreen, useTheme } from '../../../shared';

export function BookingDetailScreen({ route, navigation }: BookingDetailScreenProps) {
  const { id } = route.params;
  const theme = useTheme();

  const { data: bookings, isLoading } = useBookingsQuery();
  const booking = bookings?.find((b) => b.id === id);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          style={[
            styles.headerTitle,
            {
              color: theme.colors.text.primary,
              fontSize: theme.typography.fontSize.lg,
            },
          ]}
        >
          {booking ? booking.title : 'Booking'}
        </Text>
      ),
      headerTintColor: theme.colors.text.primary,
      headerStyle: {
        backgroundColor: theme.colors.background,
      },
      headerShadowVisible: false,
    });
  }, [navigation, theme, booking]);

  if (isLoading) {
    return (
      <SafeScreen edges={['left', 'right', 'bottom']}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.brand.primary} />
        </View>
      </SafeScreen>
    );
  }

  if (!booking) {
    return (
      <SafeScreen edges={['left', 'right', 'bottom']}>
        <View style={styles.centerContainer}>
          <Text
            style={[
              styles.notFoundText,
              {
                color: theme.colors.text.secondary,
                fontSize: theme.typography.fontSize.md,
              },
            ]}
          >
            Booking not found
          </Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.keyboardContainer}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              {
                padding: theme.spacing.lg,
                paddingBottom: theme.spacing.huge,
              },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <BookingMetaCard booking={booking} />
            <CheckInButton startsAt={booking.startsAt} />
            <NoteSection bookingId={booking.id} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {},
  headerTitle: {
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontWeight: '500',
  },
});
