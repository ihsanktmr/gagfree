import React from "react";

import { Entypo, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { distances } from "app/aesthetic/distances";
import { scrollViewBottomGap } from "app/aesthetic/styleConstants";
import { PRIVACY_POLICY, TERMS_AND_CONDITIONS, appInfo } from "app/appInfo";
import { SettingButton } from "app/components/buttons/SettingsButton";
import { ThemedView } from "app/components/containers/ThemedView";
import { ThemedText } from "app/components/texts/ThemedText";
import { useThemeColor } from "app/hooks/useThemeColor";
import { i18n } from "app/language";
import { selectTheme } from "app/redux/theme/selectors";
import { shareApp } from "app/utils/share";
import { Linking, ScrollView, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

export function SettingsScreen() {
  const theme = useSelector(selectTheme);
  const backgroundColor = useThemeColor("background");

  const navigation = useNavigation();

  const iconColor = useThemeColor("icon");

  const handleFeedback = () => {
    Linking.openURL(`mailto:${appInfo.infoMail}`);
  };

  const handleShare = () => {
    shareApp();
  };

  const handleInstagram = async () => {
    try {
      await Linking.openURL("instagram://user?username=username");
    } catch (e) {
      await Linking.openURL("https://www.instagram.com/gagfreeapp/");
    }
  };

  const handlePrivacy = async () => {
    try {
      await Linking.openURL(PRIVACY_POLICY);
    } catch (e) {}
  };

  const handleTerms = async () => {
    try {
      await Linking.openURL(TERMS_AND_CONDITIONS);
    } catch (e) {}
  };

  const handleBookmarks = () => {
    navigation.navigate("BookmarksScreen");
  };

  const handleNotifications = () => {
    navigation.navigate("NotificationsScreen");
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ ...styles.scrollContainer, backgroundColor }}
      contentContainerStyle={styles.containerContent}
    >
      <ThemedView style={styles.container}>
        <ThemedText style={{ marginBottom: distances.md }} type="title">
          {i18n.t("settings")}
        </ThemedText>
        <SettingButton
          onPress={() => null}
          name={i18n.t("theme")}
          icon={
            theme === "dark" ? (
              <Ionicons name="sunny" size={24} color="yellow" />
            ) : (
              <Ionicons name="moon" size={24} color={iconColor} />
            )
          }
          selection={i18n.t("system")}
          disabled
        />
        <SettingButton
          onPress={handleBookmarks}
          name={i18n.t("bookmarks")}
          icon={<Entypo name="bookmarks" size={24} color={iconColor} />}
          nextIcon={true}
        />
         <SettingButton
          onPress={handleNotifications}
          name={i18n.t("notifications")}
          icon={<Entypo name="bookmarks" size={24} color={iconColor} />}
          nextIcon={true}
        />
        <SettingButton
          onPress={handleFeedback}
          name={i18n.t("giveUsFeedback")}
          icon={
            <Ionicons name="chatbubble-ellipses" size={24} color={iconColor} />
          }
        />
        <SettingButton
          onPress={handleShare}
          name={i18n.t("share")}
          icon={<Ionicons name="share" size={24} color={iconColor} />}
        />
        <SettingButton
          onPress={handleInstagram}
          name={i18n.t("instagram")}
          icon={<Ionicons name="logo-instagram" size={24} color={iconColor} />}
        />
        <SettingButton
          onPress={handleTerms}
          name={i18n.t("termsOfService")}
          icon={<Ionicons name="document-text" size={24} color={iconColor} />}
        />
        <SettingButton
          onPress={handlePrivacy}
          name={i18n.t("privacyPolicy")}
          icon={
            <Ionicons name="shield-checkmark" size={24} color={iconColor} />
          }
        />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  containerContent: {
    paddingBottom: scrollViewBottomGap,
  },
  container: {
    flex: 1,
    paddingHorizontal: distances.md,
    paddingTop: distances.md,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: distances.md,
  },
});
