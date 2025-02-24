import React, { useEffect, useState } from "react";

import { useQuery } from "@apollo/client";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { distances } from "app/aesthetic/distances";
import { SearchHeader } from "app/components/common/SearchHeader";
import { ThemedView } from "app/components/containers/ThemedView";
import ChatList from "app/components/lists/chat/ChatList";
import { RootStackParamList } from "app/navigation/types";
import { archiveChat, setChats, setSearchQuery } from "app/redux/chat/actions";
import { selectActiveChats, selectSearchQuery } from "app/redux/chat/selectors";
import { StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { GET_CONVERSATIONS } from "../services/chatServices";

type NavigationProps = NavigationProp<RootStackParamList>;

export function ChatsScreen() {
  const navigation = useNavigation<NavigationProps>();
  const dispatch = useDispatch();
  const [showSearch, setShowSearch] = useState(false);
  const searchQuery = useSelector(selectSearchQuery);
  const activeChats = useSelector(selectActiveChats);
  const { data, loading, error } = useQuery(GET_CONVERSATIONS);

  // Transform the data to match our Redux state shape
  const conversations =
    data?.conversations.map((conv) => ({
      id: conv.id,
      title: conv.participants[0].username, // Assuming other participant
      lastMessage: conv.lastMessage?.content || "",
      timestamp: conv.lastMessage?.createdAt || conv.updatedAt,
      avatarUrl: conv.participants[0].avatar,
      isArchived: false, // Handle this based on your backend
      unreadCount: conv.unreadCount,
      isOnline: false, // Handle this if you have online status
    })) || [];

  useEffect(() => {
    if (conversations.length > 0) {
      dispatch(setChats(conversations));
    }
  }, [conversations]);

  const handleSearchChange = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const handleChatPress = (chatId: string) => {
    navigation.navigate("ChatDetail", {
      chatId,
      postId: "mock-post-id", // Mock data
      title: "Chat", // Default title
      otherUserId: "mock-user-id", // Mock data
    });
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
