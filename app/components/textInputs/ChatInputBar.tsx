import React, { useState } from "react";

import Feather from "@expo/vector-icons/Feather";
import { distances } from "app/aesthetic/distances";
import { borderRadii } from "app/aesthetic/styleConstants";
import { typography } from "app/aesthetic/typography";
import { useThemeColor } from "app/hooks/useThemeColor";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";

import { ThemedView } from "../containers/ThemedView";

interface ChatInputBarProps {
  onSendMessage: (text: string) => void;
}

const ChatInputBar: React.FC<ChatInputBarProps> = ({ onSendMessage }) => {
  const [text, setText] = useState("");
  const textColor = useThemeColor("text");
  const mainColor = useThemeColor("main");
  const blueColor = useThemeColor("blue");

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text.trim());
      setText("");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={{ ...styles.input, color: blueColor }}
        value={text}
        onChangeText={setText}
        placeholder="Type a message..."
        placeholderTextColor={textColor}
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Feather name="send" size={24} color={mainColor} />
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: distances.md,
    paddingVertical: distances.sm,
    borderTopWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  input: {
    flex: 1,
    fontFamily: typography.primary.bold,
    marginRight: distances.sm,
    padding: distances.xs,
    borderRadius: borderRadii.small,
  },
  sendButton: {
    paddingHorizontal: distances.lg,
    borderRadius: borderRadii.small,
  },
});

export default ChatInputBar;
