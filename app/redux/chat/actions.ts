import { createAction } from "@reduxjs/toolkit";

import { Chat } from "./types";

export const archiveChat = createAction<string>("chat/archiveChat");
export const unarchiveChat = createAction<string>("chat/unarchiveChat");
export const setChats = createAction<Chat[]>("chat/setChats");
export const markChatAsRead = createAction<string>("chat/markChatAsRead");
export const setChatError = createAction<string>("chat/setChatError");
export const clearChatError = createAction("chat/clearChatError");
export const setChatLoading = createAction<boolean>("chat/setChatLoading");
export const setSearchQuery = createAction<string>("chat/setSearchQuery");
export const deleteChat = createAction<string>("chat/deleteChat");
