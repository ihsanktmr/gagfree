import { Colors } from "app/aesthetic/colors";
import { typography } from "app/aesthetic/typography";
import { useThemeColor } from "app/hooks/useThemeColor";
import { StyleSheet, Text, TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  colorKey?: keyof (typeof Colors)["light"];
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  colorKey = "text", // Default to the 'text' color from Colors
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor(colorKey); // Dynamically get the color based on the theme and colorKey

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    fontFamily: typography.primary.regular,
    marginBottom: 16,
  },
  defaultSemiBold: {
    fontSize: 16,
    fontFamily: typography.secondary.semiBold,
  },
  title: {
    fontSize: 32,
    fontFamily: typography.primary.bold,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: typography.primary.regular,
  },
  link: {
    fontSize: 16,
    fontFamily: typography.secondary.semiBold,
    textDecorationLine: "underline",
  },
});
