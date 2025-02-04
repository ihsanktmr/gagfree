export interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  avatarUrl: string;
  isArchived: boolean;
  unreadCount?: number;
  isOnline?: boolean;
}

export interface ChatState {
  chats: Chat[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

export type MessageSender = "user" | "other";

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: MessageSender;
}
