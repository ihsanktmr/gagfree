import { createAction } from "@reduxjs/toolkit";

import { Post } from "./types";

export const setPosts = createAction("post/setPosts");

export const addBookmark = createAction<Post>("post/addBookmark");
export const removeBookmark = createAction<string>("post/removeBookmark");
