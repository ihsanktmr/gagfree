import React, { FC } from "react";

import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "app/hooks/useThemeColor";
import { StyleSheet, View } from "react-native";

interface GenericCheckBoxProps {
  selected: boolean;
}

export const GenericCheckBox: FC<GenericCheckBoxProps> = ({ selected }) => {
  const borderColor = useThemeColor(selected ? "tint" : "tabIconDefault");
  const backgroundColor = useThemeColor(selected ? "tint" : "background");
  const iconColor = useThemeColor("background");

  return (
    <View
      testID="generic-checkbox"
      style={[styles.genericCheckBox, { borderColor, backgroundColor }]}
    >
      {selected && (
        <Ionicons
          testID="checkmark-icon"
          name="checkmark"
          size={18}
          color={iconColor}
        />
      )}
    </View>
  );
};

const checkCircleSize = 25;

const styles = StyleSheet.create({
  genericCheckBox: {
    height: checkCircleSize,
    width: checkCircleSize,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.65,
    borderRadius: checkCircleSize / 2,
  },
});
