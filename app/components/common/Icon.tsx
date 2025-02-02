import React from "react";

import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { StyleProp, TextStyle } from "react-native";

// Define valid icon names
export type IoniconsName = keyof typeof Ionicons.glyphMap;
export type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface IconProps {
  type: "ionicon" | "material";
  name: IoniconsName | MaterialIconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const Icon: React.FC<IconProps> = ({
  type,
  name,
  size = 24,
  color,
  style,
}) => {
  if (type === "ionicon") {
    return (
      <Ionicons
        name={name as IoniconsName}
        size={size}
        color={color}
        style={style}
      />
    );
  }
  return (
    <MaterialCommunityIcons
      name={name as MaterialIconName}
      size={size}
      color={color}
      style={style}
    />
  );
};
