import {
  OpenSans_500Medium as OpenSansMedium,
  OpenSans_400Regular as OpenSansRegular,
  OpenSans_600SemiBold as OpenSansSemiBold,
} from "@expo-google-fonts/open-sans";
import {
  Roboto_700Bold as RobotoBold,
  Roboto_500Medium as RobotoMedium,
  Roboto_400Regular as RobotoRegular,
} from "@expo-google-fonts/roboto";

export const customFontsToLoad = {
  RobotoRegular,
  RobotoBold,
  RobotoMedium,
  OpenSansRegular,
  OpenSansSemiBold,
  OpenSansMedium,
};

const fonts = {
  roboto: {
    regular: "RobotoRegular",
    medium: "RobotoMedium",
    bold: "RobotoBold",
  },
  openSans: {
    regular: "OpenSansRegular",
    medium: "OpenSansMedium",
    semiBold: "OpenSansSemiBold",
  },
};

export const typography = {
  fonts,
  primary: fonts.roboto,
  secondary: fonts.openSans,
};
