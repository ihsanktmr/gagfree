import React, { useCallback, useEffect, useState } from "react";

import { distances } from "app/aesthetic/distances";
import { AddPostModal } from "app/components/postComponents/AddPostModal";
import { PostsContent } from "app/components/postComponents/PostsContent";
import { PostsHeader } from "app/components/postComponents/PostsHeader";
import { MOCK_POSTS } from "app/data/mockPosts";
import { usePostForm } from "app/hooks/usePostForm";
import { usePostsData } from "app/hooks/usePostsData";
import { useThemeColor } from "app/hooks/useThemeColor";
import { initializePosts, setPosts } from "app/redux/post/actions";
import { selectTheme } from "app/redux/theme/selectors";
import { StyleSheet, View } from "react-native";
import { Region } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";

interface PostsScreenProps {
  initialRegion: Region;
}

export const PostsScreen: React.FC<PostsScreenProps> = ({ initialRegion }) => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const backgroundColor = useThemeColor("background");

  const [view, setView] = useState<"map" | "list">("map");
  const [showSearch, setShowSearch] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  // Load mock data when component mounts
  useEffect(() => {
    dispatch(initializePosts());
  }, [dispatch]);

  useEffect(() => {
    if (__DEV__) {
      dispatch(setPosts(MOCK_POSTS));
    }
  }, [dispatch]);

  const {
    posts,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = usePostsData();

  // Debug logs for filtered posts
  useEffect(() => {
    console.log("PostsScreen - Current state:", {
      totalPosts: posts.length,
      selectedCategory,
      postsInView: posts.map((p) => ({
        id: p._id,
        title: p.title,
        category: p.category,
      })),
    });
  }, [posts, selectedCategory]);

  const handleSuccess = useCallback(() => {
    setAddModalVisible(false);
  }, []);

  const postForm = usePostForm(handleSuccess);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <PostsHeader
        view={view}
        setView={setView}
        showSearch={showSearch}
        setShowSearch={setShowSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <PostsContent
        view={view}
        posts={posts}
        initialRegion={initialRegion}
        theme={theme}
        onAddPress={() => setAddModalVisible(true)}
      />

      <AddPostModal
        visible={addModalVisible}
        onDismiss={() => setAddModalVisible(false)}
        {...postForm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: distances.md,
  },
});

export default PostsScreen;
