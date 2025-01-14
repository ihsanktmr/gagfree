import React, { useEffect, useRef, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { distances } from "app/aesthetic/distances";
import { borderRadii } from "app/aesthetic/styleConstants";
import { typography } from "app/aesthetic/typography";
import { isIos, mapCustomStyle, mapCustomStyleDark } from "app/appInfo";
import { InternetModal } from "app/components/common/InternetModal";
import { ThemedView } from "app/components/containers/ThemedView";
import { ThemedText } from "app/components/texts/ThemedText";
import { useData } from "app/hooks/useData";
import { useThemeColor } from "app/hooks/useThemeColor";
import { Post } from "app/redux/post/types";
import { selectTheme } from "app/redux/theme/selectors";
import { isConnected, setupConnectivityListener } from "app/utils/netCheck";
import { Image, StyleSheet, View } from "react-native";
import MapView, { Callout, Marker, Region } from "react-native-maps";
import { useSelector } from "react-redux";

export function PostsScreen() {
  const posts = useData();
  const { navigate } = useNavigation();
  const theme = useSelector(selectTheme);

  // State
  const [view, setView] = useState("map");
  const [region, setRegion] = useState<Region>(initialRegion);
  const [isInternetModalVisible, setIsInternetModalVisible] = useState(false);

  const mapViewRef = useRef<MapView | null>(null);

  // Constants
  const MIN_ZOOM_DELTA = 0.008;
  const MAX_ZOOM_DELTA = 1.5;
  const initialRegion: Region = {
    latitude: 38.4237,
    longitude: 27.1428,
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
      setIsInternetModalVisible(!connected);
    });
    return unsubscribe; // Cleanup on unmount
  }, []);

  // Event Handlers
  const retryConnection = () => {
    isConnected()
      .then(() => setIsInternetModalVisible(false))
      .catch(() => setIsInternetModalVisible(true));
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

  const closeTheInternetModal = () => setIsInternetModalVisible(false);

  // Rendering
  const renderMarker = (post: Post) => {
    if (!post.contact) return null;
    return (
      <Marker
        key={post._id}
        coordinate={{
          latitude: post.contact.latitude,
          longitude: post.contact.longitude,
        }}
        pinColor={mainColor}
        title={post.title}
        description={post.description}
        onPress={() => handleMarkerPress(post)}
        tracksViewChanges={false}
      >
        {isIos && (
          <Callout
            tooltip
            style={[styles.calloutContainer2, { backgroundColor }]}
            onPress={() => handlePress(post._id)}
          >
            <ThemedView style={styles.calloutContainer}>
              <View style={styles.calloutTitleContainer}>
                <View style={styles.calloutOverviewContainer}>
                  <ThemedText numberOfLines={1} style={styles.calloutTitle}>
                    {post.title}
                  </ThemedText>
                </View>
                <Ionicons name="arrow-forward" size={20} color={iconColor} />
              </View>
              <ThemedText numberOfLines={12} style={styles.calloutDescription}>
                {post.description}
              </ThemedText>
              {post.images?.length > 0 && (
                <Image
                  source={{ uri: post.images[0]?.imageUrl }}
                  style={styles.calloutImage}
                  resizeMode="cover"
                />
              )}
            </ThemedView>
          </Callout>
        )}
      </Marker>
    );
  };

  return (
    <ThemedView style={styles.mainContainer}>
      <MapView
        customMapStyle={theme === "dark" ? mapCustomStyleDark : mapCustomStyle}
        ref={mapViewRef}
        initialRegion={initialRegion}
        region={region}
        onRegionChangeComplete={setRegion}
        userInterfaceStyle={theme}
        showsUserLocation
        showsMyLocationButton={false}
        zoomEnabled
        scrollEnabled
        style={isViewMap ? styles.fullscreenMap : undefined}
      >
        {posts.map(renderMarker)}
      </MapView>

      <InternetModal
        visible={isInternetModalVisible}
        backgroundColor={backgroundColor}
        onRetry={retryConnection}
        onDismiss={closeTheInternetModal}
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
