import React, { useEffect, useRef, useState } from "react";

import { distances } from "app/aesthetic/distances";
import { borderRadii } from "app/aesthetic/styleConstants";
import { useThemeColor } from "app/hooks/useThemeColor";
import { i18n } from "app/language";
import { StyleSheet, Text, View } from "react-native";
import { Button, Modal } from "react-native-paper";
import Swiper from "react-native-swiper";

import { ThemedView } from "../containers/ThemedView";
import { ThemedText } from "../texts/ThemedText";

interface SwiperTutorialModalProps {
  visible: boolean;
  onDismiss: () => void;
  data: {
    title1: string;
    title2: string;
    slide1Text: string;
    slide2Text: string;
    func1?: () => void;
    func2?: () => void;
  };
}

export const SwiperTutorialModal: React.FC<SwiperTutorialModalProps> = ({
  visible,
  onDismiss,
  data,
}) => {
  const backgroundColor = useThemeColor("background");
  const swiperRef = useRef<Swiper>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, []);

  const handleFunc1 = () => {
    swiperRef.current?.scrollBy(1);
    setCurrentIndex(1);
  };

  const handleFunc2 = () => {
    onDismiss();
    setCurrentIndex(0);
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      style={styles.modalStyle}
      contentContainerStyle={[styles.modalContainer, { backgroundColor }]}
    >
      <ThemedView
        style={[
          styles.modalContent,
          {
            height: currentIndex === 0 ? 250 : 250,
          },
        ]}
      >
        <View style={styles.titleContainer}>
          <ThemedText style={styles.title}>
            {currentIndex === 0 ? data.title1 : data.title2}
          </ThemedText>
        </View>
        <Swiper
          ref={swiperRef}
          scrollEnabled={false}
          loop={true}
          autoplay={false}
          showsPagination={false}
          removeClippedSubviews={true}
          onIndexChanged={setCurrentIndex}
        >
          <ThemedView>
            <ThemedText style={styles.bodyText}>{data.slide1Text}</ThemedText>
          </ThemedView>
          <ThemedView>
            <ThemedText style={styles.bodyText}>{data.slide2Text}</ThemedText>
          </ThemedView>
        </Swiper>
        <ThemedView style={styles.buttonContainer}>
          {currentIndex === 0 ? (
            <Button mode="contained" onPress={handleFunc1}>
              {i18n.t("okay")}
            </Button>
          ) : (
            <Button mode="contained" onPress={handleFunc2}>
              {i18n.t("okay")}
            </Button>
          )}
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: "80%",
    marginHorizontal: distances.md,
    padding: distances.md,
    borderRadius: borderRadii.large,
  },
  modalStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    paddingVertical: distances.md,
  },
  titleContainer: {
    marginBottom: distances.md,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
  },
  bodyText: {
    fontSize: 14,
    textAlign: "left",
    marginHorizontal: distances.md,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: distances.md,
  },
});
