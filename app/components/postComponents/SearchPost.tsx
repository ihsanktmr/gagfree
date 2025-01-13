import React, { useEffect, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { distances } from "app/aesthetic/distances";
import {
  dividerHeight,
  getBottomTabBarHeight,
  searchInputHeight,
  searchInputTopMargin,
} from "app/aesthetic/styleConstants";
import { typography } from "app/aesthetic/typography";
import { useThemeColor } from "app/hooks/useThemeColor";
import {
  Animated,
  Easing,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { i18n } from "../../language";

interface SearchPostInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const SearchPostInput: React.FC<SearchPostInputProps> = ({
  value,
  onChangeText,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const emptyString = "";
  const [text, setText] = useState<string>("");
  const [index, setIndex] = useState(0);
  const leftValue = useState(new Animated.Value(45))[0];
  const textColor = useThemeColor("text");
  const iconColor = useThemeColor("icon");
  const bottomTabBarHeight = getBottomTabBarHeight();
  const transparentBackground = useThemeColor("transparentBackground");

  useEffect(() => {
    setIndex(0);
    setText("");
  }, []);

  const startAnimations = () => {
    Animated.timing(leftValue, {
      toValue: 50,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  const resetAnimation = () => {
    Animated.timing(leftValue, {
      toValue: 40,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  const onFocusInput = () => {
    setIsFocused(true);
    startAnimations();
  };

  const onBlurInput = () => {
    setIsFocused(false);
    resetAnimation();
  };

  return (
    <Animated.View style={styles.searchStoreInputUpperContainer}>
      <Animated.View
        style={[
          styles.searchStoreInputContainer,
          {
            height: bottomTabBarHeight,
            backgroundColor: transparentBackground,
            borderColor: textColor,
          },
        ]}
      >
        <View style={styles.iconSearchContainer}>
          <Ionicons name="search" size={24} color={iconColor} />
        </View>
        <TextInput
          onFocus={onFocusInput}
          onBlur={onBlurInput}
          returnKeyType="done"
          autoCapitalize="none"
          autoCorrect={false}
          value={value}
          onChangeText={(text) => onChangeText(text.trimStart())}
          onSubmitEditing={() => setIsFocused(false)}
          style={{ ...styles.searchStoreInput, color: textColor }}
        />
        {value.length === 0 && (
          <Animated.Text
            numberOfLines={1}
            style={[
              styles.placeholderBottom,
              { left: leftValue, color: textColor },
            ]}
          >
            {i18n.t("searchPosts")}
          </Animated.Text>
        )}
        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => onChangeText(emptyString)}
            style={styles.closeIconContainer}
          >
            <Ionicons name="close" size={24} color={iconColor} />
          </TouchableOpacity>
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  searchStoreInputUpperContainer: {
    flex: 1,
    position: "absolute",
    width: "100%",
    top: searchInputTopMargin,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  searchStoreInputContainer: {
    borderRadius: 30,
    borderWidth: dividerHeight,
    paddingVertical: distances.xs,
    paddingHorizontal: distances.xs,

    height: searchInputHeight,
    width: "65%",
    flexDirection: "row",
    alignItems: "center",
  },
  searchStoreInput: {
    height: "100%",
    marginLeft: distances.xxs,
    paddingVertical: 0,
    fontSize: 16,
    fontFamily: typography.primary.regular,
    flex: 1,
    zIndex: 1,
  },
  iconSearchContainer: {
    marginLeft: distances.xs,
  },
  iconFilterContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    width: 44,
    borderRadius: 22,
    marginLeft: distances.xs,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  closeIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    width: 44,
    position: "absolute",
    right: 20,
    zIndex: 2,
  },
  placeholderUpper: {
    position: "absolute",
    width: "72.5%",
    fontFamily: typography.primary.regular,
    fontSize: 14,
  },
  placeholderBottom: {
    position: "absolute",
    width: "75%",
    fontFamily: typography.primary.regular,
    fontSize: 14,
  },
});
