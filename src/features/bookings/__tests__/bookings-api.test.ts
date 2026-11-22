import { AxiosInstance } from 'axios';
import {
  RemoteBookingsApi,
  FakeBookingsApi,
  createBookingsApi,
  fetchBookings,
  IBookingsApi,
} from '../api/bookings-api';
import { createApiClient } from '../api/axios-client';
import { DEFAULT_BOOKINGS_FIXTURE } from '../api/fixtures';
import { isValidBooking } from '../types/booking';

describe('Bookings API Client (Polymorphic Remote & Fake with Factory)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    delete process.env.EXPO_PUBLIC_API_URL;
    delete process.env.EXPO_PUBLIC_BOOKINGS;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('RemoteBookingsApi', () => {
    it('fetches from /bookings, skips malformed rows, and returns valid bookings', async () => {
      const mockClient = {
        get: jest.fn().mockResolvedValue({
          data: DEFAULT_BOOKINGS_FIXTURE, // contains studio, site, broken, review
          status: 200,
        }),
      } as unknown as AxiosInstance;

      const api = new RemoteBookingsApi(mockClient);
      const bookings = await api.getBookings();

      expect(mockClient.get).toHaveBeenCalledWith('/bookings');
      expect(bookings).toHaveLength(3);
      expect(bookings.some((b) => b.id === 'broken')).toBe(false);
      expect(bookings.map((b) => b.id)).toEqual(['studio', 'site', 'review']);
    });

    it('throws when the remote server returns a non-array body', async () => {
      const mockClient = {
        get: jest.fn().mockResolvedValue({
          data: { error: 'unexpected format' },
          status: 200,
        }),
      } as unknown as AxiosInstance;

      const api = new RemoteBookingsApi(mockClient);
      await expect(api.getBookings()).rejects.toThrow(
        'Invalid bookings response: Expected an array'
      );
    });

    it('propagates HTTP 500 error from client', async () => {
      const mockClient = {
        get: jest.fn().mockRejectedValue(new Error('Request failed: HTTP 500')),
      } as unknown as AxiosInstance;

      const api = new RemoteBookingsApi(mockClient);
      await expect(api.getBookings()).rejects.toThrow('Request failed: HTTP 500');
    });
  });

  describe('FakeBookingsApi', () => {
    it('returns valid bookings from fixture and skips broken rows', async () => {
      const api = new FakeBookingsApi();
      const bookings = await api.getBookings();

      expect(bookings).toHaveLength(3);
      expect(bookings.some((b) => b.id === 'broken')).toBe(false);
      expect(bookings.map((b) => b.id)).toEqual(['studio', 'site', 'review']);
    });

    it('returns empty array when EXPO_PUBLIC_BOOKINGS is "empty"', async () => {
      process.env.EXPO_PUBLIC_BOOKINGS = 'empty';

      const api = new FakeBookingsApi();
      const bookings = await api.getBookings();
      expect(bookings).toEqual([]);
    });

    it('throws HTTP 500 when EXPO_PUBLIC_BOOKINGS is "error"', async () => {
      process.env.EXPO_PUBLIC_BOOKINGS = 'error';

      const api = new FakeBookingsApi();
      await expect(api.getBookings()).rejects.toThrow('Failed to load bookings: HTTP 500');
    });
  });

  describe('createBookingsApi Factory', () => {
    it('creates RemoteBookingsApi when EXPO_PUBLIC_API_URL is configured', () => {
      process.env.EXPO_PUBLIC_API_URL = 'https://api.quixta.com';
      const api = createBookingsApi();
      expect(api).toBeInstanceOf(RemoteBookingsApi);
    });

    it('creates FakeBookingsApi when EXPO_PUBLIC_API_URL is unset', () => {
      delete process.env.EXPO_PUBLIC_API_URL;
      const api = createBookingsApi();
      expect(api).toBeInstanceOf(FakeBookingsApi);
    });
  });

  describe('fetchBookings helper function', () => {
    it('delegates to the injected API client', async () => {
      const mockApi: IBookingsApi = {
        getBookings: jest.fn().mockResolvedValue([
          {
            id: 'mock-1',
            title: 'Mock Booking',
            startsAt: '2026-06-01T15:00:00.000Z',
            timezone: 'America/New_York',
          },
        ]),
      };

      const bookings = await fetchBookings(mockApi);
      expect(bookings).toHaveLength(1);
      expect(mockApi.getBookings).toHaveBeenCalledTimes(1);
    });
  });

  describe('Axios Client & Interceptors', () => {
    it('applies request interceptor to inject Accept header', () => {
      const client = createApiClient('https://api.example.com');
      const requestHandlers = (client.interceptors.request as any).handlers;
      expect(requestHandlers.length).toBeGreaterThan(0);

      const fakeConfig = { headers: new Map() } as any;
      fakeConfig.headers.set = jest.fn();

      requestHandlers[0].fulfilled(fakeConfig);
      expect(fakeConfig.headers.set).toHaveBeenCalledWith('Accept', 'application/json');
    });

    it('applies response interceptor to transform HTTP errors', async () => {
      const client = createApiClient('https://api.example.com');
      const responseHandlers = (client.interceptors.response as any).handlers;
      expect(responseHandlers.length).toBeGreaterThan(0);

      const errorPayload = {
        response: { status: 500, data: { error: 'server crash' } },
      };

      await expect(responseHandlers[0].rejected(errorPayload)).rejects.toThrow(
        'Request failed: HTTP 500'
      );
    });
  });

  describe('isValidBooking type guard', () => {
    const validBooking = {
      id: 'studio-1',
      title: 'Studio Session',
      startsAt: '2026-06-01T15:00:00.000Z',
      timezone: 'America/New_York',
    };

    it('returns true for a fully valid booking object', () => {
      expect(isValidBooking(validBooking)).toBe(true);
    });

    it('returns true when valid booking contains additional properties', () => {
      expect(isValidBooking({ ...validBooking, extraField: 123 })).toBe(true);
    });

    it('returns false for non-object values (null, undefined, primitives)', () => {
      expect(isValidBooking(null)).toBe(false);
      expect(isValidBooking(undefined)).toBe(false);
      expect(isValidBooking('not-an-object')).toBe(false);
      expect(isValidBooking(42)).toBe(false);
      expect(isValidBooking(true)).toBe(false);
    });

    it('returns false when id is missing, not a string, or empty', () => {
      expect(isValidBooking({ ...validBooking, id: undefined })).toBe(false);
      expect(isValidBooking({ ...validBooking, id: 123 })).toBe(false);
      expect(isValidBooking({ ...validBooking, id: '   ' })).toBe(false);
    });

    it('returns false when title is missing, not a string, or empty', () => {
      expect(isValidBooking({ ...validBooking, title: undefined })).toBe(false);
      expect(isValidBooking({ ...validBooking, title: 123 })).toBe(false);
      expect(isValidBooking({ ...validBooking, title: '   ' })).toBe(false);
    });

    it('returns false when startsAt is missing, unparseable, or empty', () => {
      expect(isValidBooking({ ...validBooking, startsAt: undefined })).toBe(false);
      expect(isValidBooking({ ...validBooking, startsAt: 'invalid-date' })).toBe(false);
      expect(isValidBooking({ ...validBooking, startsAt: '   ' })).toBe(false);
    });

    it('returns false when timezone is missing, not a string, or empty', () => {
      expect(isValidBooking({ ...validBooking, timezone: undefined })).toBe(false);
      expect(isValidBooking({ ...validBooking, timezone: null })).toBe(false);
      expect(isValidBooking({ ...validBooking, timezone: '   ' })).toBe(false);
    });
  });
});
