import { APP_WEBSITE, STORE_LINK } from "app/appInfo";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

import { i18n } from "../language";

const SHARE_NOT_SUPPORTED_MESSAGE = i18n.t("shareNotSupported");
const ERROR_TITLE = i18n.t("errorTitle");

interface ShareMuseumParams {
  name?: string;
}

export const shareMuseum = async (params: ShareMuseumParams): Promise<void> => {
  const shareMessage =
    i18n.t("shareMuseumMessage") +
    " " +
    params.name +
    "?" +
    "\n" +
    "\n" +
    STORE_LINK +
    "\n" +
    "\n" +
    APP_WEBSITE;

  try {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(APP_WEBSITE, {
        dialogTitle: shareMessage,
      });
    } else {
      Alert.alert(ERROR_TITLE, SHARE_NOT_SUPPORTED_MESSAGE);
    }
  } catch (error) {
    console.error("Error sharing", error);

    Alert.alert(ERROR_TITLE);
  }
};

export const shareApp = async () => {
  const shareMessage =
    i18n.t("shareAppMessage") +
    "\n" +
    "\n" +
    STORE_LINK +
    "\n" +
    "\n" +
    APP_WEBSITE;

  try {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(APP_WEBSITE, {
        dialogTitle: shareMessage,
      });
    } else {
      Alert.alert(ERROR_TITLE, SHARE_NOT_SUPPORTED_MESSAGE);
    }
  } catch (error) {
    console.error("Error sharing", error);
    Alert.alert(ERROR_TITLE);
  }
};
