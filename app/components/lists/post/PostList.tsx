import React from "react";

import { distances } from "app/aesthetic/distances";
import { Post } from "app/redux/post/types";
import { FlatList, StyleSheet, ViewStyle } from "react-native";

import PostItem from "./PostItem";

interface PostListProps {
  postData: Post[];
  style?: ViewStyle;
}

const PostList: React.FC<PostListProps> = ({ postData, style }) => {
  const renderItem = ({ item }: { item: Post }) => <PostItem item={item} />;

  return (
    <FlatList
      keyboardShouldPersistTaps="handled"
      data={postData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
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
  },
});

export default PostList;
