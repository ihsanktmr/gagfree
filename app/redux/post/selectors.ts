import { RootState } from "..";

export const selectPosts = (state: RootState) => state.posts;
export const selectBookmarkedPosts = (state: RootState) =>
  state.posts.bookmarkedPosts;
