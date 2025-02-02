import React from "react";

import { distances } from "app/aesthetic/distances";
import { Post } from "app/redux/post/types";
import { FlatList, StyleSheet, ViewStyle } from "react-native";

import PostItem from "./PostItem";

interface PostListProps {
  postData: Post[];
  onPostPress: (postId: string) => void;
  style?: ViewStyle;
}

const PostList: React.FC<PostListProps> = ({
  postData,
  onPostPress,
  style,
}) => {
  const renderItem = ({ item }: { item: Post }) => {
    console.log("Rendering post item:", { id: item._id, title: item.title }); // Debug log

    return (
      <PostItem
        item={item}
        onPress={() => {
          console.log("Post item pressed:", {
            id: item._id,
            title: item.title,
          }); // Debug log
          onPostPress(item._id);
        }}
      />
    );
  };

  return (
    <FlatList
      keyboardShouldPersistTaps="handled"
      data={postData}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
      style={[styles.container, style]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  contentContainer: {
    padding: distances.md,
    paddingBottom: distances.lg * 7,
  },
});

export default PostList;
