import { createReducer } from "@reduxjs/toolkit";
import { MOCK_POSTS } from "app/data/mockPosts";

import {
  addBookmark,
  initializePosts,
  removeBookmark,
  setPosts,
} from "./actions";
import { PostsState } from "./types";

const initialState: PostsState = {
  posts: __DEV__ ? MOCK_POSTS : [], // Use mock data in dev
  bookmarkedPosts: [],
};

const postsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(initializePosts, (state) => {
      if (__DEV__ && state.posts.length === 0) {
        state.posts = MOCK_POSTS;
      }
    })
    .addCase(setPosts, (state, action) => {
      state.posts = action.payload;
    })
    .addCase(addBookmark, (state, action) => {
      if (
        !state.bookmarkedPosts.find((post) => post._id === action.payload._id)
      ) {
        state.bookmarkedPosts.push(action.payload);
      }
    })
    .addCase(removeBookmark, (state, action) => {
      state.bookmarkedPosts = state.bookmarkedPosts.filter(
        (post) => post._id !== action.payload,
      );
    });
});

export default postsReducer;
