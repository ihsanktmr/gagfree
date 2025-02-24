import { createReducer } from "@reduxjs/toolkit";
import { MMKV } from "react-native-mmkv";

import * as actions from "./actions";
import { AuthState } from "./types";

export const storage = new MMKV();

const initialState: AuthState = {
  user: null,
  token: storage.getString("token"),
  isAuthenticated: !!storage.getString("token"),
  loading: false,
  error: null,
};

const authReducer = createReducer(initialState, (builder) => {
  builder
    // Login
    .addCase(actions.loginRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(actions.loginSuccess, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      storage.set("token", action.payload.token);
    })
    .addCase(actions.loginFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    // Signup
    .addCase(actions.signupRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(actions.signupSuccess, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      storage.set("token", action.payload.token);
    })
    .addCase(actions.signupFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    // Update user
    .addCase(actions.updateUserSuccess, (state, action) => {
      state.user = action.payload;
    })
    // Logout
    .addCase(actions.logout, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      storage.delete("token");
    })
    // Clear error
    .addCase(actions.clearError, (state) => {
      state.error = null;
    });
});

export default authReducer;
