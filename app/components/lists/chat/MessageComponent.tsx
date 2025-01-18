import React from "react";

import { distances } from "app/aesthetic/distances";
import { borderRadii } from "app/aesthetic/styleConstants";
import { typography } from "app/aesthetic/typography";
import { ThemedText } from "app/components/texts/ThemedText";
import { useThemeColor } from "app/hooks/useThemeColor";
import { StyleSheet, View } from "react-native";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: "user" | "other"; // Indicates if the message is sent by the user or someone else
}

interface MessageComponentProps {
  message: Message;
}

const MessageComponent: React.FC<MessageComponentProps> = ({ message }) => {
  const backgroundColor = useThemeColor(
    message.sender === "user" ? "text" : "background",
  );
  const textColor = useThemeColor(
    message.sender === "user" ? "text" : "background",
  );

  return (
    <View
      style={[
        styles.messageContainer,
        message.sender === "user" ? styles.userMessage : styles.otherMessage,
      ]}
    >
      <ThemedText
        style={[styles.messageText, { backgroundColor, color: textColor }]}
      >
        {message.text}
      </ThemedText>
      <ThemedText style={styles.timestamp}>
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: distances.xs,
  },
  userMessage: {
    alignSelf: "flex-end",
  },
  otherMessage: {
    alignSelf: "flex-start",
  },
  messageText: {
    paddingHorizontal: distances.sm,
    paddingVertical: distances.xs,
    borderRadius: borderRadii.medium,
    fontFamily: typography.primary.regular,
    fontSize: 14,
    maxWidth: "80%",
  },
  timestamp: {
    fontSize: 10,
    fontFamily: typography.secondary.regular,
    marginTop: distances.xxs,
    alignSelf: "flex-end",
  },
});

export default MessageComponent;
