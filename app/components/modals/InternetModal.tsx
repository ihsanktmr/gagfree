import React from "react";

import { distances } from "app/aesthetic/distances";
import { i18n } from "app/language";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

import { BaseModal } from "../common/Modal";
import { ThemedText } from "../texts/ThemedText";

interface InternetModalProps {
  visible: boolean;
  onRetry: () => void;
  onDismiss: () => void;
}

export const InternetModal: React.FC<InternetModalProps> = ({
  visible,
  onRetry,
  onDismiss,
}) => {
  return (
    <BaseModal
      visible={visible}
      onDismiss={onDismiss}
      width="80%"
      contentStyle={styles.contentContainer}
    >
      <View style={styles.content}>
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
      </View>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: distances.md,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  modalText: {
    fontSize: 14,
    marginBottom: distances.md,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  modalSpacer: {
    width: distances.sm,
  },
});
