import {
  NavigationProp,
  NavigatorScreenParams,
  RouteProp,
} from "@react-navigation/native";
import { Post } from "app/redux/post/types";
import { Region } from "react-native-maps";

export type RootStackParamList = {
  Posts: { initialRegion: Region };
  PostDetail: { postId: string; post?: Post };
  ChatDetail: {
    chatId: string;
    postId: string;
    title: string;
    otherUserId: string;
  };
  Chat: undefined;
  Settings: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  Onboarding: undefined;
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

export interface Chat {
  id: string;
  postId: string;
  title?: string;
  otherUserId: string;
}
