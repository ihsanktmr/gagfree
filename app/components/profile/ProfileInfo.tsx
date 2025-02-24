import React from "react";

import { useThemeColor } from "app/hooks/useThemeColor";
import { StyleSheet, View } from "react-native";
import { Avatar, Text } from "react-native-paper";

interface ProfileInfoProps {
  avatar?: string;
  username?: string;
  email?: string;
}

export const ProfileInfo = ({ avatar, username, email }: ProfileInfoProps) => {
  const textColor = useThemeColor("text");

  return (
    <View style={styles.container}>
      <Avatar.Image
        size={80}
        source={
          avatar
            ? { uri: avatar }
            : require("../../../assets/images/onboarding-image.png")
        }
      />
      <Text style={[styles.username, { color: textColor }]}>{username}</Text>
      <Text style={[styles.email, { color: textColor }]}>{email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    marginTop: 5,
    opacity: 0.7,
  },
});
