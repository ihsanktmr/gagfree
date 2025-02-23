import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { MMKV } from "react-native-mmkv";
import { SubscriptionClient } from "subscriptions-transport-ws";

// Initialize MMKV
export const storage = new MMKV();

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql", // Development URL
});

const wsClient = new SubscriptionClient("ws://localhost:4000/graphql", {
  reconnect: true,
  connectionParams: () => {
    const token = storage.getString("token");
    return {
      authorization: token ? `Bearer ${token}` : "",
    };
  },
});

const wsLink = new WebSocketLink(wsClient);

const authLink = setContext((_, { headers }) => {
  const token = storage.getString("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink),
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
