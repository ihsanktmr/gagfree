import React from "react";

import { distances } from "app/aesthetic/distances";
import { typography } from "app/aesthetic/typography";
import { ThemedView } from "app/components/containers/ThemedView";
import { ThemedText } from "app/components/texts/ThemedText";
import { useThemeColor } from "app/hooks/useThemeColor";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Badge } from "react-native-paper";

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string; // ISO format
  avatarUrl: string;
  unreadCount?: number;
  isOnline?: boolean;
}

interface ChatComponentProps {
  chat: Chat;
  onPress: (chatId: string) => void;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ chat, onPress }) => {
  const textColor = useThemeColor("text");
  const mainColor = useThemeColor("main");

  const formattedTimestamp = new Date(chat.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => onPress(chat.id)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: chat.avatarUrl }} style={styles.avatar} />
        {chat.isOnline && (
          <View
            style={[styles.onlineIndicator, { backgroundColor: mainColor }]}
          />
        )}
      </View>

      <ThemedView style={styles.chatDetails}>
        <View style={styles.headerRow}>
          <ThemedText style={styles.title}>{chat.title}</ThemedText>
          <ThemedText style={[styles.timestamp, { color: textColor }]}>
            {formattedTimestamp}
          </ThemedText>
        </View>

        <View style={styles.messageRow}>
          <ThemedText
            numberOfLines={1}
            style={[
              styles.lastMessage,
              chat.unreadCount ? styles.unreadMessage : null,
            ]}
          >
            {chat.lastMessage}
          </ThemedText>
          {chat.unreadCount ? (
            <Badge
              size={20}
              style={[styles.badge, { backgroundColor: mainColor }]}
            >
              {chat.unreadCount}
            </Badge>
          ) : null}
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: distances.md,
    marginBottom: distances.sm,
    borderBottomWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  avatarContainer: {
    position: "relative",
    marginRight: distances.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "white",
  },
  chatDetails: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  messageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontFamily: typography.primary.bold,
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    fontFamily: typography.secondary.regular,
    color: "gray",
    marginRight: distances.sm,
  },
  unreadMessage: {
    fontFamily: typography.secondary.medium,
    color: "black",
  },
  timestamp: {
    fontSize: 12,
    fontFamily: typography.secondary.regular,
  },
  badge: {
    marginLeft: distances.xs,
  },
});

export default ChatComponent;
