import React from "react";

import { List } from "app/components/common/List";
import { useThemeColor } from "app/hooks/useThemeColor";
import { Chat } from "app/redux/chat/types";
import { StyleSheet, View } from "react-native";

import ChatComponent from "./ChatComponent";

interface ChatListProps {
  chats: Chat[];
  onChatPress: (chatId: string) => void;
  onArchive?: (chatId: string) => void;
  onUnarchive?: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  onChatPress,
  onArchive,
  onUnarchive,
}) => {
  const backgroundColor = useThemeColor("background");

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <List<Chat>
        data={chats}
        renderItem={(item) => (
          <ChatComponent
            chat={item}
            onPress={onChatPress}
            onArchive={onArchive}
            onUnarchive={onUnarchive}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});

export default ChatList;
