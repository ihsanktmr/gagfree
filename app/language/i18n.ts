import { I18n } from "i18n-js";
import { MMKV } from "react-native-mmkv";

import en from "./en";

// Initialize I18n
export const i18n = new I18n();

// Create an instance of MMKV
const storage = new MMKV();

// Load translations
i18n.translations = {
  en,
};

i18n.enableFallback = true;

// Custom logic to set and get the current locale
export const setLocale = (locale: "en") => {
  i18n.locale = locale; // Update i18n's locale
  storage.set("appLanguage", locale); // Persist the locale in MMKV
};

export const getLocale = (): "en" => {
  // Retrieve the persisted locale or fall back to i18n's default locale
  const storedLocale = storage.getString("appLanguage");
  return (storedLocale as "en") || i18n.locale;
};

// Check if a locale is supported
export const isSupportedLocale = (locale: string): boolean =>
  Object.keys(i18n.translations).includes(locale);

export default i18n;
