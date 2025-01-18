import React from "react";

import { distances } from "app/aesthetic/distances";
import { typography } from "app/aesthetic/typography";
import { ThemedView } from "app/components/containers/ThemedView";
import { ThemedText } from "app/components/texts/ThemedText";
import { useThemeColor } from "app/hooks/useThemeColor";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string; // ISO format
  avatarUrl: string;
}

interface ChatComponentProps {
  chat: Chat;
  onPress: (chatId: string) => void;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ chat, onPress }) => {
  const textColor = useThemeColor("text");
  const formattedTimestamp = new Date(chat.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <ThemedView style={styles.chatDetails}>
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => onPress(chat.id)}
      >
        <Image source={{ uri: chat.avatarUrl }} style={styles.avatar} />
        <ThemedView style={styles.chatDetails}>
          <ThemedText style={styles.title}>{chat.title}</ThemedText>
          <ThemedText numberOfLines={1} style={styles.lastMessage}>
            {chat.lastMessage}
          </ThemedText>
        </ThemedView>
        <ThemedText style={[styles.timestamp, { color: textColor }]}>
          {formattedTimestamp}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: distances.md,
  },
  chatDetails: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: typography.primary.bold,
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: typography.secondary.regular,
    color: "gray",
  },
  timestamp: {
    fontSize: 12,
    fontFamily: typography.secondary.regular,
  },
});

export default ChatComponent;
