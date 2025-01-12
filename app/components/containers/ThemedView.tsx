import { Colors } from "app/aesthetic/colors";
import { useThemeColor } from "app/hooks/useThemeColor";
import { View, ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  colorKey?: keyof (typeof Colors)["light"];
};

export function ThemedView({
  style,
  colorKey = "background", // Default to the 'background' color from Colors
  ...props
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(colorKey); // Dynamically get the color based on the theme and colorKey

  return <View style={[{ backgroundColor }, style]} {...props} />;
}
