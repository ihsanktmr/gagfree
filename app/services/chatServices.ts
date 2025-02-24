import { gql } from "@apollo/client";

const CHAT_FIELDS = gql`
  fragment ChatFields on Conversation {
    id
    participants {
      id
      username
      avatar
    }
    lastMessage {
      id
      content
      createdAt
    }
    unreadCount
    updatedAt
  }
`;

const MESSAGE_FIELDS = gql`
  fragment MessageFields on Message {
    id
    content
    sender {
      id
      username
      avatar
    }
    createdAt
  }
`;

export const GET_CONVERSATIONS = gql`
  query GetConversations {
    conversations {
      ...ChatFields
    }
  }
  ${CHAT_FIELDS}
`;

export const GET_CONVERSATION = gql`
  query GetConversation($id: ID!) {
    conversation(id: $id) {
      ...ChatFields
      messages {
        ...MessageFields
      }
    }
  }
  ${CHAT_FIELDS}
  ${MESSAGE_FIELDS}
`;

export const GET_MESSAGES = gql`
  query GetMessages($conversationId: ID!) {
    messages(conversationId: $conversationId) {
      id
      content
      sender {
        id
        username
        avatar
      }
      createdAt
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      ...MessageFields
    }
  }
  ${MESSAGE_FIELDS}
`;

export const MESSAGE_SUBSCRIPTION = gql`
  subscription OnMessageReceived($conversationId: ID!) {
    messageReceived(conversationId: $conversationId) {
      ...MessageFields
    }
  }
  ${MESSAGE_FIELDS}
`;

export const MARK_AS_READ = gql`
  mutation MarkConversationAsRead($id: ID!) {
    markConversationAsRead(id: $id) {
      id
      unreadCount
    }
  }
`;
