import React, { useEffect, useRef, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { distances } from "app/aesthetic/distances";
import { borderRadii, width } from "app/aesthetic/styleConstants";
import { typography } from "app/aesthetic/typography";
import { isIos, mapCustomStyle, mapCustomStyleDark } from "app/appInfo";
import { ThemedView } from "app/components/containers/ThemedView";
import PostList from "app/components/postComponents/PostList";
import { SearchPostInput } from "app/components/postComponents/SearchPost";
import { ThemedText } from "app/components/texts/ThemedText";
import { useData } from "app/hooks/useData";
import { useInput } from "app/hooks/useInput";
import { useThemeColor } from "app/hooks/useThemeColor";
import { i18n } from "app/language";
import { Post } from "app/redux/post/types";
import { selectTheme } from "app/redux/theme/selectors";
import { triggerSelectionChangeFeedback } from "app/utils/haptics";
import { isConnected, setupConnectivityListener } from "app/utils/netCheck";
import { Image, StyleSheet, View } from "react-native";
import MapView, { Callout, Marker, Region } from "react-native-maps";
import { Button, Modal } from "react-native-paper";
import { useSelector } from "react-redux";

export function PostsScreen() {
  const posts = useData();
  const { navigate } = useNavigation();

  const theme = useSelector(selectTheme);
  const [view, setView] = useState("map");
  const mapViewRef = useRef<MapView | null>(null);
  const iconColor = useThemeColor("icon");
  const backgroundColor = useThemeColor("background");
  const mainColor = useThemeColor("main");
  const searchTermMap = useInput("");
  const searchTermList = useInput("");
  const MIN_ZOOM_DELTA = 0.008;
  const MAX_ZOOM_DELTA = 1.5;
  const ZOOM_STEPS = 60;
  const initialRegion: Region = {
    latitude: 38.4237,
    longitude: 27.1428,
    latitudeDelta: MAX_ZOOM_DELTA,
    longitudeDelta: MAX_ZOOM_DELTA,
  };

  const [region, setRegion] = useState<Region>(initialRegion);
  const isSearchTyped =
    searchTermMap.value.length > 0 && searchTermMap.value !== " ";
  const isViewMap = view === "map";
  const [isInternetModalVisible, setIsInternetModalVisible] =
    useState<boolean>(false);

  useEffect(() => {
    // idk why but segmented button texts doesnt reflect from language change
    // so this is a temporary solution
    setTimeout(() => zoomInMap(), 500);
  }, []);

  useEffect(() => {
    const unsubscribe = setupConnectivityListener((isConnected) => {
      setIsInternetModalVisible(!isConnected);
    });

    // Cleanup listener on component unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const retryConnection = () => {
    isConnected()
      .then(() => setIsInternetModalVisible(false))
      .catch(() => setIsInternetModalVisible(true));
  };

  const handleMarkerPress = (post) => {
    if (mapViewRef.current) {
      mapViewRef.current.animateToRegion(
        {
          latitude: post.location.latitude,
          longitude: post.location.longitude,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        },
        1000,
      );
    }
  };

  const zoomInMap = () => {
    const regionCloser = {
      ...region,
      latitudeDelta: region.latitudeDelta / 1.05,
      longitudeDelta: region.longitudeDelta / 1.05,
    };

    mapViewRef.current?.animateToRegion(regionCloser);
  };

  const handlePress = (postId: string) => {
    navigate("PostDetail", { postId: postId });
  };

  const closeTheInternetModal = () => {
    setIsInternetModalVisible(false);
  };

  return (
    <ThemedView style={styles.mainContainer}>
      <MapView
        customMapStyle={theme === "dark" ? mapCustomStyleDark : mapCustomStyle}
        ref={mapViewRef}
        userInterfaceStyle={theme}
        minDelta={0.008}
        maxDelta={2}
        onRegionChangeComplete={() => null}
        region={region}
        initialRegion={{
          latitude: 38.4237,
          longitude: 27.1428,
          latitudeDelta: 3,
          longitudeDelta: 2,
        }}
        showsCompass={false}
        showsScale={false}
        showsUserLocation={true}
        toolbarEnabled={false}
        showsMyLocationButton={false}
        showsBuildings={false}
        showsIndoors={false}
        zoomEnabled={true}
        scrollEnabled={true}
        loadingEnabled={false}
        showsPointsOfInterest={false}
        style={{
          height: isViewMap ? "100%" : null,
          width: isViewMap ? "100%" : null,
        }}
      >
        {posts.map((post: Post) => {
          if (post.contact) {
            return (
              <Marker
                tracksViewChanges={false}
                pinColor={mainColor}
                title={post.title}
                description={post.description}
                key={post._id}
                coordinate={{
                  latitude: post.contact.latitude,
                  longitude: post.contact.longitude,
                }}
                onPress={() => handleMarkerPress(post)}
              >
                {isIos && (
                  <Callout
                    tooltip
                    onPress={() => handlePress(post._id)}
                    style={{
                      ...styles.calloutContainer2,
                      backgroundColor: backgroundColor,
                    }}
                  >
                    <ThemedView style={styles.calloutContainer}>
                      <ThemedView style={styles.calloutTitleContainer}>
                        <ThemedView style={styles.calloutOverviewContainer}>
                          <ThemedText
                            numberOfLines={1}
                            style={styles.calloutTitle}
                          >
                            {post.title}
                          </ThemedText>
                        </ThemedView>
                        <Ionicons
                          name="arrow-forward"
                          size={20}
                          color={iconColor}
                        />
                      </ThemedView>

                      <ThemedText
                        numberOfLines={12}
                        style={styles.calloutDescription}
                      >
                        {post.description}
                      </ThemedText>

                      {post.images && post.images.length > 0 && (
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
          }
        })}
      </MapView>

      <Modal
        visible={isInternetModalVisible}
        style={{ alignItems: "center" }}
        onDismiss={closeTheInternetModal}
        contentContainerStyle={{ ...styles.modalContainer, backgroundColor }}
      >
        <ThemedText numberOfLines={12} style={styles.calloutDescription}>
          {i18n.t("noInternet")}
        </ThemedText>
        <ThemedView
          style={{ flexDirection: "row", justifyContent: "flex-end" }}
        >
          <Button mode="contained" onPress={retryConnection}>
            {i18n.t("retry")}
          </Button>
          <View style={{ width: 10 }} />
          <Button mode="contained" onPress={closeTheInternetModal}>
            {i18n.t("okay")}
          </Button>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    width: 300,
    padding: distances.md,
    marginHorizontal: distances.sm,
    borderRadius: borderRadii.large,
  },
  calloutContainer: {
    width: width / 1.75,
    padding: distances.sm,
    borderRadius: borderRadii.large,
    justifyContent: "center",
  },
  calloutTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: distances.xs,
    paddingRight: distances.sm,
  },
  calloutOverviewContainer: {
    flexDirection: "column",
  },
  calloutContainer2: {
    borderRadius: borderRadii.large,
    padding: 0,
    margin: 0,
  },
  calloutTitle: {
    fontSize: 16,
    fontFamily: typography.primary.bold,
  },
  calloutType: {
    fontSize: 12,
    fontFamily: typography.secondary.semiBold,
  },
  calloutDescription: {
    fontSize: 12,
    marginBottom: distances.sm,
    fontFamily: typography.secondary.regular,
    paddingRight: distances.sm,
  },
  calloutImage: {
    width: "100%",
    height: 100,
    borderRadius: borderRadii.medium,
    marginBottom: distances.sm,
  },
});
