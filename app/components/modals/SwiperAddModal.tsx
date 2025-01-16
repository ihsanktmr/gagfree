import React, { useCallback, useEffect, useRef, useState } from "react";

import { distances } from "app/aesthetic/distances";
import { borderRadii } from "app/aesthetic/styleConstants";
import { i18n } from "app/language";
import { StyleSheet, Text, View } from "react-native";
import { Button, Modal } from "react-native-paper";
import Swiper from "react-native-swiper";
import { useDispatch } from "react-redux";

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
  const dispatch = useDispatch();
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
      contentContainerStyle={styles.modalContainer}
    >
      <View
        style={[
          styles.modalContent,
          {
            height: currentIndex === 0 ? 250 : 250,
          },
        ]}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {currentIndex === 0 ? data.title1 : data.title2}
          </Text>
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
          <View>
            <Text style={styles.bodyText}>{data.slide1Text}</Text>
          </View>
          <View>
            <Text style={styles.bodyText}>{data.slide2Text}</Text>
          </View>
        </Swiper>
        <View style={styles.buttonContainer}>
          {currentIndex === 0 ? (
            <Button mode="contained" onPress={handleFunc1}>
              {i18n.t("okay")}
            </Button>
          ) : (
            <Button mode="contained" onPress={handleFunc2}>
              {i18n.t("okay")}
            </Button>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    alignSelf: "center",
    width: "90%",
    borderRadius: borderRadii.large,
    backgroundColor: "white",
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
    textAlign: "center",
  },
  bodyText: {
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: distances.md,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: distances.md,
  },
});
