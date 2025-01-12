import React, { FC } from "react";

import { distances } from "app/aesthetic/distances";
import { useThemeColor } from "app/hooks/useThemeColor";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

interface Props {
  icon: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  hitSlop?: { top: number; bottom: number; left: number; right: number };
}

export const IconButton: FC<Props> = ({
  icon,
  onPress,
  disabled = false,
  style,
  hitSlop,
}) => {
  const iconColor = useThemeColor(disabled ? "tabIconDefault" : "tint");

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabled, style]}
      hitSlop={hitSlop}
    >
      {React.cloneElement(icon as React.ReactElement, { color: iconColor })}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    padding: distances.lg,
  },
  disabled: {
    opacity: 0.5,
  },
});
