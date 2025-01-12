import { RootState } from "..";

export const selectIsOnboardingSeen = (state: RootState) => state.misc.isOnboardingSeen;
export const selectIsFirstLaunch = (state: RootState) => state.misc.isFirstLaunch;
