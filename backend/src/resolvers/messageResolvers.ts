import { AuthenticationError, UserInputError } from "apollo-server";
import { PubSub } from "graphql-subscriptions";

import { Message } from "../models/Message";
import { Context } from "../types";

const pubsub = new PubSub();
const MESSAGE_RECEIVED = "MESSAGE_RECEIVED";

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
          { sender: user.id, receiver: userId },
          { sender: userId, receiver: user.id },
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
          { sender: user.id, receiver: withUserId },
          { sender: withUserId, receiver: user.id },
        ],
      })
        .sort({ createdAt: 1 })
        .populate("sender")
        .populate("receiver")
        .populate("item")
        .exec();

      return messages;
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

      const message = await Message.create({
        content: input.content,
        sender: user.id,
        receiver: input.receiverId,
        item: input.itemId,
        status: "SENT",
      });

      const populatedMessage = await Message.findById(message._id)
        .populate("sender")
        .populate("receiver")
        .populate("item")
        .exec();

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

      const message = await Message.findById(id);
      if (!message) throw new UserInputError("Message not found");

      if (message.receiver.toString() !== user.id) {
        throw new AuthenticationError("Not authorized");
      }

      const updatedMessage = await Message.findByIdAndUpdate(
        id,
        { status: "READ" },
        { new: true },
      )
        .populate("sender")
        .populate("receiver")
        .populate("item")
        .exec();

      if (!updatedMessage) throw new UserInputError("Message not found");

      return updatedMessage;
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
