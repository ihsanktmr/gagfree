import { createReducer } from "@reduxjs/toolkit";

import { setFirstLaunch, setOnboardingSeen } from "./actions";
import { OnboardingState } from "./types";

const initialState: OnboardingState = {
  isOnboardingSeen: false,
  isFirstLaunch: true,
};

const miscReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setOnboardingSeen, (state) => {
      state.isOnboardingSeen = true;
    })
    .addCase(setFirstLaunch, (state) => {
      state.isFirstLaunch = false;
    });
});

export default miscReducer;
