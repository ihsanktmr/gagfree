import React, { FC } from "react";

import { useThemeColor } from "app/hooks/useThemeColor";
import { StyleSheet, Switch, View } from "react-native";

interface SwitchComponentProps {
  status: boolean;
  onToggle: () => void;
}

export const SwitchComponent: FC<SwitchComponentProps> = ({
  status,
  onToggle,
}) => {
  const trackColorTrue = useThemeColor("tint"); // Track color when true
  const trackColorFalse = useThemeColor("tabIconDefault"); // Track color when false
  const thumbColor = useThemeColor("background"); // Thumb color

  return (
    <View style={styles.container}>
      <Switch
        trackColor={{ false: trackColorFalse, true: trackColorTrue }}
        thumbColor={thumbColor}
        ios_backgroundColor={trackColorFalse}
        onValueChange={onToggle}
        value={status}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
