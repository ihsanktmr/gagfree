import React, { useCallback } from "react";

import { distances } from "app/aesthetic/distances";
import { borderRadii } from "app/aesthetic/styleConstants";
import { typography } from "app/aesthetic/typography";
import { useThemeColor } from "app/hooks/useThemeColor";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "../texts/ThemedText";
import { Icon, MaterialIconName } from "./Icon";

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: MaterialIconName;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  selected,
  onPress,
  icon,
}) => {
  const mainColor = useThemeColor("main");
  const backgroundColor = useThemeColor("background");
  const scale = new Animated.Value(1);

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ scale }],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.chip,
            {
              backgroundColor: selected ? mainColor : backgroundColor,
              borderColor: mainColor,
            },
          ]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.7}
        >
          {icon && (
            <Icon
              type="material"
              name={icon}
              size={16}
              color={selected ? backgroundColor : mainColor}
              style={styles.icon}
            />
          )}
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
          {selected && (
            <Icon
              type="material"
              name="check"
              size={16}
              color={backgroundColor}
              style={styles.checkIcon}
            />
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: distances.xs,
  },
  container: {},
  chip: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: distances.md,
    borderRadius: borderRadii.large,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    paddingVertical: distances.xs,
  },
  label: {
    fontSize: 14,
    fontFamily: typography.secondary.medium,
  },
  icon: {
    marginRight: distances.xs,
  },
  checkIcon: {
    marginLeft: distances.xs,
  },
});
