import React, { useEffect, useRef, useState } from "react";

import { useMutation, useQuery, useSubscription } from "@apollo/client";
import Entypo from "@expo/vector-icons/build/Entypo";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { isIos } from "app/appInfo";
import { Header } from "app/components/common/Header";
import { ThemedView } from "app/components/containers/ThemedView";
import MessageList, {
  MessageListRef,
} from "app/components/lists/chat/MessageList";
import ChatInputBar from "app/components/textInputs/ChatInputBar";
import { useThemeColor } from "app/hooks/useThemeColor";
import { RootStackParamList } from "app/navigation/types";
import { archiveChat } from "app/redux/chat/actions";
import { Message, MessageSender } from "app/redux/chat/types";
import { Alert, KeyboardAvoidingView, Share, StyleSheet } from "react-native";
import { Menu } from "react-native-paper";
import { useDispatch } from "react-redux";

import {
  GET_CONVERSATION,
  MARK_AS_READ,
  MESSAGE_SUBSCRIPTION,
  SEND_MESSAGE,
} from "../services/chatServices";

const mockMessages: Message[] = [
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

type ChatDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ChatDetail"
>;

type ChatDetailScreenRouteProp = RouteProp<RootStackParamList, "ChatDetail">;

export function ChatDetailScreen() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation<ChatDetailScreenNavigationProp>();
  const route = useRoute<ChatDetailScreenRouteProp>();
  const dispatch = useDispatch();
  const { chatId, title: chatTitle, otherUserId, postId } = route.params;

  const iconColor = useThemeColor("icon");
  const backgroundColor = useThemeColor("background");
  const messageListRef = useRef<MessageListRef>(null);

  const { data, loading, error } = useQuery(GET_CONVERSATION, {
    variables: { id: chatId },
  });

  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [markAsRead] = useMutation(MARK_AS_READ);

  useSubscription(MESSAGE_SUBSCRIPTION, {
    variables: { conversationId: chatId },
    onData: ({ data }) => {
      if (data?.messageReceived) {
        // Add new message to the list
        setMessages((prev) => [
          ...prev,
          transformMessage(data.messageReceived),
        ]);
        messageListRef.current?.scrollToEnd();
      }
    },
  });

  useEffect(() => {
    if (data?.conversation) {
      // Mark conversation as read when opened
      markAsRead({ variables: { id: chatId } });

      // Transform messages to our format
      const transformedMessages =
        data.conversation.messages.map(transformMessage);
      setMessages(transformedMessages);
    }
  }, [data]);

  const handleGoBack = () => navigation.goBack();

  const handleMenuDismiss = () => setMenuVisible(false);

  const handleArchiveChat = () => {
    Alert.alert(
      "Archive Chat",
      "Are you sure you want to archive this conversation?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Archive",
          style: "destructive",
          onPress: () => {
            dispatch(archiveChat(chatId));
            navigation.goBack();
          },
        },
      ],
    );
    handleMenuDismiss();
  };

  const handleBlockUser = () => {
    Alert.alert("Block User", "Are you sure you want to block this user?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Block",
        style: "destructive",
        onPress: () => {
          // Add block user logic here
          navigation.goBack();
        },
      },
    ]);
    handleMenuDismiss();
  };

  const handleReportUser = () => {
    Alert.alert("Report User", "Are you sure you want to report this user?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Report",
        style: "destructive",
        onPress: () => {
          // Add report user logic here
          navigation.goBack();
        },
      },
    ]);
    handleMenuDismiss();
  };

  const handleClearChat = () => {
    Alert.alert(
      "Clear Chat",
      "Are you sure you want to clear all messages? This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => setMessages([]),
        },
      ],
    );
    handleMenuDismiss();
  };

  const handleShareChat = async () => {
    try {
      await Share.share({
        message: `Chat history with ${chatTitle}`,
        // You might want to format the messages here
      });
    } catch (error) {
      console.error("Error sharing chat:", error);
    }
    handleMenuDismiss();
  };

  const renderHeaderRight = () => (
    <Menu
      visible={menuVisible}
      onDismiss={handleMenuDismiss}
      anchor={
        <Entypo
          name="dots-three-vertical"
          size={20}
          color={iconColor}
          onPress={() => setMenuVisible(true)}
        />
      }
    >
      <Menu.Item
        onPress={handleArchiveChat}
        title="Archive Chat"
        leadingIcon="archive"
      />
      <Menu.Item
        onPress={handleClearChat}
        title="Clear Chat"
        leadingIcon="delete"
      />
      <Menu.Item
        onPress={handleShareChat}
        title="Share Chat"
        leadingIcon="share"
      />
      <Menu.Item
        onPress={handleBlockUser}
        title="Block User"
        leadingIcon="block"
      />
      <Menu.Item
        onPress={handleReportUser}
        title="Report User"
        leadingIcon="flag"
        titleStyle={{ color: "red" }}
      />
    </Menu>
  );

  const handleSendMessage = async (text: string) => {
    try {
      await sendMessage({
        variables: {
          input: {
            content: text,
            receiverId: otherUserId,
            itemId: postId,
          },
        },
      });
    } catch (error) {
      Alert.alert("Error", "Failed to send message");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Header
        title={chatTitle || "Chat"}
        leftIcon={<Entypo name="chevron-left" size={24} color={iconColor} />}
        onLeftPress={handleGoBack}
        rightIcon={renderHeaderRight()}
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={isIos ? "padding" : undefined}
        keyboardVerticalOffset={60}
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

const transformMessage = (message: any): Message => ({
  id: message.id,
  text: message.content,
  timestamp: message.createdAt,
  sender: message.sender.id === userId ? "user" : "other",
});

export default ChatDetailScreen;
