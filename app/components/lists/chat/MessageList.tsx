import React, { forwardRef, useMemo } from "react";

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

const TIME_BETWEEN_GROUPS = 5 * 60 * 1000; // 5 minutes in milliseconds

const MessageList = forwardRef<FlatList, MessageListProps>(
  ({ messages, onMessageLongPress, onVisibleMessagesChanged }, ref) => {
    const groupedMessages = useMemo(() => {
      return messages.map((message, index) => {
        const prevMessage = index > 0 ? messages[index - 1] : null;
        const nextMessage =
          index < messages.length - 1 ? messages[index + 1] : null;

        const timeDiffWithPrev = prevMessage
          ? new Date(message.timestamp).getTime() -
            new Date(prevMessage.timestamp).getTime()
          : Infinity;

        const timeDiffWithNext = nextMessage
          ? new Date(nextMessage.timestamp).getTime() -
            new Date(message.timestamp).getTime()
          : Infinity;

        const isFirstInGroup =
          !prevMessage ||
          prevMessage.sender !== message.sender ||
          timeDiffWithPrev > TIME_BETWEEN_GROUPS;

        const isLastInGroup =
          !nextMessage ||
          nextMessage.sender !== message.sender ||
          timeDiffWithNext > TIME_BETWEEN_GROUPS;

        const showTimestamp =
          isLastInGroup || timeDiffWithNext > TIME_BETWEEN_GROUPS;

        return {
          ...message,
          isFirstInGroup,
          isLastInGroup,
          showTimestamp,
        };
      });
    }, [messages]);

    const renderItem = ({
      item: message,
      index,
    }: {
      item: Message & {
        isFirstInGroup: boolean;
        isLastInGroup: boolean;
        showTimestamp: boolean;
      };
      index: number;
    }) => {
      return (
        <MessageComponent message={message} onLongPress={onMessageLongPress} />
      );
    };

    return (
      <FlatList
        ref={ref}
        data={groupedMessages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
        onContentSizeChange={() => {
          if (ref && "current" in ref && ref.current) {
            ref.current.scrollToEnd({ animated: true });
          }
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
