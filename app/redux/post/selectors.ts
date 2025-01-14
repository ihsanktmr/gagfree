import { RootState } from "..";

export const selectPosts = (state: RootState) => state.post;
export const selectBookmarkedPosts = (state: RootState) =>
  state.post.bookmarkedPosts;
