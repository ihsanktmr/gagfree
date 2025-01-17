import React from "react";

import { typography } from "app/aesthetic/typography";
import { ThemedText } from "app/components/texts/ThemedText";
import { useThemeColor } from "app/hooks/useThemeColor";
import { i18n } from "app/language";
import { FlatList, StyleSheet } from "react-native";

import NotificationComponent from "./NotificationComponent";

interface Notification {
  id: string;
  message: string;
  timestamp: string; // ISO string format
  iconName: string;
}

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
          {/*  {i18n.t("notificationEmptyText", "No notifications available.")} */}
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
