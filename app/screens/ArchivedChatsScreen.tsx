import React from "react";

import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { distances } from "app/aesthetic/distances";
import { EmptyState } from "app/components/common/EmptyState";
import { Header } from "app/components/common/Header";
import { ThemedView } from "app/components/containers/ThemedView";
import ChatList from "app/components/lists/chat/ChatList";
import { useThemeColor } from "app/hooks/useThemeColor";
import { unarchiveChat } from "app/redux/chat/actions";
import { selectArchivedChats } from "app/redux/chat/selectors";
import { StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export function ArchivedChatsScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const iconColor = useThemeColor("text");
  const archivedChats = useSelector(selectArchivedChats);

  const handleChatPress = (chatId: string) => {
    navigation.navigate("ChatDetail", { chatId });
  };

  const handleUnarchive = (chatId: string) => {
    dispatch(unarchiveChat(chatId));
  };

  if (archivedChats.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <Header
          title="Archived Chats"
          leftIcon={<Entypo name="chevron-left" size={24} color={iconColor} />}
          onLeftPress={() => navigation.goBack()}
        />
        <EmptyState
          icon="archive-outline"
          title="No Archived Chats"
          description="Chats you archive will appear here"
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Header
        title="Archived Chats"
        leftIcon={<Entypo name="chevron-left" size={24} color={iconColor} />}
        onLeftPress={() => navigation.goBack()}
      />
      <ChatList
        chats={archivedChats}
        onChatPress={handleChatPress}
        onUnarchive={handleUnarchive}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: distances.md,
  },
});
