import React, { useMemo } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import { BookingListScreenProps } from '../../../navigation/types';
import { useBookingsQuery } from '../hooks/useBookingsQuery';
import { SearchBar } from '../components/SearchBar';
import { BookingCard } from '../components/BookingCard';
import { UpdatedTimestamp } from '../components/UpdatedTimestamp';
import { EmptyState, ErrorState } from '../components/BookingListFeedback';
import { SafeScreen, useUIStore, useTheme } from '../../../shared';

export function BookingsListScreen({ navigation }: BookingListScreenProps) {
  const searchQuery = useUIStore((state) => state.searchQuery);
  const theme = useTheme();

  const {
    data: bookings,
    isLoading,
    isRefetching,
    isError,
    refetch,
    dataUpdatedAt,
  } = useBookingsQuery();

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) return bookings;
    return bookings.filter((b) => b.title.toLowerCase().includes(trimmed));
  }, [bookings, searchQuery]);

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
          Bookings
        </Text>
      ),
      headerStyle: {
        backgroundColor: theme.colors.background,
      },
      headerShadowVisible: false,
    });
  }, [navigation, theme]);

  const handleRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <SafeScreen edges={['left', 'right', 'bottom']}>
      <View style={[styles.container, { paddingHorizontal: theme.spacing.lg }]}>
        <View
          style={[
            styles.topSection,
            {
              paddingTop: theme.spacing.sm,
              paddingBottom: theme.spacing.xs,
            },
          ]}
        >
          <SearchBar />
          <UpdatedTimestamp updatedAt={dataUpdatedAt || null} />
        </View>

        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator
              size="large"
              color={theme.colors.brand.primary}
            />
          </View>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : bookings && bookings.length === 0 ? (
          <EmptyState message="No bookings" />
        ) : filteredBookings.length === 0 ? (
          <EmptyState message="No bookings match" />
        ) : (
          <FlatList
            data={filteredBookings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <BookingCard booking={item} />}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: theme.spacing.xxl },
            ]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={handleRefresh}
                tintColor={theme.colors.brand.primary}
                colors={[theme.colors.brand.primary]}
              />
            }
          />
        )}
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {},
  headerTitle: {
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  listContent: {},
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
