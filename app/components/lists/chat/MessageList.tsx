import React, { forwardRef, useEffect, useRef, useState } from "react";

import { distances } from "app/aesthetic/distances";
import {
  flatListBottomGap,
  genericSpacing,
} from "app/aesthetic/styleConstants";
import { FlatList, StyleSheet, ViewToken } from "react-native";

import MessageComponent from "./MessageComponent";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: "user" | "other";
  status?: "sent" | "delivered" | "read";
}

interface MessageListProps {
  messages: Message[];
  onMessageLongPress?: (message: Message) => void;
  onVisibleMessagesChanged?: (messages: Message[]) => void;
}

const MessageList = forwardRef<FlatList, MessageListProps>(
  ({ messages, onMessageLongPress, onVisibleMessagesChanged }, ref) => {
    const [visibleMessages, setVisibleMessages] = useState<string[]>([]);
    const previousMessagesLength = useRef(messages.length);

    useEffect(() => {
      // Check if new messages were added
      if (messages.length > previousMessagesLength.current) {
        // If the last message is from the user, scroll to bottom
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.sender === "user") {
          setTimeout(() => {
            if (ref && "current" in ref && ref.current) {
              ref.current.scrollToEnd({ animated: true });
            }
          }, 100); // Small delay to ensure render is complete
        }
      }
      previousMessagesLength.current = messages.length;
    }, [messages]);

    const onViewableItemsChanged = ({
      viewableItems,
    }: {
      viewableItems: ViewToken[];
    }) => {
      const visibleMessageIds = viewableItems.map((item) => item.key as string);
      setVisibleMessages(visibleMessageIds);

      if (onVisibleMessagesChanged) {
        const visibleMessageObjects = messages.filter((msg) =>
          visibleMessageIds.includes(msg.id),
        );
        onVisibleMessagesChanged(visibleMessageObjects);
      }
    };

    const getMessageGrouping = (index: number) => {
      const currentMessage = messages[index];
      const prevMessage = index > 0 ? messages[index - 1] : null;
      const nextMessage =
        index < messages.length - 1 ? messages[index + 1] : null;

      const isFirstInGroup =
        !prevMessage ||
        prevMessage.sender !== currentMessage.sender ||
        new Date(currentMessage.timestamp).getTime() -
          new Date(prevMessage.timestamp).getTime() >
          60000;

      const isLastInGroup =
        !nextMessage ||
        nextMessage.sender !== currentMessage.sender ||
        new Date(nextMessage.timestamp).getTime() -
          new Date(currentMessage.timestamp).getTime() >
          60000;

      return { isFirstInGroup, isLastInGroup };
    };

    return (
      <FlatList
        ref={ref}
        data={messages}
        renderItem={({ item, index }) => (
          <MessageComponent
            message={{
              ...item,
              ...getMessageGrouping(index),
            }}
            onLongPress={onMessageLongPress}
          />
        )}
        keyExtractor={(item) => item.id}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={21}
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
