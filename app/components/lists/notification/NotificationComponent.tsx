import React from "react";

import { Ionicons } from "@expo/vector-icons";
import { distances } from "app/aesthetic/distances";
import { borderRadii } from "app/aesthetic/styleConstants";
import { typography } from "app/aesthetic/typography";
import { ThemedView } from "app/components/containers/ThemedView";
import { ThemedText } from "app/components/texts/ThemedText";
import { useThemeColor } from "app/hooks/useThemeColor";
import { StyleSheet, TouchableOpacity } from "react-native";

interface Notification {
  id: string;
  message: string;
  timestamp: string; // ISO string
  iconName: string;
}

interface NotificationComponentProps {
  notification: Notification;
}

const NotificationComponent: React.FC<NotificationComponentProps> = ({
  notification,
}) => {
  const textColor = useThemeColor("text");
  const iconColor = useThemeColor("icon");

  const formattedTimestamp = new Date(notification.timestamp).toLocaleString(); // Adjust formatting as needed

  return (
    <TouchableOpacity style={styles.notificationItem}>
      <ThemedView style={styles.notificationItemInner}>
        <Ionicons
          name={notification.iconName}
          size={24}
          color={iconColor}
          style={styles.icon}
        />
        <ThemedView style={styles.textContainer}>
          <ThemedText style={styles.message}>{notification.message}</ThemedText>
          <ThemedText style={[styles.timestamp, { color: textColor }]}>
            {formattedTimestamp}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  notificationItem: {
    borderRadius: borderRadii.medium,
    padding: distances.md,
    marginBottom: distances.sm,
    flexDirection: "row",
    alignItems: "center",
  },
  notificationItemInner: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginRight: distances.md,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    fontFamily: typography.primary.bold,
  },
  timestamp: {
    fontSize: 14,
    fontFamily: typography.secondary.regular,
    marginTop: distances.xxs,
  },
});

export default NotificationComponent;
