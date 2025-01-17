import React, { FC } from "react";

import { borderRadii } from "app/aesthetic/styleConstants";
import { useThemeColor } from "app/hooks/useThemeColor";
import { StyleSheet, View } from "react-native";
import { FAB } from "react-native-paper";

interface Props {
  onPress: () => void;
  icon: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

export const FABButton: FC<Props> = ({
  onPress,
  icon,
  loading = false,
  disabled = false,
}) => {
  const backgroundColor = useThemeColor(disabled ? "tabIconDefault" : "tint");
  const color = useThemeColor(disabled ? "icon" : "background");

  return (
    <View style={styles.container}>
      <FAB
        icon={loading ? "loading" : icon}
        onPress={onPress}
        disabled={disabled || loading}
        color={color}
        style={[styles.fab, { backgroundColor }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    right: 35,
    zIndex: 1000,
  },
  fab: {
    borderRadius: borderRadii.large,
  },
});
