import { AuthenticationError, UserInputError } from "apollo-server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/User";
import { Context, UserDocument } from "../types";

interface CreateUserInput {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
  location?: string;
  bio?: string;
}

interface UpdateUserInput {
  username?: string;
  firstName?: string;
  lastName?: string;
  location?: string;
  bio?: string;
  avatar?: string;
}

export const userResolvers = {
  Query: {
    me: async (_: any, __: any, { user }: Context) => {
      if (!user) throw new AuthenticationError("Not authenticated");
      return user;
    },

    user: async (_: any, { id }: { id: string }) => {
      return await User.findById(id);
    },

    users: async () => {
      return await User.find({});
    },
  },

  Mutation: {
    signup: async (_: any, { input }: { input: CreateUserInput }) => {
      const { email, password, username } = input;

      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });
      if (existingUser) {
        throw new UserInputError("User already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        ...input,
        password: hashedPassword,
      });
      await user.save();

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "1d",
      });

      return { token, user };
    },

    login: async (
      _: any,
      { email, password }: { email: string; password: string },
    ) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new UserInputError("User not found");
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new UserInputError("Invalid password");
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "1d",
      });

      return { token, user };
    },

    updateUser: async (
      _: any,
      { input }: { input: UpdateUserInput },
      { user }: Context,
    ) => {
      if (!user) throw new AuthenticationError("Not authenticated");

      const updatedUser = await User.findByIdAndUpdate(
        user.id,
        { ...input },
        { new: true },
      );

      return updatedUser;
    },

    deleteUser: async (_: any, __: any, { user }: Context) => {
      if (!user) throw new AuthenticationError("Not authenticated");

      await User.findByIdAndDelete(user.id);
      return true;
    },
  },
};
