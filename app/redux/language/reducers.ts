import { createReducer } from "@reduxjs/toolkit";
import { setLanguage } from "./actions";
import { LanguageState } from "./types";

const initialState: LanguageState = {
  language: "en",
};

const languageReducer = createReducer(initialState, (builder) => {
  builder.addCase(setLanguage, (state, action) => {
    state.language = action.payload;
  });
});

export default languageReducer;
