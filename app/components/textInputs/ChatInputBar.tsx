import React, { useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { distances } from "app/aesthetic/distances";
import { borderRadii } from "app/aesthetic/styleConstants";
import { useThemeColor } from "app/hooks/useThemeColor";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface ChatInputBarProps {
  onSendMessage: (text: string) => void;
}

const ChatInputBar: React.FC<ChatInputBarProps> = ({ onSendMessage }) => {
  const [text, setText] = useState("");
  const backgroundColor = useThemeColor("tabIconDefault");
  const iconColor = useThemeColor("icon");

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text.trim());
      setText("");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type a message..."
        placeholderTextColor="gray"
      />
      <TouchableOpacity onPress={handleSend}>
        <Ionicons name="send" size={24} color={iconColor} />
      </TouchableOpacity>
    </View>
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
    marginRight: distances.sm,
    padding: distances.xs,
    borderRadius: borderRadii.small,
  },
});

export default ChatInputBar;
