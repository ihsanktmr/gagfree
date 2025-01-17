import React, { useRef } from "react";

import { Ionicons } from "@expo/vector-icons";
import { isIos } from "app/appInfo";
import { ThemedView } from "app/components/containers/ThemedView";
import { ThemedText } from "app/components/texts/ThemedText";
import { Post } from "app/redux/post/types";
import { Image, StyleSheet, View } from "react-native";
import MapView, { Callout, Marker, Region } from "react-native-maps";

type ThemeProps = {
  currentTheme: string;
  mainColor: string;
  iconColor: string;
  backgroundColor: string;
};

type MapViewComponentProps = {
  posts: Post[];
  region: Region;
  setRegion: (region: Region) => void;
  initialRegion: Region;
  theme: ThemeProps;
  mapCustomStyle: any;
  mapCustomStyleDark: any;
  onMarkerPress: (post: Post) => void;
  onCalloutPress: (postId: string) => void;
};

const MIN_ZOOM_DELTA = 0.008;

export const MapViewComponent: React.FC<MapViewComponentProps> = ({
  posts,
  region,
  setRegion,
  initialRegion,
  theme,
  mapCustomStyle,
  mapCustomStyleDark,
  onMarkerPress,
  onCalloutPress,
}) => {
  const mapViewRef = useRef<MapView | null>(null);

  const renderMarker = (post: Post) => {
    if (!post.contact) return null;
    return (
      <Marker
        key={post._id}
        coordinate={{
          latitude: post.contact.latitude,
          longitude: post.contact.longitude,
        }}
        pinColor={theme.mainColor}
        title={post.title}
        description={post.description}
        onPress={() => {
          mapViewRef.current?.animateToRegion(
            {
              latitude: post.contact.latitude,
              longitude: post.contact.longitude,
              latitudeDelta: MIN_ZOOM_DELTA,
              longitudeDelta: MIN_ZOOM_DELTA,
            },
            1000,
          );
          onMarkerPress(post);
        }}
        tracksViewChanges={false}
      >
        {isIos && (
          <Callout
            tooltip
            style={[
              styles.calloutContainer2,
              { backgroundColor: theme.backgroundColor },
            ]}
            onPress={() => onCalloutPress(post._id)}
          >
            <ThemedView style={styles.calloutContainer}>
              <View style={styles.calloutTitleContainer}>
                <View style={styles.calloutOverviewContainer}>
                  <ThemedText numberOfLines={1} style={styles.calloutTitle}>
                    {post.title}
                  </ThemedText>
                </View>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={theme.iconColor}
                />
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
    <MapView
      customMapStyle={
        theme.currentTheme === "dark" ? mapCustomStyleDark : mapCustomStyle
      }
      ref={mapViewRef}
      initialRegion={initialRegion}
      region={region}
      onRegionChangeComplete={setRegion}
      userInterfaceStyle={theme.currentTheme}
      showsUserLocation
      showsMyLocationButton={false}
      zoomEnabled
      scrollEnabled
      style={styles.map}
    >
      {posts.map(renderMarker)}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    height: "100%",
    width: "100%",
  },
  calloutContainer: {
    width: 200,
    padding: 8,
    borderRadius: 8,
  },
  calloutTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  calloutOverviewContainer: {
    flexDirection: "column",
  },
  calloutContainer2: {
    borderRadius: 8,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  calloutDescription: {
    fontSize: 12,
    marginBottom: 8,
  },
  calloutImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
  },
});
