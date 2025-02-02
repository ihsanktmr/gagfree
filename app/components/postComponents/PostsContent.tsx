import React from "react";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { mapCustomStyle, mapCustomStyleDark } from "app/appInfo";
import { useThemeColor } from "app/hooks/useThemeColor";
import { RootStackParamList } from "app/navigation/types";
import { Post } from "app/redux/post/types";
import { StyleSheet, View } from "react-native";
import { Region } from "react-native-maps";

import { FABButton } from "../buttons/FABButton";
import { MapViewComponent } from "../common/GFMapView";
import PostList from "../lists/post/PostList";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface PostsContentProps {
  view: "map" | "list";
  posts: Post[];
  initialRegion: Region;
  theme: string;
  onAddPress: () => void;
}

export const PostsContent: React.FC<PostsContentProps> = ({
  view,
  posts,
  initialRegion,
  theme,
  onAddPress,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const mainColor = useThemeColor("main");
  const iconColor = useThemeColor("icon");
  const backgroundColor = useThemeColor("background");

  const [region, setRegion] = React.useState<Region>(initialRegion);

  const handlePostPress = (postId: string) => {
    const selectedPost = posts.find((p) => p._id === postId);
    if (selectedPost) {
      navigation.navigate("PostDetail", {
        postId: selectedPost._id,
        post: selectedPost,
      });
    }
  };

  const handleMarkerPress = (post: Post) => {
    setRegion({
      latitude: post.contact.latitude || initialRegion.latitude,
      longitude: post.contact.longitude || initialRegion.longitude,
      latitudeDelta: 0.008,
      longitudeDelta: 0.008,
    });
  };

  console.log(
    "PostsContent - Current posts:",
    posts.map((p) => ({ id: p._id, title: p.title, category: p.category })),
  );

  return (
    <View style={styles.container}>
      {view === "map" ? (
        <MapViewComponent
          posts={posts}
          region={region}
          setRegion={setRegion}
          initialRegion={initialRegion}
          theme={{ currentTheme: theme, mainColor, iconColor, backgroundColor }}
          mapCustomStyle={mapCustomStyle}
          mapCustomStyleDark={mapCustomStyleDark}
          onMarkerPress={handleMarkerPress}
          onCalloutPress={handlePostPress}
        />
      ) : (
        <PostList postData={posts} onPostPress={handlePostPress} />
      )}
      <FABButton onPress={onAddPress} icon="plus" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
