// In App.js in a new project
import * as React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AnimalDetailScreen } from "app/screens/AnimalDetailScreen";
import { HomeScreen } from "app/screens/HomeScreen";

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="AnimalDetail" component={AnimalDetailScreen} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  return <RootStack />;
}
