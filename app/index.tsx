import React, { useEffect } from "react";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { customFontsToLoad } from "./aesthetic/typography";
import { AppNavigator } from "./navigation";
import { LanguageProvider } from "./providers/LanguageProvider";
import { SnackbarProvider } from "./providers/SnackbarProvider";
import { persistor, store } from "./redux";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

LogBox.ignoreAllLogs();

export default function App() {
  const [loaded] = useFonts(customFontsToLoad);

  useEffect(() => {
    if (loaded) {
      setTimeout(() => SplashScreen.hideAsync(), 2000);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <React.Fragment>
          <SafeAreaProvider>
            <PaperProvider>
              <LanguageProvider>
                <SnackbarProvider>
                  <AppNavigator />
                  <StatusBar style="auto" />
                </SnackbarProvider>
              </LanguageProvider>
            </PaperProvider>
          </SafeAreaProvider>
        </React.Fragment>
      </PersistGate>
    </Provider>
  );
}
