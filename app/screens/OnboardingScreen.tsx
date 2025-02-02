import React from "react";

import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { distances } from "app/aesthetic/distances";
import { borderRadii } from "app/aesthetic/styleConstants";
import { typography } from "app/aesthetic/typography";
import { Button } from "app/components/buttons/Button";
import { ThemedView } from "app/components/containers/ThemedView";
import { ThemedText } from "app/components/texts/ThemedText";
import { useThemeColor } from "app/hooks/useThemeColor";
import { i18n } from "app/language";
import { RootStackParamList } from "app/navigation/types";
import { setOnboardingSeen } from "app/redux/misc/actions";
import { triggerHeavyFeedback } from "app/utils/haptics";
import { Image, StyleSheet, View } from "react-native";
import Swiper from "react-native-swiper";
import { useDispatch } from "react-redux";

type NavigationProps = NavigationProp<RootStackParamList>;

export function OnboardingScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProps>();

  const iconColor = useThemeColor("background");
  const textColor = useThemeColor("text");

  const handleNextPress = () => {
    triggerHeavyFeedback();
    dispatch(setOnboardingSeen());
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" }],
    });
  };

  return (
    <ThemedView style={styles.container}>
      <Swiper
        showsPagination={true}
        loop={false}
        paginationStyle={styles.paginationStyle}
        dotStyle={{ ...styles.dotStyle, backgroundColor: textColor }}
        activeDotStyle={{
          ...styles.activeDotStyle,
          backgroundColor: "#007bff",
        }}
      >
        <View style={styles.slide}>
          <Image
            source={require("../../assets/images/onboarding-image.png")}
            style={styles.image}
            resizeMode="stretch"
          />
          <ThemedText type="title" style={[styles.title, { color: textColor }]}>
            {i18n.t("onboardingTitle1")}
          </ThemedText>
          <ThemedText
            type="subtitle"
            style={[styles.description, { color: textColor }]}
          >
            {i18n.t("onboardingDescription1")}
          </ThemedText>
        </View>

        <View style={styles.slide}>
          <Image
            source={require("../../assets/images/onboarding-image2.png")}
            style={styles.image}
            resizeMode="stretch"
          />
          <ThemedText type="title" style={[styles.title, { color: textColor }]}>
            {i18n.t("onboardingTitle2")}
          </ThemedText>
          <ThemedText
            type="subtitle"
            style={[styles.description, { color: textColor }]}
          >
            {i18n.t("onboardingDescription2")}
          </ThemedText>
        </View>

        <View style={styles.slide}>
          <Image
            source={require("../../assets/images/onboarding-image3.png")}
            style={styles.image}
            resizeMode="stretch"
          />
          <ThemedText type="title" style={[styles.title, { color: textColor }]}>
            {i18n.t("onboardingTitle3")}
          </ThemedText>
          <ThemedText
            type="subtitle"
            style={[styles.description, { color: textColor }]}
          >
            {i18n.t("onboardingDescription3")}
          </ThemedText>
        </View>
      </Swiper>

      <ThemedView style={styles.buttonContainer}>
        <Button
          text={i18n.t("discover")}
          onPress={handleNextPress}
          rightIcon={
            <Ionicons name="arrow-forward" size={24} color={iconColor} />
          }
          iconSize="medium"
          loading={false}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: distances.md,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    borderRadius: borderRadii.extraLarge,
    width: 200,
    height: 250,
    marginBottom: distances.xl,
  },
  title: {
    fontSize: 24,
    fontFamily: typography.primary.bold,
    marginBottom: distances.xl,
  },
  description: {
    width: 300,
    fontSize: 16,
    textAlign: "center",
    marginBottom: distances.xxl,
    fontFamily: typography.secondary.regular,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    paddingBottom: distances.xxxl,
  },
  paginationStyle: {
    marginBottom: distances.xl,
  },
  dotStyle: {},
  activeDotStyle: {},
});
