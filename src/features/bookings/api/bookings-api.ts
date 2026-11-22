import { AxiosInstance } from 'axios';
import { apiClient } from './axios-client';
import { getFakeBookings } from './fake-server';
import { Booking, isValidBooking } from '../types/booking';

export interface IBookingsApi {
  getBookings(): Promise<Booking[]>;
}

export class RemoteBookingsApi implements IBookingsApi {
  constructor(private client: AxiosInstance = apiClient) {}

  async getBookings(): Promise<Booking[]> {
    const response = await this.client.get('/bookings');
    if (!Array.isArray(response.data)) {
      throw new Error('Invalid bookings response: Expected an array');
    }
    return response.data.filter(isValidBooking);
  }
}

export class FakeBookingsApi implements IBookingsApi {
  async getBookings(): Promise<Booking[]> {
    const rawData = await getFakeBookings();
    return rawData.filter(isValidBooking);
  }
}

export function createBookingsApi(): IBookingsApi {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  if (baseUrl && baseUrl.trim().length > 0) {
    return new RemoteBookingsApi(apiClient);
  }
  return new FakeBookingsApi();
}

export const bookingsApi: IBookingsApi = createBookingsApi();

export async function fetchBookings(api: IBookingsApi = bookingsApi): Promise<Booking[]> {
  return api.getBookings();
}
