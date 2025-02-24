import * as React from "react";
import { useEffect } from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabBar from "app/components/common/GFTabBar";
import { selectIsAuthenticated } from "app/redux/auth/selectors";
import { selectIsOnboardingSeen } from "app/redux/misc/selectors";
import { setTheme } from "app/redux/theme/actions";
import { ArchivedChatsScreen } from "app/screens/ArchivedChatsScreen";
import { BookmarksScreen } from "app/screens/BookmarksScreen";
import ChatDetailScreen from "app/screens/ChatDetailScreen";
import { ChatsScreen } from "app/screens/ChatsScreen";
import { EditProfileScreen } from "app/screens/EditProfileScreen";
import { MyPostsScreen } from "app/screens/MyPostsScreen";
import { NotificationsScreen } from "app/screens/NotificationsScreen";
import { OnboardingScreen } from "app/screens/OnboardingScreen";
import PostDetailScreen from "app/screens/PostDetailScreen";
import { PostsScreen } from "app/screens/PostsScreen";
import { ProfileScreen } from "app/screens/ProfileScreen";
import { SettingsScreen } from "app/screens/SettingsScreen";
import { Appearance } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
  AuthStackParamList,
  MainTabParamList,
  RootStackParamList,
} from "./types";
import { SignupScreen } from "app/screens/SignupScreen";
import { ForgotPasswordScreen } from "app/screens/ForgotPasswordScreen";
import { LoginScreen } from "app/screens/LoginScreen";
import { ResetPasswordScreen } from "app/screens/ResetPasswordScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTab() {
  return (
    <Tab.Navigator
      initialRouteName="Posts"
      tabBar={(props) => <MainTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Posts" component={PostsScreen} />
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
      <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </AuthStack.Navigator>
  );
}

function RootStack() {
  const dispatch = useDispatch();
  const hasSeenOnboarding = useSelector(selectIsOnboardingSeen);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    const userTheme = Appearance.getColorScheme();
    dispatch(setTheme(userTheme || "dark"));

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      dispatch(setTheme(colorScheme || "dark"));
    });

    return () => subscription.remove();
  }, [dispatch]);

  return (
    <Stack.Navigator
      initialRouteName={hasSeenOnboarding ? "Main" : "Onboarding"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Main" component={MainTab} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
      <Stack.Screen name="ArchivedChats" component={ArchivedChatsScreen} />
      <Stack.Screen name="BookmarksScreen" component={BookmarksScreen} />
      <Stack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
      />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="MyPosts" component={MyPostsScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return <RootStack />;
}
