import React from "react";

import { Post } from "app/redux/post/types";
import { format } from "date-fns";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Card, Text, useTheme } from "react-native-paper";

interface PostCardProps {
  post: Post;
  onPress: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPress }) => {
  const theme = useTheme();

  return (
    <Card style={styles.card} onPress={onPress}>
      {post.images && post.images.length > 0 && (
        <Card.Cover source={{ uri: post.images[0] }} style={styles.image} />
      )}
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Avatar.Image
              size={40}
              source={post.user.avatar ? { uri: post.user.avatar } : null}
            />
            <View style={styles.userText}>
              <Text style={styles.username}>{post.user.username}</Text>
              <Text style={styles.date}>
                {format(new Date(post.createdAt), "MMM d, yyyy")}
              </Text>
            </View>
          </View>
          <Text style={[styles.price, { color: theme.colors.primary }]}>
            ${post.price.toFixed(2)}
          </Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {post.title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {post.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.location}>
            <Text style={styles.locationText}>{post.location}</Text>
          </View>
          <View style={styles.stats}>
            <Text style={styles.statsText}>{post.views} views</Text>
            <Text style={styles.statsText}>{post.likes} likes</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  image: {
    height: 200,
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userText: {
    marginLeft: 12,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  date: {
    fontSize: 12,
    opacity: 0.7,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 12,
    opacity: 0.7,
  },
  stats: {
    flexDirection: "row",
    gap: 12,
  },
  statsText: {
    fontSize: 12,
    opacity: 0.7,
  },
});
