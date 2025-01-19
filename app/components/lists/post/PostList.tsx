import React from "react";

import { Post } from "app/redux/post/types";
import { FlatList, StyleSheet } from "react-native";

import PostItem from "./PostItem";

interface PostListProps {
  postData: Post[];
}

const PostList: React.FC<PostListProps> = ({ postData, style }) => {
  const renderItem = ({ item }: { item: Post }) => <PostItem item={item} />;

  return (
    <FlatList
      keyboardShouldPersistTaps="handled"
      data={postData}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
      style={{ ...styles.container, ...style }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 150,
    paddingTop: 110,
  },
});

export default PostList;
