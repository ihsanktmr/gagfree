import React from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { distances } from "app/aesthetic/distances";
import { dividerHeight } from "app/aesthetic/styleConstants";
import { useThemeColor } from "app/hooks/useThemeColor";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SettingButtonProps {
  onPress: () => void;
  icon?: React.ReactNode;
  name: string;
  selection?: string;
  disabled?: boolean;
  nextIcon?: boolean;
  loading?: boolean;
}

export const SettingButton: React.FC<SettingButtonProps> = ({
  onPress,
  icon,
  name,
  selection,
  disabled = false,
  nextIcon = false,
  loading = false,
}) => {
  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={disabled}
      style={[
        styles.settingButtonContainer,
        {
          backgroundColor: backgroundColor,
          opacity: disabled ? 0.6 : 1,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.settingInnerView}>
        {icon}
        <Text
          style={[
            styles.settingButtonText,
            {
              color: textColor,
            },
          ]}
        >
          {name}
        </Text>
        {loading && (
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: 10 }} />
            <ActivityIndicator size="small" />
          </View>
        )}
      </View>

      {selection && (
        <Text
          style={[
            styles.settingButtonSelectionText,
            {
              color: textColor,
            },
          ]}
        >
          {selection}
        </Text>
      )}
      {nextIcon && (
        <MaterialIcons name="navigate-next" size={30} color={textColor} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  settingButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    borderBottomWidth: dividerHeight,
    paddingRight: distances.lg,
    paddingLeft: distances.sm,
  },
  settingInnerView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  settingButtonText: {
    marginLeft: distances.md,
  },
  settingButtonSelectionText: {
    paddingRight: distances.xxs,
  },
});
