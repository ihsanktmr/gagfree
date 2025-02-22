import { gql } from "apollo-server";

export const typeDefs = gql`
  # Custom scalar types
  scalar DateTime
  scalar URL

  # Enums
  enum ItemStatus {
    AVAILABLE
    PENDING
    GIVEN
    DELETED
  }

  enum UserRole {
    USER
    ADMIN
  }

  enum MessageStatus {
    SENT
    DELIVERED
    READ
  }

  # Types
  type User {
    id: ID!
    email: String!
    username: String!
    firstName: String
    lastName: String
    avatar: URL
    bio: String
    location: String
    createdAt: DateTime!
    updatedAt: DateTime!
    role: UserRole!
    items: [Item!]!
    sentMessages: [Message!]!
    receivedMessages: [Message!]!
  }

  type Item {
    id: ID!
    title: String!
    description: String!
    category: String!
    images: [URL!]!
    status: ItemStatus!
    location: String
    owner: User!
    createdAt: DateTime!
    updatedAt: DateTime!
    interestedUsers: [User!]!
  }

  type Message {
    id: ID!
    content: String!
    sender: User!
    receiver: User!
    item: Item
    status: MessageStatus!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # Input types
  input CreateUserInput {
    email: String!
    password: String!
    username: String!
    firstName: String
    lastName: String
    location: String
    bio: String
  }

  input UpdateUserInput {
    username: String
    firstName: String
    lastName: String
    location: String
    bio: String
    avatar: String
  }

  input CreateItemInput {
    title: String!
    description: String!
    category: String!
    images: [String!]!
    location: String
  }

  input UpdateItemInput {
    title: String
    description: String
    category: String
    images: [String!]
    status: ItemStatus
    location: String
  }

  input ItemFiltersInput {
    category: String
    status: ItemStatus
    location: String
    search: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  # Queries
  type Query {
    me: User!
    user(id: ID!): User
    users: [User!]!

    item(id: ID!): Item
    items(filters: ItemFiltersInput, limit: Int, offset: Int): [Item!]!
    myItems: [Item!]!

    messages(userId: ID!): [Message!]!
    conversation(withUserId: ID!): [Message!]!
  }

  # Mutations
  type Mutation {
    # Auth mutations
    signup(input: CreateUserInput!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!

    # User mutations
    updateUser(input: UpdateUserInput!): User!
    deleteUser: Boolean!

    # Item mutations
    createItem(input: CreateItemInput!): Item!
    updateItem(id: ID!, input: UpdateItemInput!): Item!
    deleteItem(id: ID!): Boolean!
    markItemAsGiven(id: ID!, toUserId: ID!): Item!
    showInterest(itemId: ID!): Item!

    # Message mutations
    sendMessage(input: MessageInput!): Message!
    markMessageAsRead(id: ID!): Message!
  }

  # Message Input
  input MessageInput {
    content: String!
    receiverId: ID!
    itemId: ID
  }

  # Subscriptions
  type Subscription {
    messageReceived: Message!
  }
`;
