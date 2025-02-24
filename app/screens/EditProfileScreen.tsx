import React, { useState } from "react";

import { Header } from "app/components/common/Header";
import { ThemedView } from "app/components/containers/ThemedView";
import { updateUserRequest } from "app/redux/auth/actions";
import { selectUser } from "app/redux/auth/selectors";
import * as ImagePicker from "expo-image-picker";
import { ScrollView, StyleSheet } from "react-native";
import { Avatar, Button, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

export const EditProfileScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      dispatch(
        updateUserRequest({
          username,
          email,
          avatar,
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Header title="Edit Profile" />
      <ScrollView style={styles.content}>
        <Avatar.Image
          size={100}
          source={avatar ? { uri: avatar } : null}
          style={styles.avatar}
        />
        <Button
          onPress={handlePickImage}
          mode="outlined"
          style={styles.pickButton}
        >
          Change Profile Picture
        </Button>

        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Button
          mode="contained"
          onPress={handleSave}
          loading={loading}
          style={styles.saveButton}
        >
          Save Changes
        </Button>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  avatar: {
    alignSelf: "center",
    marginVertical: 20,
  },
  pickButton: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 8,
  },
});
