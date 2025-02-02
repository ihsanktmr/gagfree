import { RootState } from "..";
import { Post } from "./types";

export const selectPosts = (state: RootState): Post[] => {
  if (!state.post?.posts || !Array.isArray(state.post.posts)) {
    return [];
  }
  return state.post.posts;
};

export const selectBookmarkedPosts = (state: RootState): Post[] => {
  if (
    !state.post?.bookmarkedPosts ||
    !Array.isArray(state.post.bookmarkedPosts)
  ) {
    return [];
  }
  return state.post.bookmarkedPosts;
};
