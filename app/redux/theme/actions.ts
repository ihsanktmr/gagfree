import { createAction } from "@reduxjs/toolkit";

export const setTheme = createAction<"light" | "dark">("theme/setTheme");
export const toggleTheme = createAction("theme/toggleTheme");
