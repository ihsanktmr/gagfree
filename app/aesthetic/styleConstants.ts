import { Dimensions, Platform } from "react-native";

import { distances } from "./distances";

export const { width, height } = Dimensions.get("window");
export const genericSpacing = width * 0.075;
export const genericWidth = width * 0.85;

export const borderRadii = {
  small: distances.xs,
  medium: distances.sm,
  large: distances.md,
  extraLarge: distances.lg,
};

export const buttonVariants = {
  primary: {
    paddingVertical: distances.sm,
    paddingHorizontal: distances.lg,
    borderRadius: borderRadii.medium,
    backgroundColor: "#007BFF",
    color: "#FFFFFF",
    fontSize: 16,
  },
  secondary: {
    paddingVertical: distances.sm,
    paddingHorizontal: distances.lg,
    borderRadius: borderRadii.medium,
    backgroundColor: "#E0E0E0",
    color: "#000000",
    fontSize: 16,
  },
  outline: {
    paddingVertical: distances.sm,
    paddingHorizontal: distances.lg,
    borderRadius: borderRadii.medium,
    borderWidth: 1,
    borderColor: "#007BFF",
    color: "#007BFF",
    fontSize: 16,
  },
};

export const iconVariants = {
  small: {
    width: 20,
    height: 20,
  },
  medium: {
    width: 24,
    height: 24,
  },
  large: {
    width: 32,
    height: 32,
  },
  extraLarge: {
    width: 40,
    height: 40,
  },
};

export const shadowProps = {
  shadowColor: "#9BA1A6",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.35,
  shadowRadius: 8.65,
  elevation: 10,
};

export const getBottomTabBarHeight = () => {
  switch (Platform.OS) {
    case "ios":
      return 55;
    case "android":
      return 52.5;
    default:
      return 52.5;
  }
};

export const mainTabBarBottomMargin = 30;
export const dividerHeight = 0.25;
export const scrollViewBottomGap = 75;
export const searchInputTopMargin = 30;
export const searchInputHeight = 30;
export const flatListBottomGap = 100;
