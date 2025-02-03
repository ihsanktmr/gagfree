import React, { useCallback, useMemo, useRef, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { distances } from "app/aesthetic/distances";
import { isIos } from "app/appInfo";
import { ThemedView } from "app/components/containers/ThemedView";
import { ThemedText } from "app/components/texts/ThemedText";
import { Post } from "app/redux/post/types";
import { Image, StyleSheet, View } from "react-native";
import MapView, {
  Callout,
  Marker,
  PROVIDER_DEFAULT,
  Region,
} from "react-native-maps";

interface ThemeProps {
  currentTheme: string;
  mainColor: string;
  iconColor: string;
  backgroundColor: string;
}

interface MapViewComponentProps {
  posts: Post[];
  region: Region;
  setRegion: (region: Region) => void;
  initialRegion: Region;
  theme: ThemeProps;
  mapCustomStyle: any;
  mapCustomStyleDark: any;
  onMarkerPress: (post: Post) => void;
  onCalloutPress: (postId: string) => void;
  showsUserLocation?: boolean;
  zoomLevel?: number;
}

const MIN_ZOOM_DELTA = 0.008;
const ANIMATION_DURATION = 1000;

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
  showsUserLocation = true,
  zoomLevel = MIN_ZOOM_DELTA,
}) => {
  const mapViewRef = useRef<MapView | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const mapStyle = useMemo(
    () => (theme.currentTheme === "dark" ? mapCustomStyleDark : mapCustomStyle),
    [theme.currentTheme, mapCustomStyle, mapCustomStyleDark],
  );

  const handleMapReady = useCallback(() => {
    setIsMapReady(true);
  }, []);

  const handleMarkerPress = useCallback(
    (post: Post) => {
      if (!post.contact?.latitude || !post.contact?.longitude) return;

      const newRegion = {
        latitude: post.contact.latitude,
        longitude: post.contact.longitude,
        latitudeDelta: zoomLevel,
        longitudeDelta: zoomLevel,
      };

      mapViewRef.current?.animateToRegion(newRegion, ANIMATION_DURATION);
      onMarkerPress(post);
    },
    [onMarkerPress, zoomLevel],
  );

  const CalloutContent = useCallback(
    ({ post }: { post: Post }) => (
      <ThemedView style={styles.calloutContainer}>
        <View style={styles.calloutTitleContainer}>
          <View style={styles.calloutOverviewContainer}>
            <ThemedText numberOfLines={1} style={styles.calloutTitle}>
              {post.title}
            </ThemedText>
          </View>
          <Ionicons name="arrow-forward" size={20} color={theme.iconColor} />
        </View>
        <ThemedText numberOfLines={12} style={styles.calloutDescription}>
          {post.description}
        </ThemedText>
        {post.images?.[0]?.imageUrl && (
          <Image
            source={{ uri: post.images[0].imageUrl }}
            style={styles.calloutImage}
            resizeMode="cover"
          />
        )}
      </ThemedView>
    ),
    [theme.iconColor],
  );

  const renderMarker = useCallback(
    (post: Post) => {
      if (!post.contact?.latitude || !post.contact?.longitude) return null;

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
          onPress={() => handleMarkerPress(post)}
          tracksViewChanges={false}
        >
          {isIos && (
            <Callout
              tooltip
              style={[
                styles.calloutWrapper,
                { backgroundColor: theme.backgroundColor },
              ]}
              onPress={() => onCalloutPress(post._id)}
            >
              <CalloutContent post={post} />
            </Callout>
          )}
        </Marker>
      );
    },
    [theme, handleMarkerPress, onCalloutPress],
  );

  const markers = useMemo(() => posts.map(renderMarker), [posts, renderMarker]);

  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      customMapStyle={mapStyle}
      ref={mapViewRef}
      initialRegion={initialRegion}
      region={region}
      onRegionChangeComplete={setRegion}
      userInterfaceStyle={theme.currentTheme as "light" | "dark"}
      showsUserLocation={showsUserLocation}
      showsMyLocationButton={false}
      zoomEnabled
      scrollEnabled
      style={styles.map}
      onMapReady={handleMapReady}
    >
      {isMapReady && markers}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    height: "100%",
    width: "100%",
  },
  calloutWrapper: {
    borderRadius: distances.sm,
    overflow: "hidden",
  },
  calloutContainer: {
    width: 200,
    padding: distances.sm,
    borderRadius: distances.sm,
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
  calloutTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  calloutDescription: {
    fontSize: 12,
    marginBottom: distances.sm,
  },
  calloutImage: {
    width: "100%",
    height: 100,
    borderRadius: distances.sm,
  },
});
