import { createAction } from "@reduxjs/toolkit";

import { LoginCredentials, ResetPasswordData, SignupData, User } from "./types";

// Login actions
export const loginRequest = createAction<LoginCredentials>("auth/loginRequest");
export const loginSuccess = createAction<{ user: User; token: string }>(
  "auth/loginSuccess",
);
export const loginFailure = createAction<string>("auth/loginFailure");

// Signup actions
export const signupRequest = createAction<SignupData>("auth/signupRequest");
export const signupSuccess = createAction<{ user: User; token: string }>(
  "auth/signupSuccess",
);
export const signupFailure = createAction<string>("auth/signupFailure");

// Password reset actions
export const forgotPasswordRequest = createAction<string>(
  "auth/forgotPasswordRequest",
);
export const forgotPasswordSuccess = createAction("auth/forgotPasswordSuccess");
export const forgotPasswordFailure = createAction<string>(
  "auth/forgotPasswordFailure",
);

export const resetPasswordRequest = createAction<ResetPasswordData>(
  "auth/resetPasswordRequest",
);
export const resetPasswordSuccess = createAction("auth/resetPasswordSuccess");
export const resetPasswordFailure = createAction<string>(
  "auth/resetPasswordFailure",
);

// User actions
export const updateUserRequest = createAction<Partial<User>>(
  "auth/updateUserRequest",
);
export const updateUserSuccess = createAction<User>("auth/updateUserSuccess");
export const updateUserFailure = createAction<string>("auth/updateUserFailure");

// Other actions
export const logout = createAction("auth/logout");
export const clearError = createAction("auth/clearError");
