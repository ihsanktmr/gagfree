import { Platform } from "react-native";

const APP_STORE_LINK = "";

const PLAY_STORE_LINK = "";

export const PRIVACY_POLICY = "";

export const TERMS_AND_CONDITIONS = "";

export const APP_WEBSITE = "";

export const STORE_LINK = Platform.select({
  android: PLAY_STORE_LINK,
  ios: APP_STORE_LINK,
});

export const appInfo = {
  infoMail: "",
};

export const isIos = Platform.OS === "ios";
