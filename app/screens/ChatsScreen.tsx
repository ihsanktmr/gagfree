import React, { useState } from "react";

import { useNavigation } from "@react-navigation/native";
import { distances } from "app/aesthetic/distances";
import { SearchHeader } from "app/components/common/SearchHeader";
import { ThemedView } from "app/components/containers/ThemedView";
import ChatList from "app/components/lists/chat/ChatList";
import { archiveChat, setSearchQuery } from "app/redux/chat/actions";
import { selectActiveChats, selectSearchQuery } from "app/redux/chat/selectors";
import { StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

export function ChatsScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showSearch, setShowSearch] = useState(false);
  const searchQuery = useSelector(selectSearchQuery);
  const activeChats = useSelector(selectActiveChats);

  const handleSearchChange = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const handleChatPress = (chatId: string) => {
    navigation.navigate("ChatDetail", { chatId });
  };

  const handleArchive = (chatId: string) => {
    dispatch(archiveChat(chatId));
  };

  const navigateToArchived = () => {
    navigation.navigate("ArchivedChats");
  };

  return (
    <ThemedView style={styles.container}>
      <SearchHeader
        title="Chats"
        showSearch={showSearch}
        onSearchPress={() => setShowSearch(true)}
        onSearchClose={() => {
          setShowSearch(false);
          handleSearchChange("");
        }}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        rightIcon={
          <IconButton
            icon="archive-outline"
            onPress={navigateToArchived}
            size={24}
          />
        }
      />
      <ChatList
        chats={activeChats}
        onChatPress={handleChatPress}
        onArchive={handleArchive}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: distances.md,
  },
});
