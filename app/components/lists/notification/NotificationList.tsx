import React from "react";

import { typography } from "app/aesthetic/typography";
import { ThemedText } from "app/components/texts/ThemedText";
import { useThemeColor } from "app/hooks/useThemeColor";
import { FlatList, StyleSheet } from "react-native";

import NotificationComponent, { Notification } from "./NotificationComponent";

interface NotificationListProps {
  notifications: Notification[];
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
}) => {
  const backgroundColor = useThemeColor("background");

  return (
    <FlatList
      data={notifications}
      renderItem={({ item }) => <NotificationComponent notification={item} />}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <ThemedText style={styles.emptyMessage}>
          No notifications available.
        </ThemedText>
      }
      contentContainerStyle={[styles.contentContainer, { backgroundColor }]}
      style={[styles.container, { backgroundColor }]}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 30,
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: typography.primary.bold,
    width: "100%",
  },
});

export default NotificationList;
