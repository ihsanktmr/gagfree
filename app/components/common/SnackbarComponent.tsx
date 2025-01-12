import React from "react";

import { Snackbar } from "react-native-paper";

interface SnackbarProps {
  visible: boolean;
  message: string;
  actionLabel: string;
  onActionPress: () => void;
  onDismiss: () => void;
}

const SnackbarComponent: React.FC<SnackbarProps> = ({
  visible,
  message,
  actionLabel,
  onActionPress,
  onDismiss,
}) => {
  return (
    <Snackbar
      duration={2500}
      visible={visible}
      onDismiss={onDismiss}
      action={{
        label: actionLabel,
        onPress: onActionPress,
      }}
      style={{ backgroundColor: "white" }}
      theme={{
        colors: {
          inverseOnSurface: "black",
          inversePrimary: "black",
        },
      }}
    >
      {message}
    </Snackbar>
  );
};

export default SnackbarComponent;
