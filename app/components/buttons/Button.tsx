import React, { FC } from "react";

import { distances } from "app/aesthetic/distances";
import { borderRadii, iconVariants } from "app/aesthetic/styleConstants";
import { typography } from "app/aesthetic/typography";
import { useThemeColor } from "app/hooks/useThemeColor";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  text: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconSize?: keyof typeof iconVariants;
}

export const Button: FC<Props> = ({
  text,
  onPress,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  iconSize = "medium",
}) => {
  const backgroundColor = useThemeColor(disabled ? "tabIconDefault" : "tint");
  const textColor = useThemeColor(disabled ? "icon" : "background");
  const iconSizeStyle = iconVariants[iconSize];

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <View style={styles.content}>
          {leftIcon && (
            <View style={[styles.iconContainer, iconSizeStyle]}>
              {leftIcon}
            </View>
          )}
          <Text style={[styles.text, { color: textColor }]}>{text}</Text>
          {rightIcon && (
            <View style={[styles.iconContainer, iconSizeStyle]}>
              {rightIcon}
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadii.large,
    height: 48,
    justifyContent: "center",
    marginVertical: distances.sm,
    paddingHorizontal: distances.lg,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontFamily: typography.primary.bold,
  },
  iconContainer: {
    marginHorizontal: distances.xxs,
  },
});
