import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { BookingsListScreen } from '../features/bookings';
import { BookingDetailScreen } from '../features/booking-detail';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="BookingList"
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
        animation: 'default',
      }}
    >
      <Stack.Screen
        name="BookingList"
        component={BookingsListScreen}
      />
      <Stack.Screen
        name="BookingDetail"
        component={BookingDetailScreen}
      />
    </Stack.Navigator>
  );
}
