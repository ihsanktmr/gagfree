import { IResolvers } from "@graphql-tools/utils";
import { GraphQLURL } from "graphql-custom-types";
import { GraphQLDateTime } from "graphql-iso-date";

import { itemResolvers } from "./itemResolvers";
import { messageResolvers } from "./messageResolvers";
import { userResolvers } from "./userResolvers";

export const resolvers: IResolvers = {
  DateTime: GraphQLDateTime,
  URL: GraphQLURL,

  Query: {
    ...userResolvers.Query,
    ...itemResolvers.Query,
    ...messageResolvers.Query,
  },

  Mutation: {
    ...userResolvers.Mutation,
    ...itemResolvers.Mutation,
    ...messageResolvers.Mutation,
  },

  Subscription: {
    ...messageResolvers.Subscription,
  },
};
