import { Request } from "express";
import jwt from "jsonwebtoken";

import { User } from "./models/User";

interface TokenPayload {
  userId: string;
}

export interface Context {
  user?: any;
  req: Request;
}

export const context = async ({ req }: { req: Request }): Promise<Context> => {
  const context: Context = { req };

  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!,
      ) as TokenPayload;
      const user = await User.findById(decoded.userId);
      if (user) {
        context.user = user;
      }
    }
  } catch (error) {
    console.error("Auth error:", error);
  }

  return context;
};
