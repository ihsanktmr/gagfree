import { AuthenticationError, UserInputError } from "apollo-server";
import { PubSub } from "graphql-subscriptions";
import mongoose, { Types } from "mongoose";

import { Conversation, IConversation } from "../models/Conversation";
import { IMessage, Message } from "../models/Message";
import { Context } from "../types";

const pubsub = new PubSub();
const MESSAGE_RECEIVED = "MESSAGE_RECEIVED";

interface MessageData {
  content: string;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  conversation: Types.ObjectId;
  item?: Types.ObjectId;
  status: string;
}

export const messageResolvers = {
  Query: {
    messages: async (
      _: any,
      { userId }: { userId: string },
      { user }: Context,
    ) => {
      if (!user) throw new AuthenticationError("Not authenticated");

      const messages = await Message.find({
        $or: [
          {
            sender: new mongoose.Types.ObjectId(user.id),
            receiver: new mongoose.Types.ObjectId(userId),
          },
          {
            sender: new mongoose.Types.ObjectId(userId),
            receiver: new mongoose.Types.ObjectId(user.id),
          },
        ],
      }).exec();

      return Promise.all(
        messages.map(async (message) => {
          const populatedMessage = await Message.findById(message._id)
            .populate("sender")
            .populate("receiver")
            .populate("item")
            .exec();
          return populatedMessage;
        }),
      );
    },

    conversation: async (
      _: any,
      { withUserId }: { withUserId: string },
      { user }: Context,
    ) => {
      if (!user) throw new AuthenticationError("Not authenticated");

      const messages = await Message.find({
        $or: [
          {
            sender: new mongoose.Types.ObjectId(user.id),
            receiver: new mongoose.Types.ObjectId(withUserId),
          },
          {
            sender: new mongoose.Types.ObjectId(withUserId),
            receiver: new mongoose.Types.ObjectId(user.id),
          },
        ],
      })
        .sort({ createdAt: 1 })
        .populate("sender")
        .populate("receiver")
        .populate("item")
        .exec();

      return messages;
    },

    conversations: async (_: any, __: any, { user }: Context) => {
      if (!user) throw new AuthenticationError("Not authenticated");

      const conversations = await Conversation.find({
        participants: new mongoose.Types.ObjectId(user.id),
        archivedBy: { $ne: new mongoose.Types.ObjectId(user.id) },
      })
        .populate("participants")
        .populate("lastMessage")
        .sort({ updatedAt: -1 })
        .exec();

      return conversations;
    },
  },

  Mutation: {
    sendMessage: async (
      _: any,
      {
        input,
      }: { input: { content: string; receiverId: string; itemId?: string } },
      { user }: Context,
    ) => {
      if (!user) throw new AuthenticationError("Not authenticated");

      let conversation = (await Conversation.findOne({
        participants: {
          $all: [
            new Types.ObjectId(user.id),
            new Types.ObjectId(input.receiverId),
          ],
        },
      })) as IConversation;

      if (!conversation) {
        conversation = (await Conversation.create({
          participants: [
            new Types.ObjectId(user.id),
            new Types.ObjectId(input.receiverId),
          ],
          unreadCount: new Map([[input.receiverId, 1]]),
        })) as IConversation;
      } else {
        const currentCount =
          conversation.unreadCount.get(input.receiverId) || 0;
        conversation.unreadCount.set(input.receiverId, currentCount + 1);
        await conversation.save();
      }

      const messageData: MessageData = {
        content: input.content,
        sender: new Types.ObjectId(user.id),
        receiver: new Types.ObjectId(input.receiverId),
        conversation: conversation._id as Types.ObjectId,
        status: "SENT",
      };

      if (input.itemId) {
        messageData.item = new Types.ObjectId(input.itemId);
      }

      const message = await Message.create(messageData);

      const populatedMessage = await Message.findById(message._id)
        .populate("sender")
        .populate("receiver")
        .populate("item")
        .exec();

      await Conversation.findByIdAndUpdate(conversation._id, {
        lastMessage: message._id as Types.ObjectId,
      });

      pubsub.publish(MESSAGE_RECEIVED, {
        messageReceived: populatedMessage,
      });

      return populatedMessage;
    },

    markMessageAsRead: async (
      _: any,
      { id }: { id: string },
      { user }: Context,
    ) => {
      if (!user) throw new AuthenticationError("Not authenticated");

      const message = await Message.findById(new mongoose.Types.ObjectId(id));
      if (!message) throw new UserInputError("Message not found");

      if (message.receiver.toString() !== user.id) {
        throw new AuthenticationError("Not authorized");
      }

      const updatedMessage = await Message.findByIdAndUpdate(
        new mongoose.Types.ObjectId(id),
        { status: "READ" },
        { new: true },
      )
        .populate("sender")
        .populate("receiver")
        .populate("item")
        .exec();

      if (!updatedMessage) throw new UserInputError("Message not found");

      // Update conversation unread count
      const conversation = await Conversation.findById(message.conversation);
      if (conversation) {
        conversation.unreadCount.set(user.id, 0);
        await conversation.save();
      }

      return updatedMessage;
    },

    archiveConversation: async (
      _: any,
      { id }: { id: string },
      { user }: Context,
    ) => {
      if (!user) throw new AuthenticationError("Not authenticated");

      const conversation = await Conversation.findById(new Types.ObjectId(id));
      if (!conversation) throw new UserInputError("Conversation not found");

      const participantIds = conversation.participants.map(
        (p: Types.ObjectId) => p.toString(),
      );
      if (!participantIds.includes(user.id)) {
        throw new AuthenticationError("Not authorized");
      }

      conversation.archivedBy = conversation.archivedBy || [];
      conversation.archivedBy.push(new Types.ObjectId(user.id));
      await conversation.save();

      return conversation;
    },

    unarchiveConversation: async (
      _: any,
      { id }: { id: string },
      { user }: Context,
    ) => {
      if (!user) throw new AuthenticationError("Not authenticated");

      const conversation = await Conversation.findById(new Types.ObjectId(id));
      if (!conversation) throw new UserInputError("Conversation not found");

      conversation.archivedBy = conversation.archivedBy.filter(
        (userId: Types.ObjectId) => userId.toString() !== user.id,
      );
      await conversation.save();

      return conversation;
    },
  },

  Subscription: {
    messageReceived: {
      subscribe: (_: any, __: any, { user }: Context) => {
        if (!user) throw new AuthenticationError("Not authenticated");
        return (pubsub as any).asyncIterator([MESSAGE_RECEIVED]);
      },
    },
  },
};
