import type {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

export type RootStackParamList = {
  BookingList: undefined;
  BookingDetail: { id: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type BookingListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "BookingList"
>;
export type BookingDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "BookingDetail"
>;

export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;
