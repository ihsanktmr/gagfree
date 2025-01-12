import React from "react";

import { Ionicons } from "@expo/vector-icons";
import { Button } from "app/components/buttons/Button";
import { IconButton } from "app/components/buttons/IconButton";
import { GenericCheckBox } from "app/components/common/GenericCheckBox";
import { Header } from "app/components/common/Header";
import { SwitchComponent } from "app/components/common/SwitchComponent";
import ParallaxScrollView from "app/components/containers/ParallaxScrollView";
import { ThemedView } from "app/components/containers/ThemedView";
import { ThemedText } from "app/components/texts/ThemedText";
import { HelloWave } from "app/components/visuals/HelloWave";
import { useThemeColor } from "app/hooks/useThemeColor";
import { useToggle } from "app/hooks/useToggle";
import { i18n } from "app/language";
import { useLanguage } from "app/providers/LanguageProvider";
import { toggleTheme } from "app/redux/theme/actions";
import { selectTheme } from "app/redux/theme/selectors";
import { StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export function HomeScreen() {
  const theme = useSelector(selectTheme);
  const iconColor = useThemeColor("background");
  const dispatch = useDispatch();
  const { language, setLanguage } = useLanguage();
  const [isChecked, toggleChecked] = useToggle(); // Using useToggle for state
  const [isSwitchOn, toggleSwitch] = useToggle(); // Using useToggle for state

  const handleToggleLanguage = () => {
    const newLanguage = language === "en" ? "tr" : "en";
    setLanguage(newLanguage);
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleLeftPress = () => {
    console.log("Left icon pressed");
  };

  const handleRightPress = () => {
    console.log("Right icon pressed");
  };

  return (
    <>
      <Header
        title="Home"
        leftIcon={<Ionicons name="menu" size={24} color={iconColor} />}
        rightIcon={
          <Ionicons name="notifications" size={24} color={iconColor} />
        }
        onLeftPress={handleLeftPress}
        onRightPress={handleRightPress}
      />
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={undefined}
      >
        <ThemedView style={styles.checkboxContainer}>
          <GenericCheckBox selected={isChecked} />
          <ThemedText
            type="subtitle"
            onPress={toggleChecked}
            style={styles.label}
          >
            {isChecked ? "Checked" : "Unchecked"}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.switchContainer}>
          <SwitchComponent status={isSwitchOn} onToggle={toggleSwitch} />
          <ThemedText type="subtitle" style={styles.label}>
            {isSwitchOn ? "On" : "Off"}
          </ThemedText>
        </ThemedView>

        <ThemedText type="title">Theme: {theme}!</ThemedText>

        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">{i18n.t("welcome")}</ThemedText>
          <HelloWave />
          <IconButton
            icon={
              theme === "dark" ? (
                <Ionicons name="sunny" size={24} color="yellow" />
              ) : (
                <Ionicons name="moon" size={24} color="black" />
              )
            }
            onPress={handleToggleTheme}
          />
        </ThemedView>
        <Button
          text={i18n.t("changeLanguage")}
          onPress={handleToggleLanguage}
          leftIcon={<Ionicons name="globe" size={24} color={iconColor} />}
          iconSize="medium"
          loading={false}
        />
        <Button
          text="Submit"
          onPress={() => console.log("Button Pressed")}
          leftIcon={<Ionicons name="arrow-back" size={24} color={iconColor} />}
          rightIcon={<Ionicons name="checkmark" size={24} color={iconColor} />}
          iconSize="medium"
          loading={false}
        />
      </ParallaxScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  label: {
    marginLeft: 8,
  },
});
