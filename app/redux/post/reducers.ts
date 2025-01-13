import { createReducer } from "@reduxjs/toolkit";

import { addBookmark, removeBookmark, setPosts } from "./actions";
import { PostsState } from "./types";

const initialState: PostsState = {
  posts: [],
  bookmarkedPosts: [],
};

const postsReducer = createReducer(initialState, (builder) => {
  builder
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
