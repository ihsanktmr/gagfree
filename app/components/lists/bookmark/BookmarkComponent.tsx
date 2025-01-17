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
  _id: string;
  name: string;
  description: string;
  logoUrl: string;
  coverImages: PostCoverImage[];
}

interface BookmarkComponentProps {
  item: Post;
}

const BookmarkComponent: React.FC<BookmarkComponentProps> = ({ item }) => {
  const iconColor = useThemeColor("icon");
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("PostDetail", { postId: item._id });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.postListItem}>
      <ThemedView style={styles.postListItemInner}>
        <ThemedView style={styles.headerContainer}>
          <Image
            source={{ uri: item.logoUrl || item.coverImages[0]?.imageUrl }}
            resizeMode="stretch"
            style={styles.postLogo}
          />
          <ThemedView style={styles.titleContainer}>
            <ThemedText numberOfLines={1} style={styles.title}>
              {item.name}
            </ThemedText>
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  postLogo: {
    width: 50,
    height: 50,
    borderRadius: borderRadii.medium,
    marginRight: distances.sm,
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: distances.xs,
    paddingRight: distances.xs,
  },
  title: {
    fontSize: 16,
    fontFamily: typography.primary.bold,
    paddingRight: distances.sm,
  },
  description: {
    fontSize: 14,
    fontFamily: typography.secondary.regular,
    marginTop: distances.xs,
  },
});

export default BookmarkComponent;
