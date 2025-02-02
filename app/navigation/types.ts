import {
  NavigationProp,
  NavigatorScreenParams,
  RouteProp,
} from "@react-navigation/native";

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  Onboarding: undefined;
  PostDetail: { postId: string };
  ChatDetail: { chatId: string };
  ArchivedChats: undefined;
  BookmarksScreen: undefined;
  NotificationsScreen: undefined;
};

export type MainTabParamList = {
  Posts: undefined;
  Chats: undefined;
  Settings: undefined;
};

// Helper type for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// Helper types for screen props
export type RootStackScreenProps<T extends keyof RootStackParamList> = {
  navigation: NavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};

export type MainTabScreenProps<T extends keyof MainTabParamList> = {
  navigation: NavigationProp<MainTabParamList, T>;
  route: RouteProp<MainTabParamList, T>;
};
