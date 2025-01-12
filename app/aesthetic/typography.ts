import {
  OpenSans_400Regular as OpenSansRegular,
  OpenSans_600SemiBold as OpenSansSemiBold,
} from "@expo-google-fonts/open-sans";
import {
  Roboto_700Bold as RobotoBold,
  Roboto_400Regular as RobotoRegular,
} from "@expo-google-fonts/roboto";

export const customFontsToLoad = {
  RobotoRegular,
  RobotoBold,
  OpenSansRegular,
  OpenSansSemiBold,
};

const fonts = {
  roboto: {
    regular: "RobotoRegular",
    bold: "RobotoBold",
  },
  openSans: {
    regular: "OpenSansRegular",
    semiBold: "OpenSansSemiBold",
  },
};

export const typography = {
  fonts,
  primary: fonts.roboto,
  secondary: fonts.openSans,
};
