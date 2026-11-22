import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['/', 'quixta://'],
  config: {
    screens: {
      BookingList: '',
      BookingDetail: 'bookings/:id',
    },
  },
};
