import React from "react";

import { distances } from "app/aesthetic/distances";
import { borderRadii } from "app/aesthetic/styleConstants";
import { ThemedText } from "app/components/texts/ThemedText";
import { i18n } from "app/language";
import { StyleSheet, View } from "react-native";
import { Button, Modal } from "react-native-paper";

interface InternetModalProps {
  visible: boolean;
  backgroundColor: string;
  onRetry: () => void;
  onDismiss: () => void;
}

export const InternetModal: React.FC<InternetModalProps> = ({
  visible,
  backgroundColor,
  onRetry,
  onDismiss,
}) => {
  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={[styles.modalContainer, { backgroundColor }]}
    >
      <ThemedText style={styles.modalText}>{i18n.t("noInternet")}</ThemedText>
      <View style={styles.modalActions}>
        <Button mode="contained" onPress={onRetry}>
          {i18n.t("retry")}
        </Button>
        <View style={styles.modalSpacer} />
        <Button mode="contained" onPress={onDismiss}>
          {i18n.t("okay")}
        </Button>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: 300,
    padding: distances.md,
    borderRadius: borderRadii.large,
  },
  modalText: {
    fontSize: 14,
    marginBottom: distances.md,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalSpacer: {
    width: 10,
  },
});
