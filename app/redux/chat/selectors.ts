import { RootState } from "..";

export const selectAllChats = (state: RootState) => state.chat.chats;

export const selectSearchQuery = (state: RootState) => state.chat.searchQuery;

export const selectActiveChats = (state: RootState) => {
  const query = state.chat.searchQuery.toLowerCase();
  const activeChats = state.chat.chats.filter((chat) => !chat.isArchived);

  if (!query) return activeChats;

  return activeChats.filter(
    (chat) =>
      chat.title.toLowerCase().includes(query) ||
      chat.lastMessage.toLowerCase().includes(query),
  );
};

export const selectArchivedChats = (state: RootState) =>
  state.chat.chats.filter((chat) => chat.isArchived);

export const selectChatById = (id: string) => (state: RootState) =>
  state.chat.chats.find((chat) => chat.id === id);

export const selectUnreadCount = (state: RootState) =>
  state.chat.chats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
