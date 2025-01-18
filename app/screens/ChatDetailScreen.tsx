import React, { useState } from "react";

import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Header } from "app/components/common/Header";
import MessageList from "app/components/lists/chat/MessageList";
import ChatInputBar from "app/components/textInputs/ChatInputBar";
import { useThemeColor } from "app/hooks/useThemeColor";
import { StyleSheet, View } from "react-native";

const mockMessages = [
  {
    id: "1",
    text: "Hey! How's it going?",
    timestamp: "2025-01-17T14:00:00Z",
    sender: "other",
  },
  {
    id: "2",
    text: "All good, thanks! What about you?",
    timestamp: "2025-01-17T14:02:00Z",
    sender: "user",
  },
];

export function ChatDetailScreen() {
  const [messages, setMessages] = useState(mockMessages);
  const navigation = useNavigation();
  const route = useRoute();
  const iconColor = useThemeColor("icon");

  const handleGoBack = () => navigation.goBack();

  const handleSendMessage = (text: string) => {
    const newMessage = {
      id: (messages.length + 1).toString(),
      text,
      timestamp: new Date().toISOString(),
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <View style={styles.container}>
      <Header
        title={route.params?.chatTitle || "Chat"}
        leftIcon={<Ionicons name="chevron-left" size={24} color={iconColor} />}
        onLeftPress={handleGoBack}
      />
      <MessageList messages={messages} />
      <ChatInputBar onSendMessage={handleSendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatDetailScreen;
