import axios, { AxiosInstance } from 'axios';

export function createApiClient(baseURL?: string): AxiosInstance {
  const instance = axios.create({
    baseURL: baseURL ?? (process.env.EXPO_PUBLIC_API_URL || ''),
    timeout: 10000,
  });

  instance.interceptors.request.use(
    (config) => {
      config.headers.set('Accept', 'application/json');
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      if (status) {
        return Promise.reject(new Error(`Request failed: HTTP ${status}`));
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

export const apiClient: AxiosInstance = createApiClient();
