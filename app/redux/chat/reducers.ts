import { createReducer } from "@reduxjs/toolkit";

import {
  archiveChat,
  deleteChat,
  markChatAsRead,
  setChats,
  setSearchQuery,
  unarchiveChat,
} from "./actions";
import { ChatState } from "./types";

const mockChats = [
  {
    id: "1",
    title: "John Doe",
    lastMessage: "Hi! Are you still interested in my old books for recycling?",
    timestamp: "2025-01-17T14:00:00Z",
    avatarUrl:
      "https://i.pinimg.com/originals/2a/26/df/2a26df12b8fab576a93f244212cb6673.jpg",
    isArchived: false,
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "2",
    title: "Jane Smith",
    lastMessage: "Thanks for the pots! I'll bring the e-waste next time.",
    timestamp: "2025-01-17T13:30:00Z",
    avatarUrl:
      "https://d31atr86jnqrq2.cloudfront.net/Reuse-Recycle-Final-4.jpg?focal=51.8%25+32.95%25&mtime=20220908140828",
    isArchived: false,
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "3",
    title: "Local Recycling Hub",
    lastMessage: "Reminder: Drop off your unused items this Friday at 10 AM.",
    timestamp: "2025-01-17T12:45:00Z",
    avatarUrl:
      "https://superstarsbio.com/wp-content/uploads/2020/04/John-Doe-768x1024.jpg",
    isArchived: false,
    unreadCount: 1,
    isOnline: true,
  },
];

const initialState: ChatState = {
  chats: mockChats,
  loading: false,
  error: null,
  searchQuery: "",
};

const chatReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setChats, (state, action) => {
      state.chats = action.payload;
    })
    .addCase(archiveChat, (state, action) => {
      const chatIndex = state.chats.findIndex(
        (chat) => chat.id === action.payload,
      );
      if (chatIndex !== -1) {
        state.chats[chatIndex].isArchived = true;
      }
    })
    .addCase(unarchiveChat, (state, action) => {
      const chatIndex = state.chats.findIndex(
        (chat) => chat.id === action.payload,
      );
      if (chatIndex !== -1) {
        state.chats[chatIndex].isArchived = false;
      }
    })
    .addCase(markChatAsRead, (state, action) => {
      const chatIndex = state.chats.findIndex(
        (chat) => chat.id === action.payload,
      );
      if (chatIndex !== -1) {
        state.chats[chatIndex].unreadCount = 0;
      }
    })
    .addCase(setSearchQuery, (state, action) => {
      state.searchQuery = action.payload;
    })
    .addCase(deleteChat, (state, action) => {
      state.chats = state.chats.filter((chat) => chat.id !== action.payload);
    });
});

export default chatReducer;
