import React from "react";

import { useNavigation } from "@react-navigation/native";
import { distances } from "app/aesthetic/distances";
import { Header } from "app/components/common/Header";
import { ThemedView } from "app/components/containers/ThemedView";
import ChatList from "app/components/lists/chat/ChatList";
import { StyleSheet } from "react-native";

const mockChats = [
  {
    id: "1",
    title: "John Doe",
    lastMessage: "Hi! Are you still interested in my old books for recycling?",
    timestamp: "2025-01-17T14:00:00Z",
    avatarUrl:
      "https://i.pinimg.com/originals/2a/26/df/2a26df12b8fab576a93f244212cb6673.jpg",
  },
  {
    id: "2",
    title: "Jane Smith",
    lastMessage: "Thanks for the pots! I'll bring the e-waste next time.",
    timestamp: "2025-01-17T13:30:00Z",
    avatarUrl:
      "https://d31atr86jnqrq2.cloudfront.net/Reuse-Recycle-Final-4.jpg?focal=51.8%25+32.95%25&mtime=20220908140828",
  },
  {
    id: "3",
    title: "Local Recycling Hub",
    lastMessage: "Reminder: Drop off your unused items this Friday at 10 AM.",
    timestamp: "2025-01-17T12:45:00Z",
    avatarUrl:
      "https://superstarsbio.com/wp-content/uploads/2020/04/John-Doe-768x1024.jpg",
  },
];

export function ChatsScreen() {
  const navigation = useNavigation();

  const handleChatPress = (chatId: string, chatTitle: string) => {
    navigation.navigate("ChatDetail", { chatId, chatTitle });
  };

  return (
    <ThemedView style={styles.container}>
      <Header title="Chats" />
      <ChatList
        chats={mockChats}
        onChatPress={(chatId, chatTitle) => handleChatPress(chatId, chatTitle)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: distances.md,
    paddingTop: distances.md,
  },
});
