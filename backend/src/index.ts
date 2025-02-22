import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import express from "express";
import { execute, subscribe } from "graphql";
import { createServer } from "http";
import mongoose from "mongoose";
import { SubscriptionServer } from "subscriptions-transport-ws";

import { context } from "./context";
import { resolvers } from "./resolvers";
import { typeDefs } from "./schema/schema";

dotenv.config();

const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to MongoDB");

    const app = express();
    const httpServer = createServer(app);

    const schema = makeExecutableSchema({ typeDefs, resolvers });

    // Create Subscription server and store the instance
    const subscriptionServer = SubscriptionServer.create(
      {
        schema,
        execute,
        subscribe,
        onConnect: (connectionParams: any) => {
          return { connectionParams };
        },
      },
      {
        server: httpServer,
        path: "/graphql",
      },
    );

    // Create Apollo Server
    const server = new ApolloServer({
      schema,
      context,
      plugins: [
        {
          async serverWillStart() {
            return {
              async drainServer() {
                subscriptionServer.close();
              },
            };
          },
        },
      ],
    });

    await server.start();
    server.applyMiddleware({ app });

    // Start the server
    const PORT = process.env.PORT || 4000;
    httpServer.listen(PORT, () => {
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`,
      );
      console.log(
        `🚀 Subscriptions ready at ws://localhost:${PORT}${server.graphqlPath}`,
      );
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
