import { configureStore } from "@reduxjs/toolkit";
import { persistCombineReducers } from "redux-persist";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistStore,
} from "redux-persist";

import authReducer from "./auth/reducers";
import chatReducer from "./chat/reducers";
import languageReducer from "./language/reducers";
import miscReducer from "./misc/reducers";
import { persistStorage } from "./persistStorage";
import postsReducer from "./post/reducers";
import themeReducer from "./theme/reducers";

// Combine reducers
const rootReducer = {
  misc: miscReducer,
  chat: chatReducer,
  post: postsReducer,
  theme: themeReducer,
  language: languageReducer,
  auth: authReducer,
};

const persistConfig = {
  key: "root",
  storage: persistStorage,
};

// Persisted reducer
export const persistedRootReducer = persistCombineReducers(
  persistConfig,
  rootReducer,
);

// Store configuration
export const store = configureStore({
  reducer: persistedRootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Persistor for managing persistence lifecycle
export const persistor = persistStore(store);

// Define RootState and AppDispatch for TypeScript type inference
export type RootState = {
  [K in keyof typeof rootReducer]: ReturnType<(typeof rootReducer)[K]>;
};
export type AppDispatch = typeof store.dispatch;
