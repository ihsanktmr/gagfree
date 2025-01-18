import React from "react";

import { FlatList, StyleSheet } from "react-native";

import ChatComponent from "./ChatComponent";

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string; // ISO format
  avatarUrl: string;
}

interface ChatListProps {
  chats: Chat[];
  onChatPress: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, onChatPress }) => {
  return (
    <FlatList
      data={chats}
      renderItem={({ item }) => (
        <ChatComponent chat={item} onPress={onChatPress} />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 10,
  },
});

export default ChatList;
