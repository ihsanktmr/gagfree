import React, { useEffect, useRef } from "react";

import { distances } from "app/aesthetic/distances";
import { typography } from "app/aesthetic/typography";
import { useThemeColor } from "app/hooks/useThemeColor";
import { Animated, StyleSheet, TextInput, View } from "react-native";
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
  hideSearchIcon?: boolean;
  placeholder?: string;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  title,
  showSearch,
  onSearchPress,
  onSearchClose,
  searchQuery,
  onSearchChange,
  rightIcon,
  hideSearchIcon = false,
  placeholder = "Search...",
}) => {
  const textColor = useThemeColor("text");
  const surfaceColor = useThemeColor("surface");
  const searchAnimation = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    Animated.spring(searchAnimation, {
      toValue: showSearch ? 1 : 0,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();

    if (showSearch) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [showSearch]);

  const headerOpacity = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const searchOpacity = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.headerContainer, { opacity: headerOpacity }]}
      >
        <ThemedText style={styles.title}>{title}</ThemedText>
        <View style={styles.iconContainer}>
          {!hideSearchIcon && (
            <IconButton
              icon="magnify"
              iconColor={textColor}
              onPress={onSearchPress}
            />
          )}
          {rightIcon}
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.searchContainer,
          {
            opacity: searchOpacity,
            backgroundColor: surfaceColor,
          },
        ]}
      >
        <IconButton
          icon="arrow-left"
          iconColor={textColor}
          onPress={() => {
            onSearchClose();
            onSearchChange("");
          }}
        />
        <TextInput
          ref={inputRef}
          style={[styles.searchInput, { color: textColor }]}
          placeholder={placeholder}
          placeholderTextColor={textColor + "80"}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
        {searchQuery ? (
          <IconButton
            icon="close"
            iconColor={textColor}
            onPress={() => onSearchChange("")}
          />
        ) : null}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
  },
  headerContainer: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: distances.md,
  },
  title: {
    fontSize: 20,
    fontFamily: typography.primary.bold,
  },
  iconContainer: {
    flexDirection: "row",
  },
  searchContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    fontFamily: typography.primary.regular,
  },
});
