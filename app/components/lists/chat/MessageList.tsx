import React from "react";

import { FlatList, StyleSheet } from "react-native";

import MessageComponent from "./MessageComponent";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: "user" | "other";
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <FlatList
      data={messages}
      renderItem={({ item }) => <MessageComponent message={item} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
});

export default MessageList;
