import React from "react";

import { distances } from "app/aesthetic/distances";
import { typography } from "app/aesthetic/typography";
import { useThemeColor } from "app/hooks/useThemeColor";
import { StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";

import { ThemedText } from "../texts/ThemedText";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  iconSize?: number;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  iconSize = 48,
}) => {
  const textColor = useThemeColor("text");
  const mainColor = useThemeColor("main");

  return (
    <View style={styles.container}>
      <IconButton
        icon={icon}
        size={iconSize}
        iconColor={mainColor}
        style={styles.icon}
      />
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={[styles.description, { color: textColor + "99" }]}>
        {description}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: distances.xl,
  },
  icon: {
    marginBottom: distances.lg,
  },
  title: {
    fontSize: 20,
    fontFamily: typography.primary.bold,
    textAlign: "center",
    marginBottom: distances.sm,
  },
  description: {
    fontSize: 16,
    fontFamily: typography.secondary.regular,
    textAlign: "center",
    lineHeight: 22,
  },
});
