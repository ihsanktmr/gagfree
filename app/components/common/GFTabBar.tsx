import React from "react";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  getBottomTabBarHeight,
  mainTabBarBottomMargin,
} from "app/aesthetic/styleConstants";
import { useThemeColor } from "app/hooks/useThemeColor";
import { i18n } from "app/language";
import { triggerSelectionChangeFeedback } from "app/utils/haptics";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MainTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export const MainTabBar: React.FC<MainTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const bottomTabBarHeight = getBottomTabBarHeight();

  const iconColor = useThemeColor("icon");
  const backgroundColor = useThemeColor("background");
  const mainColor = useThemeColor("main");

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
      }}
    >
      <View
        style={[
          {
            ...styles.mainTabBarContainer,
            height: bottomTabBarHeight,
            backgroundColor: backgroundColor,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          let label = "";
          let icon: React.ReactNode = null;

          if (route.name === "Posts") {
            icon = <MaterialIcons name="home" size={24} color={iconColor} />;
            label = i18n.t("posts");
          } else if (route.name === "Settings") {
            icon = <Ionicons name="settings" size={24} color={iconColor} />;
            label = i18n.t("settings");
          } else if (route.name === "Chats") {
            icon = <Ionicons name="text" size={24} color={iconColor} />;
            label = i18n.t("chats");
          }

          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              triggerSelectionChangeFeedback();
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          return (
            <TouchableOpacity
              activeOpacity={1}
              onPress={onPress}
              style={styles.tabBarItemTouchable}
            >
              <View style={styles.tabBarIconContainer}>{icon}</View>
              <Text
                numberOfLines={1}
                style={{
                  ...styles.tabBarText,
                  fontSize: isFocused ? 9.5 : 9,
                  color: mainColor,
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainTabBarContainer: {
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 15,
    width: "45%",
    position: "absolute",
    bottom: mainTabBarBottomMargin,
    alignItems: "center",
  },
  tabBarItemTouchable: {
    flex: 1,
    alignItems: "center",
  },
  tabBarIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarText: {},
});

export default MainTabBar;
