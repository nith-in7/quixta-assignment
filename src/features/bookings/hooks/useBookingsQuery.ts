import { useQuery } from '@tanstack/react-query';
import { bookingsApi, IBookingsApi } from '../api/bookings-api';
import { Booking } from '../types/booking';

export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  detail: (id: string) => [...bookingKeys.all, 'detail', id] as const,
};

export function useBookingsQuery(api: IBookingsApi = bookingsApi) {
  return useQuery<Booking[], Error>({
    queryKey: bookingKeys.lists(),
    queryFn: () => api.getBookings(),
  });
}
