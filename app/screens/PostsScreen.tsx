import React, { useEffect, useRef, useState } from "react";

import { useNavigation } from "@react-navigation/native";
import { distances } from "app/aesthetic/distances";
import { borderRadii } from "app/aesthetic/styleConstants";
import { typography } from "app/aesthetic/typography";
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

const productInputData = {
  title1: "Add Product Details",
  title2: "Upload Product Photos",
  slide1Text:
    "Enter a detailed description of your product to attract customers.",
  slide2Text: "Add clear and high-quality photos of the product.",
  func1: () => console.log("Product description action triggered"),
  func2: () => console.log("Photo upload action triggered"),
};

export function PostsScreen() {
  const posts = useData();
  const { navigate } = useNavigation();
  const theme = useSelector(selectTheme);

  // State
  const [view, setView] = useState("map");
  const [region, setRegion] = useState<Region>(initialRegion);
  const [internetModalVisible, setInternetModalVisible] = useState(false);
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);

  const mapViewRef = useRef<MapView | null>(null);

  // Constants
  const MIN_ZOOM_DELTA = 0.008;
  const MAX_ZOOM_DELTA = 1.5;
  const initialRegion: Region = {
    latitude: 40.6782,
    longitude: -73.9442,
    latitudeDelta: MAX_ZOOM_DELTA,
    longitudeDelta: MAX_ZOOM_DELTA,
  };

  const iconColor = useThemeColor("icon");
  const backgroundColor = useThemeColor("background");
  const mainColor = useThemeColor("main");
  const isViewMap = view === "map";

  // Effects
  useEffect(() => {
    // Setup connectivity listener
    const unsubscribe = setupConnectivityListener((connected) => {
      setInternetModalVisible(!connected);
    });
    return unsubscribe; // Cleanup on unmount
  }, []);

  // Event Handlers
  const retryConnection = () => {
    isConnected()
      .then(() => setInternetModalVisible(false))
      .catch(() => setInternetModalVisible(true));
  };

  const handleMarkerPress = (post: Post) => {
    mapViewRef.current?.animateToRegion(
      {
        latitude: post.contact.latitude,
        longitude: post.contact.longitude,
        latitudeDelta: MIN_ZOOM_DELTA,
        longitudeDelta: MIN_ZOOM_DELTA,
      },
      1000,
    );
  };

  const handlePress = (postId: string) => navigate("PostDetail", { postId });

  const closeTheInternetModal = () => setInternetModalVisible(false);

  const handleFABPress = () => {
    setAddProductModalVisible(true);
  };

  const handleCalloutPress = (postId: string) => {
    navigate("PostDetail", { postId });
  };

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
        onCalloutPress={handleCalloutPress}
      />

      <FABButton onPress={handleFABPress} icon="plus" />

      <InternetModal
        visible={internetModalVisible}
        backgroundColor={backgroundColor}
        onRetry={retryConnection}
        onDismiss={closeTheInternetModal}
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
  },
  fullscreenMap: {
    height: "100%",
    width: "100%",
  },
  modalContainer: {
    width: 300,
    padding: distances.md,
    borderRadius: borderRadii.large,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalSpacer: {
    width: 10,
  },
  calloutContainer: {
    padding: distances.sm,
    borderRadius: borderRadii.large,
  },
  calloutTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: distances.xs,
  },
  calloutOverviewContainer: {
    flexDirection: "column",
  },
  calloutContainer2: {
    borderRadius: borderRadii.large,
  },
  calloutTitle: {
    fontSize: 16,
    fontFamily: typography.primary.bold,
  },
  calloutDescription: {
    fontSize: 12,
    fontFamily: typography.secondary.regular,
    marginBottom: distances.sm,
  },
  calloutImage: {
    width: "100%",
    height: 100,
    borderRadius: borderRadii.medium,
  },
});
