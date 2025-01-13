import * as React from "react";
import { useEffect } from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabBar from "app/components/common/MainTabBar";
import { selectIsOnboardingSeen } from "app/redux/misc/selectors";
import { setTheme } from "app/redux/theme/actions";
import { BookmarksScreen } from "app/screens/BookmarksScreen";
// Import screens
import { OnboardingScreen } from "app/screens/OnboardingScreen";
import PostDetailScreen from "app/screens/PostDetailScreen";
import { PostsScreen } from "app/screens/PostsScreen";
import { SettingsScreen } from "app/screens/SettingsScreen";
import { Appearance } from "react-native";
import { useDispatch, useSelector } from "react-redux";

// Create the stack and bottom tab navigators
const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

// Bottom tab navigator with Map and Settings screens
export function MainTab() {
  return (
    <Tabs.Navigator
      initialRouteName="Posts"
      tabBar={(props) => <MainTabBar {...props} />}
    >
      <Tabs.Screen
        name="Posts"
        options={{ headerShown: false }}
        component={PostsScreen}
      />
      <Tabs.Screen
        name="Settings"
        options={{ headerShown: false }}
        component={SettingsScreen}
      />
    </Tabs.Navigator>
  );
}

// Root stack navigator with Onboarding flow and Bottom Tab navigation
function RootStack() {
  const dispatch = useDispatch();
  const hasSeenOnboarding = useSelector(selectIsOnboardingSeen);

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
    >
      <Stack.Screen
        name="Main"
        component={MainTab}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Posts"
        component={PostsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookmarksScreen"
        component={BookmarksScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return <RootStack />;
}
