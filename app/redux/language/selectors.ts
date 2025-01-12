import { RootState } from "..";

export const selectLanguage = (state: RootState) => state.language.language;
