import React, { useEffect, useRef } from "react";

import { distances } from "app/aesthetic/distances";
import { typography } from "app/aesthetic/typography";
import { useThemeColor } from "app/hooks/useThemeColor";
import {
  Animated,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { IconButton } from "react-native-paper";

import { ThemedText } from "../texts/ThemedText";

interface SearchHeaderProps {
  title: string;
  showSearch: boolean;
  onSearchPress: () => void;
  onSearchClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  rightIcon?: React.ReactNode;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  title,
  showSearch,
  onSearchPress,
  onSearchClose,
  searchQuery,
  onSearchChange,
  rightIcon,
}) => {
  const textColor = useThemeColor("text");
  const surfaceColor = useThemeColor("surface");
  const searchAnimation = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    Animated.timing(searchAnimation, {
      toValue: showSearch ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    if (showSearch) {
      inputRef.current?.focus();
    }
  }, [showSearch]);

  return (
    <View style={styles.container}>
      {!showSearch && (
        <View style={styles.headerContainer}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <View style={styles.rightContainer}>
            <IconButton
              icon="magnify"
              size={24}
              iconColor={textColor}
              onPress={onSearchPress}
            />
            {rightIcon}
          </View>
        </View>
      )}

      {showSearch && (
        <View
          style={[styles.searchContainer, { backgroundColor: surfaceColor }]}
        >
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor={textColor}
            onPress={() => {
              onSearchClose();
              onSearchChange("");
            }}
          />
          <TextInput
            ref={inputRef}
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search chats..."
            placeholderTextColor={textColor + "80"}
            value={searchQuery}
            onChangeText={onSearchChange}
          />
          {searchQuery ? (
            <IconButton
              icon="close"
              size={20}
              iconColor={textColor}
              onPress={() => onSearchChange("")}
            />
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    justifyContent: "center",
    paddingHorizontal: distances.sm,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: typography.primary.bold,
    flex: 1,
  },
  searchContainer: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    fontFamily: typography.primary.regular,
    paddingHorizontal: distances.xs,
  },
});
