import React, { forwardRef } from "react";

import { distances } from "app/aesthetic/distances";
import {
  flatListBottomGap,
  genericSpacing,
} from "app/aesthetic/styleConstants";
import { List, ListRef } from "app/components/common/List";
import { Message } from "app/redux/chat/types";
import { StyleSheet } from "react-native";

import MessageComponent from "./MessageComponent";

interface MessageListProps {
  messages: Message[];
  onMessageLongPress?: (message: Message) => void;
  onVisibleMessagesChanged?: (messages: Message[]) => void;
}

const MessageList = forwardRef<ListRef, MessageListProps>(
  ({ messages, onMessageLongPress, onVisibleMessagesChanged }, ref) => {
    return (
      <List<Message>
        ref={ref}
        data={messages}
        renderItem={(item) => (
          <MessageComponent message={item} onLongPress={onMessageLongPress} />
        )}
        keyExtractor={(item) => item.id}
        autoScroll
        maintainPosition
        listStyle={styles.container}
        contentContainerStyle={styles.contentContainer}
      />
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: distances.lg,
    paddingBottom: flatListBottomGap,
    paddingHorizontal: genericSpacing,
  },
});

export default MessageList;
