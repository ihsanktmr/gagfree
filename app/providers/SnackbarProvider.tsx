import React, { ReactNode, createContext, useContext, useState } from "react";

import SnackbarComponent from "app/components/common/SnackbarComponent";

interface SnackbarContextType {
  showSnackbar: (
    message: string,
    actionLabel: string,
    onActionPress: () => void,
  ) => void;
  hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined,
);

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [actionLabel, setActionLabel] = useState("");
  const [onActionPress, setOnActionPress] = useState<() => void>(
    () => () => {},
  );

  const showSnackbar = (
    message: string,
    actionLabel: string,
    onActionPress: () => void,
  ) => {
    setMessage(message);
    setActionLabel(actionLabel);
    setOnActionPress(() => onActionPress);
    setVisible(true);
  };

  const hideSnackbar = () => setVisible(false);

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      <SnackbarComponent
        visible={visible}
        message={message}
        actionLabel={actionLabel}
        onActionPress={onActionPress}
        onDismiss={hideSnackbar}
      />
    </SnackbarContext.Provider>
  );
};
