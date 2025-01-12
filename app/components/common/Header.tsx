import React, { FC } from "react";

import { typography } from "app/aesthetic/typography";
import { useThemeColor } from "app/hooks/useThemeColor";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

export const Header: FC<Props> = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
}) => {
  const backgroundColor = useThemeColor("background"); // Header background color
  const textColor = useThemeColor("text"); // Header text color
  const iconColor = useThemeColor("icon"); // Header icon color

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {leftIcon ? (
        <TouchableOpacity onPress={onLeftPress} style={styles.iconContainer}>
          {React.cloneElement(leftIcon as React.ReactElement, {
            color: iconColor,
          })}
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      {rightIcon ? (
        <TouchableOpacity onPress={onRightPress} style={styles.iconContainer}>
          {React.cloneElement(rightIcon as React.ReactElement, {
            color: iconColor,
          })}
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    paddingHorizontal: 16,
    elevation: 4, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 18,
    fontFamily: typography.primary.bold,
    textAlign: "center",
    flex: 1,
  },
  iconContainer: {
    padding: 8,
  },
  placeholder: {
    width: 48, // Placeholder size for alignment
  },
});
