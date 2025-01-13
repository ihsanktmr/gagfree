import React from "react";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { distances } from "app/aesthetic/distances";
import { borderRadii, dividerHeight } from "app/aesthetic/styleConstants";
import { typography } from "app/aesthetic/typography";
import { ThemedView } from "app/components/containers/ThemedView";
import { ThemedText } from "app/components/texts/ThemedText";
import { useThemeColor } from "app/hooks/useThemeColor";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

interface PostCoverImage {
  imageUrl: string;
}

interface Post {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  coverImages: PostCoverImage[];
}

interface PostItemProps {
  item: Post;
}

const postCoverImageSize = 200;

const PostItem: React.FC<PostItemProps> = ({ item }) => {
  const iconColor = useThemeColor("icon");
  const { navigate } = useNavigation();

  const handlePress = (postId: string) => {
    navigate("PostDetail", { postId: item._id });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.postListItem}>
      <ThemedView style={styles.postListItemInner}>
        <ThemedView style={{ flexDirection: "row" }}>
          <Image
            source={{ uri: item.logoUrl || item.coverImages[0]?.imageUrl }}
            resizeMode="stretch"
            style={styles.postLogo}
          />
          <ThemedView style={styles.calloutTitleContainer}>
            <ThemedView style={styles.calloutOverviewContainer}>
              <ThemedText numberOfLines={1} style={styles.calloutTitle}>
                {item.name}
              </ThemedText>

              <ThemedText numberOfLines={1} style={styles.calloutType}>
                {getPostType?.value}
              </ThemedText>
            </ThemedView>
            <Ionicons name="arrow-forward" size={20} color={iconColor} />
          </ThemedView>
        </ThemedView>

        <ThemedText style={styles.description}>{item.description}</ThemedText>
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
