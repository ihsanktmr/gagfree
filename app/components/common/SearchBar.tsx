import React from "react";

import { Ionicons } from "@expo/vector-icons";
import { distances } from "app/aesthetic/distances";
import { borderRadii } from "app/aesthetic/styleConstants";
import { typography } from "app/aesthetic/typography";
import { useThemeColor } from "app/hooks/useThemeColor";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder,
}) => {
  const iconColor = useThemeColor("icon");
  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const surfaceColor = useThemeColor("surface");

  const handleClear = () => {
    onChangeText("");
  };

  return (
    <View style={[styles.container, { backgroundColor: surfaceColor }]}>
      <Ionicons name="search" size={20} color={iconColor} style={styles.icon} />
      <TextInput
        style={[styles.input, { color: textColor }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={iconColor}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color={iconColor} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: distances.md,
    height: 44,
    borderRadius: borderRadii.medium,
    borderWidth: 1,
    borderColor: "transparent",
  },
  icon: {
    marginRight: distances.xs,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: typography.primary.regular,
    padding: 0,
  },
  clearButton: {
    marginLeft: distances.xs,
    padding: distances.xxs,
  },
});
