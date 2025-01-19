import React, { useEffect, useRef, useState } from "react";

import { useNavigation } from "@react-navigation/native";
import { mapCustomStyle, mapCustomStyleDark } from "app/appInfo";
import { FABButton } from "app/components/buttons/FABButton";
import { MapViewComponent } from "app/components/common/GFMapView";
import { ThemedView } from "app/components/containers/ThemedView";
import { InternetModal } from "app/components/modals/InternetModal";
import { SwiperTutorialModal } from "app/components/modals/SwiperAddModal";
import { useData } from "app/hooks/useData";
import { useThemeColor } from "app/hooks/useThemeColor";
import { Post } from "app/redux/post/types";
import { selectTheme } from "app/redux/theme/selectors";
import { isConnected, setupConnectivityListener } from "app/utils/netCheck";
import { StyleSheet } from "react-native";
import MapView, { Region } from "react-native-maps";
import { useSelector } from "react-redux";

export function PostsScreen() {
  const posts = useData();
  const { navigate } = useNavigation();
  const theme = useSelector(selectTheme);

  // Constants
  const MIN_ZOOM_DELTA = 0.008;
  const MAX_ZOOM_DELTA = 1.5;

  const initialRegion: Region = {
    latitude: 40.6782,
    longitude: -73.9442,
    latitudeDelta: MAX_ZOOM_DELTA,
    longitudeDelta: MAX_ZOOM_DELTA,
  };

  const productInputData = {
    title1: "Add Product Details",
    title2: "Upload Product Photos",
    slide1Text:
      "Enter a detailed description of your product to attract customers.",
    slide2Text: "Add clear and high-quality photos of the product.",
    func1: () => console.log("Product description action triggered"),
    func2: () => console.log("Photo upload action triggered"),
  };

  // State
  const [view, setView] = useState<"map" | "list">("map");
  const [region, setRegion] = useState<Region>(initialRegion);
  const [internetModalVisible, setInternetModalVisible] = useState(false);
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);

  const mapViewRef = useRef<MapView | null>(null);

  const iconColor = useThemeColor("icon");
  const backgroundColor = useThemeColor("background");
  const mainColor = useThemeColor("main");
  const isViewMap = view === "map";

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

  const handleMarkerPress = (post: Post) => {
    if (mapViewRef.current) {
      mapViewRef.current.animateToRegion(
        {
          latitude: post.contact.latitude,
          longitude: post.contact.longitude,
          latitudeDelta: MIN_ZOOM_DELTA,
          longitudeDelta: MIN_ZOOM_DELTA,
        },
        1000,
      );
    }
  };

  const handlePress = (postId: string) => navigate("PostDetail", { postId });

  const handleFABPress = () => setAddProductModalVisible(true);

  return (
    <ThemedView style={styles.mainContainer}>
      <MapViewComponent
        posts={posts}
        region={region}
        setRegion={setRegion}
        initialRegion={initialRegion}
        theme={{ currentTheme: theme, mainColor, iconColor, backgroundColor }}
        mapCustomStyle={mapCustomStyle}
        mapCustomStyleDark={mapCustomStyleDark}
        onMarkerPress={handleMarkerPress}
        onCalloutPress={handlePress}
      />

      <FABButton onPress={handleFABPress} icon="plus" />

      <InternetModal
        visible={internetModalVisible}
        onRetry={retryConnection}
        onDismiss={() => setInternetModalVisible(false)}
      />

      <SwiperTutorialModal
        visible={addProductModalVisible}
        onDismiss={() => setAddProductModalVisible(false)}
        data={productInputData}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
