import posts from "app/data/posts.json";
import { Post } from "app/redux/post/types";

export const useData = (): Post[] => {
  return posts as Post[];
};
