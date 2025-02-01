import React, { useEffect, useRef } from "react";

import { distances } from "app/aesthetic/distances";
import { typography } from "app/aesthetic/typography";
import { useThemeColor } from "app/hooks/useThemeColor";
import {
  Animated,
  Platform,
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

  const headerScale = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.9],
  });

  const searchOpacity = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const searchScale = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  const searchTranslateX = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: headerOpacity,
            transform: [{ scale: headerScale }],
            position: "absolute",
            width: "100%",
          },
        ]}
      >
        <IconButton
          icon="magnify"
          size={24}
          iconColor={textColor}
          onPress={onSearchPress}
        />
        <ThemedText style={styles.title}>{title}</ThemedText>
        <View style={styles.rightContainer}>{rightIcon}</View>
      </Animated.View>

      <Animated.View
        style={[
          styles.searchContainer,
          {
            opacity: searchOpacity,
            transform: [
              { scale: searchScale },
              { translateX: searchTranslateX },
            ],
            backgroundColor: surfaceColor,
          },
        ]}
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
      </Animated.View>
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
    position: "relative",
  },
  rightContainer: {
    width: 48, // Match the width of the search icon
    alignItems: "flex-end",
  },
  title: {
    fontSize: 20,
    fontFamily: typography.primary.bold,
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    zIndex: -1,
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
