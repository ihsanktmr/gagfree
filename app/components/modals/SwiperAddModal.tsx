import React, { useEffect, useRef } from "react";

import { distances } from "app/aesthetic/distances";
import { borderRadii } from "app/aesthetic/styleConstants";
import { typography } from "app/aesthetic/typography";
import { useThemeColor } from "app/hooks/useThemeColor";
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
    onStepComplete?: () => Promise<boolean> | boolean;
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
    if (visible) {
      setCurrentIndex(0);
    }
  }, [visible, setCurrentIndex]);

  const handleNextStep = async () => {
    const currentStep = steps[currentIndex];

    // Check if onStepComplete exists and execute it
    if (typeof currentStep.onStepComplete === "function") {
      const result = await Promise.resolve(currentStep.onStepComplete());
      if (!result) {
        return;
      }
    }

    // Handle last step
    if (currentIndex === steps.length - 1) {
      onDismiss();
      setCurrentIndex(0);
      return;
    }

    // Move to next step if not last
    setCurrentIndex(currentIndex + 1);
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
            paginationStyle={styles.pagination}
            dotStyle={styles.paginationDot}
            activeDotStyle={styles.activePaginationDot}
          >
            {steps.map((step, index) => (
              <View key={index} style={styles.slideContent}>
                {children}
              </View>
            ))}
          </Swiper>
        </View>

        <ThemedView style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleNextStep}
            style={styles.button}
          >
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
    marginHorizontal: distances.md,
  },
  modalStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    flex: 1,
    minHeight: 500, // Add minimum height
    borderRadius: borderRadii.large,
  },
  titleContainer: {
    marginBottom: distances.md,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontFamily: typography.primary.medium,
    letterSpacing: 0.5,
    textAlign: "center",
    marginVertical: distances.md,
    textTransform: "uppercase",
    opacity: 0.9,
  },
  swiperContainer: {
    flex: 1,
    minHeight: 300, // Add minimum height for swiper
  },
  slideContent: {
    flex: 1,
    paddingHorizontal: distances.md,
    paddingBottom: distances.xl, // Add more padding for pagination
  },
  bodyText: {
    fontSize: 14,
    textAlign: "left",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: distances.md,
    paddingVertical: distances.md,
    borderRadius: borderRadii.large,
  },
  button: {
    minWidth: 120, // Add minimum width for button
  },
  pagination: {
    bottom: -15, // Adjust if needed
    paddingVertical: distances.md,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activePaginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
