import {
  CompositeNavigationProp,
  NavigationProp,
  NavigatorScreenParams,
  RouteProp,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Post } from "app/redux/post/types";
import { Region } from "react-native-maps";

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  Onboarding: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  PostDetail: { postId: string; post?: Post };
  ChatDetail: {
    chatId: string;
    postId: string;
    title: string;
    otherUserId: string;
  };
  ArchivedChats: undefined;
  BookmarksScreen: undefined;
  NotificationsScreen: undefined;
  EditProfile: undefined;
  MyPosts: undefined;
};

export type MainTabParamList = {
  Posts: { initialRegion?: Region };
  Chats: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ResetPassword: { email: string };
};

// Composite Navigation Types
export type ProfileScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainTabParamList, "Profile">,
  NativeStackNavigationProp<RootStackParamList>
>;

export type AuthScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<AuthStackParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

// Screen Props Types
export type ProfileScreenProps = {
  navigation: ProfileScreenNavigationProp;
};

export type AuthScreenProps = {
  navigation: AuthScreenNavigationProp;
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

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = {
  navigation: NavigationProp<AuthStackParamList, T>;
  route: RouteProp<AuthStackParamList, T>;
};

export interface Chat {
  id: string;
  postId: string;
  title?: string;
  otherUserId: string;
}

// Add these to your existing types.ts
export type EditProfileScreenNavigationProp = NavigationProp<
  RootStackParamList,
  "EditProfile"
>;
export type MyPostsScreenNavigationProp = NavigationProp<
  RootStackParamList,
  "MyPosts"
>;

// Add screen props types
export type EditProfileScreenProps = {
  navigation: EditProfileScreenNavigationProp;
};

export type MyPostsScreenProps = {
  navigation: MyPostsScreenNavigationProp;
};
