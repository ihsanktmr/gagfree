import React from "react";

import { distances } from "app/aesthetic/distances";
import { borderRadii } from "app/aesthetic/styleConstants";
import { typography } from "app/aesthetic/typography";
import { useThemeColor } from "app/hooks/useThemeColor";
import { StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "../texts/ThemedText";

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  selected,
  onPress,
}) => {
  const mainColor = useThemeColor("main");
  const backgroundColor = useThemeColor("background");

  console.log(`FilterChip - Rendering: ${label}, Selected: ${selected}`); // Debug log

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        {
          backgroundColor: selected ? mainColor : backgroundColor,
          borderColor: mainColor,
        },
      ]}
      onPress={() => {
        console.log(`FilterChip - Pressed: ${label}`); // Debug log
        onPress();
      }}
      activeOpacity={0.7}
    >
      <ThemedText
        style={[
          styles.label,
          {
            color: selected ? backgroundColor : mainColor,
          },
        ]}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: distances.md,
    paddingVertical: distances.sm,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: distances.sm,
  },
  label: {
    fontSize: 14,
    fontFamily: typography.secondary.medium,
  },
});
