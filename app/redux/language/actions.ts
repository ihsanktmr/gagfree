import { createAction } from "@reduxjs/toolkit";

export const setLanguage = createAction<"en" | "tr">("language/setLanguage");
