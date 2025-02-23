import { gql } from "@apollo/client";

// Fragment for reusable item fields
export const ITEM_FIELDS = gql`
  fragment ItemFields on Item {
    id
    title
    description
    category
    images
    status
    location
    createdAt
    owner {
      id
      username
      avatar
    }
  }
`;

// Query to get all items
export const GET_ITEMS = gql`
  query GetItems($filters: ItemFilters, $limit: Int, $offset: Int) {
    items(filters: $filters, limit: $limit, offset: $offset) {
      ...ItemFields
    }
  }
  ${ITEM_FIELDS}
`;

// Mutation to create an item
export const CREATE_ITEM = gql`
  mutation CreateItem($input: CreateItemInput!) {
    createItem(input: $input) {
      ...ItemFields
    }
  }
  ${ITEM_FIELDS}
`;

// Mutation to delete an item
export const DELETE_ITEM = gql`
  mutation DeleteItem($id: ID!) {
    deleteItem(id: $id)
  }
`;

// Query to get my items
export const GET_MY_ITEMS = gql`
  query GetMyItems {
    myItems {
      ...ItemFields
    }
  }
  ${ITEM_FIELDS}
`;

// Mutation to update an item
export const UPDATE_ITEM = gql`
  mutation UpdateItem($id: ID!, $input: UpdateItemInput!) {
    updateItem(id: $id, input: $input) {
      ...ItemFields
    }
  }
  ${ITEM_FIELDS}
`;
