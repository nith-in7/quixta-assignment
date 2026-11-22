import { DEFAULT_BOOKINGS_FIXTURE } from './fixtures';

export async function getFakeBookings(): Promise<unknown[]> {
  const mode = process.env.EXPO_PUBLIC_BOOKINGS;

  if (mode === 'empty') {
    return [];
  }

  if (mode === 'error') {
    throw new Error('Failed to load bookings: HTTP 500');
  }

  return DEFAULT_BOOKINGS_FIXTURE;
}
