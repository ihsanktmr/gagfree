import React from "react";

import { distances } from "app/aesthetic/distances";
import { borderRadii } from "app/aesthetic/styleConstants";
import { useThemeColor } from "app/hooks/useThemeColor";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Modal as PaperModal } from "react-native-paper";

type ModalDimension = number | `${number}%` | "auto";

interface BaseModalProps {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  width?: ModalDimension;
  height?: ModalDimension;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  visible,
  onDismiss,
  children,
  containerStyle,
  contentStyle,
  width = "80%",
  height,
}) => {
  const backgroundColor = useThemeColor("background");

  return (
    <PaperModal
      visible={visible}
      onDismiss={onDismiss}
      style={styles.modalStyle}
    >
      <View
        style={[
          styles.modalContainer,
          {
            backgroundColor,
            width: width as ModalDimension,
            ...(height && { height: height as ModalDimension }),
          },
          containerStyle,
        ]}
      >
        <View style={[styles.modalContent, contentStyle]}>{children}</View>
      </View>
    </PaperModal>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    justifyContent: "center",
  },
  modalContainer: {
    marginHorizontal: distances.md,
    padding: distances.md,
    borderRadius: borderRadii.large,
  },
  modalContent: {
    width: "100%",
  },
});
