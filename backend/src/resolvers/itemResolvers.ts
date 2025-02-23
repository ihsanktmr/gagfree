import { AuthenticationError, UserInputError } from "apollo-server-express";
import { FileUpload } from "graphql-upload";
import mongoose from "mongoose";

import { Item } from "../models/Item";
import { ImageService } from "../services/imageService";
import {
  Context,
  CreateItemInput,
  ItemFilters,
  UpdateItemInput,
} from "../types";

export const itemResolvers = {
  Query: {
    item: async (_: any, { id }: { id: string }) => {
      return await Item.findById(new mongoose.Types.ObjectId(id))
        .populate("owner")
        .exec();
    },

    items: async (
      _: any,
      {
        filters = {},
        limit = 10,
        offset = 0,
      }: {
        filters: ItemFilters;
        limit: number;
        offset: number;
      },
    ) => {
      const query: any = { status: "AVAILABLE" };

      if (filters.category) query.category = filters.category;
      if (filters.location) query.location = filters.location;
      if (filters.search) {
        query.$or = [
          { title: { $regex: filters.search, $options: "i" } },
          { description: { $regex: filters.search, $options: "i" } },
        ];
      }

      return await Item.find(query)
        .populate("owner")
        .limit(limit)
        .skip(offset)
        .sort({ createdAt: -1 })
        .exec();
    },

    myItems: async (_: any, __: any, { user }: Context) => {
      if (!user) throw new AuthenticationError("Not authenticated");
      return await Item.find({ owner: new mongoose.Types.ObjectId(user.id) })
        .populate("owner")
        .exec();
    },
  },

  Mutation: {
    createItem: async (
      _: any,
      { input }: { input: CreateItemInput },
      { user }: Context,
    ) => {
      if (!user) throw new AuthenticationError("Not authenticated");

      try {
        // Upload images and get URLs
        const imageUrls = await ImageService.uploadMultipleImages(
          input.images as unknown as FileUpload[],
        );

        const item = await Item.create({
          ...input,
          images: imageUrls,
          owner: new mongoose.Types.ObjectId(user.id),
        });

        return await Item.findById(item._id).populate("owner").exec();
      } catch (error) {
        if (error instanceof Error) {
          throw new UserInputError(error.message);
        }
        throw new Error("Error processing images");
      }
    },

    updateItem: async (
      _: any,
      { id, input }: { id: string; input: UpdateItemInput },
      { user }: Context,
    ) => {
      if (!user) throw new AuthenticationError("Not authenticated");

      const item = await Item.findById(new mongoose.Types.ObjectId(id));
      if (!item) throw new UserInputError("Item not found");
      if (item.owner.toString() !== user.id) {
        throw new AuthenticationError("Not authorized");
      }

      try {
        let imageUrls = item.images;
        if (input.images) {
          // Delete old images
          await Promise.all(
            item.images.map((url) => ImageService.deleteImage(url)),
          );

          // Upload new images
          imageUrls = await ImageService.uploadMultipleImages(
            input.images as unknown as FileUpload[],
          );
        }

        const updatedItem = await Item.findByIdAndUpdate(
          new mongoose.Types.ObjectId(id),
          {
            ...input,
            images: imageUrls,
          },
          { new: true },
        )
          .populate("owner")
          .exec();

        if (!updatedItem) throw new UserInputError("Item not found");
        return updatedItem;
      } catch (error) {
        if (error instanceof Error) {
          throw new UserInputError(error.message);
        }
        throw new Error("Error processing images");
      }
    },

    deleteItem: async (_: any, { id }: { id: string }, { user }: Context) => {
      if (!user) throw new AuthenticationError("Not authenticated");

      const item = await Item.findById(new mongoose.Types.ObjectId(id));
      if (!item) throw new UserInputError("Item not found");
      if (item.owner.toString() !== user.id) {
        throw new AuthenticationError("Not authorized");
      }

      // Delete associated images
      await Promise.all(
        item.images.map((url) => ImageService.deleteImage(url)),
      );

      await Item.findByIdAndDelete(new mongoose.Types.ObjectId(id));
      return true;
    },

    markItemAsGiven: async (
      _: any,
      { id, toUserId }: { id: string; toUserId: string },
      { user }: Context,
    ) => {
      if (!user) throw new AuthenticationError("Not authenticated");

      const item = await Item.findById(new mongoose.Types.ObjectId(id));
      if (!item) throw new UserInputError("Item not found");
      if (item.owner.toString() !== user.id) {
        throw new AuthenticationError("Not authorized");
      }

      const updatedItem = await Item.findByIdAndUpdate(
        new mongoose.Types.ObjectId(id),
        {
          status: "GIVEN",
          interestedUsers: [new mongoose.Types.ObjectId(toUserId)],
        },
        { new: true },
      )
        .populate("owner")
        .exec();

      if (!updatedItem) throw new UserInputError("Item not found");
      return updatedItem;
    },

    showInterest: async (
      _: any,
      { itemId }: { itemId: string },
      { user }: Context,
    ) => {
      if (!user) throw new AuthenticationError("Not authenticated");

      const item = await Item.findById(new mongoose.Types.ObjectId(itemId));
      if (!item) throw new UserInputError("Item not found");

      if (
        !item.interestedUsers.includes(new mongoose.Types.ObjectId(user.id))
      ) {
        item.interestedUsers.push(new mongoose.Types.ObjectId(user.id));
        await item.save();
      }

      return await Item.findById(item._id).populate("owner").exec();
    },
  },
};
