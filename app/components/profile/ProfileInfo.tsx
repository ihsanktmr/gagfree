import React from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "app/hooks/useThemeColor";
import { Pressable, StyleSheet, View } from "react-native";
import { Avatar, Button, Text } from "react-native-paper";

interface ProfileInfoProps {
  avatar?: string;
  username?: string;
  email?: string;
  onEditPress?: () => void;
  onAvatarPress?: () => void;
}

export const ProfileInfo = ({
  avatar,
  username,
  email,
  onEditPress,
  onAvatarPress,
}: ProfileInfoProps) => {
  const textColor = useThemeColor("text");
  const mainColor = useThemeColor("main");

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Pressable onPress={onAvatarPress}>
          <Avatar.Image
            size={100}
            source={
              avatar
                ? { uri: avatar }
                : require("../../../assets/images/onboarding-image.png")
            }
            style={styles.avatar}
          />
          <View
            style={[styles.editAvatarBadge, { backgroundColor: mainColor }]}
          >
            <MaterialIcons name="photo-camera" size={14} color="white" />
          </View>
        </Pressable>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.nameContainer}>
          <Text style={[styles.username, { color: textColor }]}>
            {username || "Username"}
          </Text>
          {onEditPress && (
            <Button
              mode="text"
              onPress={onEditPress}
              icon="pencil"
              compact
              style={styles.editButton}
            >
              Edit
            </Button>
          )}
        </View>
        <Text style={[styles.email, { color: textColor }]}>
          {email || "email@example.com"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  editAvatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  infoContainer: {
    alignItems: "center",
    width: "100%",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    opacity: 0.7,
  },
  editButton: {
    marginLeft: 8,
  },
});
