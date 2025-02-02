import React from "react";

import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { distances } from "app/aesthetic/distances";
import { borderRadii, dividerHeight } from "app/aesthetic/styleConstants";
import { typography } from "app/aesthetic/typography";
import { ThemedView } from "app/components/containers/ThemedView";
import { ThemedText } from "app/components/texts/ThemedText";
import { useThemeColor } from "app/hooks/useThemeColor";
import { Post } from "app/redux/post/types";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

interface PostItemProps {
  item: Post;
}

const postCoverImageSize = 200;

const PostItem: React.FC<PostItemProps> = ({ item }) => {
  const iconColor = useThemeColor("icon");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.navigate("PostDetail", { postId: item._id });
  };

  const mainImage =
    item.images && item.images.length > 0 ? item.images[0] : null;

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.postListItem}
      activeOpacity={0.7}
    >
      <ThemedView style={styles.postListItemInner}>
        <ThemedView style={{ flexDirection: "row" }}>
          <Image
            source={{ uri: mainImage || "https://via.placeholder.com/50" }}
            resizeMode="cover"
            style={styles.postLogo}
          />
          <ThemedView style={styles.calloutTitleContainer}>
            <ThemedView style={styles.calloutOverviewContainer}>
              <ThemedText numberOfLines={1} style={styles.calloutTitle}>
                {item.title}
              </ThemedText>
              <ThemedText numberOfLines={1} style={styles.calloutType}>
                {item.category}
              </ThemedText>
            </ThemedView>
            <Ionicons name="arrow-forward" size={20} color={iconColor} />
          </ThemedView>
        </ThemedView>

        <ThemedText style={styles.description} numberOfLines={2}>
          {item.description}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  postListItem: {
    borderRadius: borderRadii.medium,
    marginBottom: distances.md,
    paddingHorizontal: distances.md,
  },
  postListItemInner: {
    paddingBottom: distances.md,
    borderBottomWidth: dividerHeight,
  },
  calloutType: {
    fontSize: 12,
    fontFamily: typography.secondary.semiBold,
  },
  calloutTitle: {
    fontSize: 16,
    fontFamily: typography.primary.bold,
    paddingRight: distances.sm,
  },
  title: {
    fontSize: 18,
    fontFamily: typography.primary.bold,
    marginBottom: distances.xxs,
  },
  description: {
    fontSize: 14,
    fontFamily: typography.secondary.regular,
    marginTop: distances.xs,
  },
  postLogo: {
    width: 50,
    height: 50,
    borderRadius: borderRadii.medium,
    marginRight: distances.sm,
  },
  postCoverImage: {
    width: postCoverImageSize,
    height: postCoverImageSize,
    marginRight: distances.sm,
    borderRadius: borderRadii.medium,
  },
  calloutOverviewContainer: {
    flexDirection: "column",
  },
  calloutTitleContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: distances.xs,
    paddingRight: distances.xs,
  },
});

export default PostItem;
