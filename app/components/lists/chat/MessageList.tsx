import React, { forwardRef } from "react";

import { distances } from "app/aesthetic/distances";
import {
  flatListBottomGap,
  genericSpacing,
} from "app/aesthetic/styleConstants";
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

const MessageList = forwardRef(({ messages }: MessageListProps, ref) => {
  return (
    <FlatList
      ref={ref}
      data={messages}
      renderItem={({ item }) => <MessageComponent message={item} />}
      keyExtractor={(item) => item.id}
      style={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: distances.lg,
    paddingBottom: flatListBottomGap,
    paddingHorizontal: genericSpacing,
  },
});

export default MessageList;
