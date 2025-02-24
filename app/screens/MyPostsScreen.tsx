import React from "react";

import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EmptyState } from "app/components/common/EmptyState";
import { Header } from "app/components/common/Header";
import { LoadingSpinner } from "app/components/common/LoadingSpinner";
import { ThemedView } from "app/components/containers/ThemedView";
import { PostCard } from "app/components/profile/PostCard";
import { RootStackParamList } from "app/navigation/types";
import { selectUser } from "app/redux/auth/selectors";
import { Post } from "app/redux/post/types";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

// Define the GraphQL query
export const GET_USER_POSTS = gql`
  query GetUserPosts($userId: ID!) {
    userPosts(userId: $userId) {
      id
      title
      description
      price
      images
      location
      createdAt
      updatedAt
      views
      likes
      user {
        id
        username
        avatar
      }
    }
  }
`;

type MyPostsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const MyPostsScreen = () => {
  const navigation = useNavigation<MyPostsNavigationProp>();
  const user = useSelector(selectUser);
  const { data, loading, error, refetch } = useQuery(GET_USER_POSTS, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  const renderItem = ({ item }: { item: Post }) => (
    <PostCard
      post={item}
      onPress={() => navigation.navigate("PostDetail", { postId: item.id })}
    />
  );

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <EmptyState
        icon="alert-circle"
        title="Error loading posts"
        description="Something went wrong while loading your posts"
        iconSize={56}
      />
    );

  return (
    <ThemedView style={styles.container}>
      <Header title="My Posts" />
      <FlatList
        data={data?.userPosts || []}
        renderItem={renderItem}
        keyExtractor={(item: Post) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="post"
            title="No Posts Yet"
            description="You haven't created any posts yet"
            buttonText="Create Post"
            onButtonPress={() =>
              navigation.navigate("PostDetail", { postId: "new" })
            }
          />
        }
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
});
