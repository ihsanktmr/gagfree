import { createReducer } from "@reduxjs/toolkit";

import { setTheme, toggleTheme } from "./actions";
import { ThemeState } from "./types";

const initialState: ThemeState = {
  theme: "light",
};

const themeReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setTheme, (state, action) => {
      state.theme = action.payload;
    })
    .addCase(toggleTheme, (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    });
});

export default themeReducer;
