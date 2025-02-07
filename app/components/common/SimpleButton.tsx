import React from "react";

import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface SimpleButtonProps {
  title: string;
  onPress: () => void;
}

export const SimpleButton: React.FC<SimpleButtonProps> = ({
  title,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
  },
});
