import React from "react";

import { distances } from "app/aesthetic/distances";
import { borderRadii } from "app/aesthetic/styleConstants";
import { typography } from "app/aesthetic/typography";
import { ThemedText } from "app/components/texts/ThemedText";
import { useThemeColor } from "app/hooks/useThemeColor";
import { Pressable, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: "user" | "other";
  status?: "sent" | "delivered" | "read"; // Add message status
  isFirstInGroup?: boolean; // Add grouping support
  isLastInGroup?: boolean;
}

interface MessageComponentProps {
  message: Message;
  onLongPress?: (message: Message) => void;
}

const MessageComponent: React.FC<MessageComponentProps> = ({
  message,
  onLongPress,
}) => {
  const mainColor = useThemeColor("main");
  const backgroundColor = useThemeColor(
    message.sender === "user" ? "main" : "icon",
  );
  const textColor =
    message.sender === "user" ? "#FFFFFF" : useThemeColor("text");

  const renderMessageStatus = () => {
    if (message.sender !== "user") return null;

    const getStatusIcon = () => {
      switch (message.status) {
        case "sent":
          return "check";
        case "delivered":
          return "check-all";
        case "read":
          return "check-all";
        default:
          return "clock-outline";
      }
    };

    return (
      <Icon
        name={getStatusIcon()}
        size={14}
        color={message.status === "read" ? mainColor : "rgba(255,255,255,0.7)"}
        style={styles.statusIcon}
      />
    );
  };

  return (
    <View
      style={[
        styles.messageContainer,
        message.sender === "user" ? styles.userMessage : styles.otherMessage,
      ]}
    >
      <Pressable
        onLongPress={() => onLongPress?.(message)}
        style={({ pressed }) => [
          styles.messageBubble,
          {
            backgroundColor,
            opacity: pressed ? 0.9 : 1,
            borderTopLeftRadius:
              message.sender === "other" && !message.isFirstInGroup
                ? borderRadii.small
                : borderRadii.large,
            borderTopRightRadius:
              message.sender === "user" && !message.isFirstInGroup
                ? borderRadii.small
                : borderRadii.large,
            borderBottomLeftRadius:
              message.sender === "other" && !message.isLastInGroup
                ? borderRadii.small
                : borderRadii.large,
            borderBottomRightRadius:
              message.sender === "user" && !message.isLastInGroup
                ? borderRadii.small
                : borderRadii.large,
          },
        ]}
      >
        <ThemedText style={[styles.messageText, { color: textColor }]}>
          {message.text}
        </ThemedText>
        <View style={styles.messageFooter}>
          <ThemedText
            style={[
              styles.timestamp,
              {
                color:
                  message.sender === "user"
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(0,0,0,0.5)",
              },
            ]}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </ThemedText>
          {renderMessageStatus()}
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: distances.xxs,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    marginLeft: "20%",
  },
  otherMessage: {
    alignSelf: "flex-start",
    marginRight: "20%",
  },
  messageBubble: {
    padding: distances.sm,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  messageText: {
    fontFamily: typography.primary.regular,
    fontSize: 15,
    lineHeight: 20,
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  timestamp: {
    fontSize: 11,
    fontFamily: typography.secondary.regular,
    marginRight: 4,
  },
  statusIcon: {
    marginLeft: 2,
  },
});

export default MessageComponent;
