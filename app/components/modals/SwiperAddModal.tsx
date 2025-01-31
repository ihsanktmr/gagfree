import React, { useEffect, useRef } from "react";

import { distances } from "app/aesthetic/distances";
import { borderRadii } from "app/aesthetic/styleConstants";
import { useThemeColor } from "app/hooks/useThemeColor";
import { i18n } from "app/language";
import { StyleSheet, View } from "react-native";
import { Button, Modal } from "react-native-paper";
import Swiper from "react-native-swiper";

import { ThemedView } from "../containers/ThemedView";
import { ThemedText } from "../texts/ThemedText";

interface SwiperTutorialModalProps {
  visible: boolean;
  onDismiss: () => void;
  steps: {
    title: string;
    content: string;
    buttonText: string;
    onStepComplete: () => void;
  }[];
  children?: React.ReactNode;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export const SwiperTutorialModal: React.FC<SwiperTutorialModalProps> = ({
  visible,
  onDismiss,
  steps,
  children,
  currentIndex,
  setCurrentIndex,
}) => {
  const backgroundColor = useThemeColor("background");
  const swiperRef = useRef<Swiper>(null);

  useEffect(() => {
    setCurrentIndex(0);
  }, [visible]); // Reset index when modal visibility changes

  const handleNextStep = () => {
    const currentStep = steps[currentIndex];
    if (currentStep.onStepComplete) {
      currentStep.onStepComplete();
    }

    if (currentIndex < steps.length - 1) {
      swiperRef.current?.scrollBy(1);
      setCurrentIndex(currentIndex + 1);
    } else {
      onDismiss();
      setCurrentIndex(0);
    }
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      style={styles.modalStyle}
      contentContainerStyle={[styles.modalContainer, { backgroundColor }]}
    >
      <ThemedView style={styles.modalContent}>
        <View style={styles.titleContainer}>
          <ThemedText style={styles.title}>
            {steps[currentIndex].title}
          </ThemedText>
        </View>
        <View style={styles.swiperContainer}>
          <Swiper
            ref={swiperRef}
            scrollEnabled={false}
            loop={false}
            autoplay={false}
            showsPagination={true}
            removeClippedSubviews={false}
            onIndexChanged={setCurrentIndex}
          >
            {steps.map((step, index) => (
              <View key={index} style={styles.slideContent}>
                {children}
              </View>
            ))}
          </Swiper>
        </View>
        <ThemedView style={styles.buttonContainer}>
          <Button mode="contained" onPress={handleNextStep}>
            {steps[currentIndex].buttonText}
          </Button>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: "90%",
    maxHeight: "80%",
    marginHorizontal: distances.md,
    padding: distances.md,
    borderRadius: borderRadii.large,
  },
  modalStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    flex: 1,
    minHeight: 400, // Add minimum height
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
  swiperContainer: {
    flex: 1,
    minHeight: 300, // Add minimum height for swiper
  },
  slideContent: {
    flex: 1,
    paddingHorizontal: distances.md,
  },
  bodyText: {
    fontSize: 14,
    textAlign: "left",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: distances.md,
    paddingVertical: distances.sm,
  },
});
