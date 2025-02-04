import React, { forwardRef, useImperativeHandle, useRef } from "react";

import { distances } from "app/aesthetic/distances";
import {
  flatListBottomGap,
  genericSpacing,
} from "app/aesthetic/styleConstants";
import { Message } from "app/redux/chat/types";
import { FlatList } from "react-native";
import { StyleSheet } from "react-native";

import MessageComponent from "./MessageComponent";

interface MessageListProps {
  messages: Message[];
  onMessageLongPress?: (message: Message) => void;
  onVisibleMessagesChanged?: (messages: Message[]) => void;
}

export interface MessageListRef {
  scrollToEnd: () => void;
}

const MessageList = forwardRef<MessageListRef, MessageListProps>(
  (props, ref) => {
    const flatListRef = useRef<FlatList>(null);

    useImperativeHandle(ref, () => ({
      scrollToEnd: () => {
        flatListRef.current?.scrollToEnd({ animated: true });
      },
    }));

    return (
      <FlatList
        ref={flatListRef}
        data={props.messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageComponent
            message={item}
            onLongPress={props.onMessageLongPress}
          />
        )}
        onContentSizeChange={() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }}
        onLayout={() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
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
