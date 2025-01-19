import React, { useRef, useState } from "react";

import Entypo from "@expo/vector-icons/build/Entypo";
import { useNavigation, useRoute } from "@react-navigation/native";
import { isIos } from "app/appInfo";
import { Header } from "app/components/common/Header";
import { ThemedView } from "app/components/containers/ThemedView";
import MessageList from "app/components/lists/chat/MessageList";
import ChatInputBar from "app/components/textInputs/ChatInputBar";
import { useThemeColor } from "app/hooks/useThemeColor";
import { KeyboardAvoidingView, StyleSheet } from "react-native";

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
  const { chatId, chatTitle } = route.params;

  const iconColor = useThemeColor("icon");
  const backgroundColor = useThemeColor("background");
  const messageListRef = useRef<any>(null); // Ref for MessageList

  const handleGoBack = () => navigation.goBack();

  const handleSendMessage = (text: string) => {
    const newMessage = {
      id: (messages.length + 1).toString(),
      text,
      timestamp: new Date().toISOString(),
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Scroll to the bottom after adding a new message
    if (messageListRef.current) {
      messageListRef.current.scrollToEnd();
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Header
        title={chatTitle || "Chat"}
        leftIcon={<Entypo name="chevron-left" size={24} color={iconColor} />}
        onLeftPress={handleGoBack}
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={isIos ? "padding" : undefined}
        keyboardVerticalOffset={60} // Adjust based on Header height
      >
        <ThemedView style={styles.chatContent}>
          <MessageList ref={messageListRef} messages={messages} />
        </ThemedView>
        <ChatInputBar onSendMessage={handleSendMessage} />
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  chatContent: {
    flexGrow: 1,
  },
});

export default ChatDetailScreen;
