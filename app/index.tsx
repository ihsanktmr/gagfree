import React, { useEffect, useState } from "react";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { customFontsToLoad } from "./aesthetic/typography";
import { InternetModal } from "./components/modals/InternetModal";
import AppNavigator from "./navigation";
import { LanguageProvider } from "./providers/LanguageProvider";
import { SnackbarProvider } from "./providers/SnackbarProvider";
import { persistor, store } from "./redux";
import { isConnected, setupConnectivityListener } from "./utils/netCheck";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

LogBox.ignoreAllLogs();

export default function App() {
  const [internetModalVisible, setInternetModalVisible] = useState(false);

  const [loaded] = useFonts(customFontsToLoad);

  useEffect(() => {
    if (loaded) {
      setTimeout(() => SplashScreen.hideAsync(), 2000);
    }
  }, [loaded]);

  // Effects
  useEffect(() => {
    const unsubscribe = setupConnectivityListener((connected) => {
      setInternetModalVisible(!connected);
    });
    return unsubscribe;
  }, []);

  // Handlers
  const retryConnection = async () => {
    try {
      await isConnected();
      setInternetModalVisible(false);
    } catch {
      setInternetModalVisible(true);
    }
  };
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

                  <InternetModal
                    visible={internetModalVisible}
                    onRetry={retryConnection}
                    onDismiss={() => setInternetModalVisible(false)}
                  />
                </SnackbarProvider>
              </LanguageProvider>
            </PaperProvider>
          </SafeAreaProvider>
        </React.Fragment>
      </PersistGate>
    </Provider>
  );
}
