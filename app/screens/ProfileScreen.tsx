import React from "react";
import { useNavigation } from "@react-navigation/native";
import { ThemedView } from "app/components/containers/ThemedView";
import { ProfileActions } from "app/components/profile/ProfileActions";
import { ProfileInfo } from "app/components/profile/ProfileInfo";
import { ProfileStats } from "app/components/profile/ProfileStats";
import { ProfileScreenNavigationProp } from "app/navigation/types";
import { selectIsAuthenticated, selectUser } from "app/redux/auth/selectors";
import { StyleSheet, ScrollView } from "react-native";
import { Button, Divider } from "react-native-paper";
import { useSelector } from "react-redux";
import * as ImagePicker from 'expo-image-picker';

export const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    navigation.navigate("EditProfile");
  };

  const handleAvatarPress = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!pickerResult.canceled) {
        // Handle the selected image
        // You'll need to implement the avatar update logic here
        console.log("Selected image:", pickerResult.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      alert("Failed to pick image");
    }
  };

  if (!isAuthenticated) {
    return (
      <ThemedView style={styles.container}>
        <Button
          mode="contained"
          onPress={() => navigation.replace("Auth", { screen: "Login" })}
          style={styles.loginButton}
        >
          Login to Access Profile
        </Button>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProfileInfo
          avatar={user?.avatar}
          username={user?.username}
          email={user?.email}
          onEditPress={handleEditProfile}
          onAvatarPress={handleAvatarPress}
        />
        <Divider style={styles.divider} />
        <ProfileStats
          postsCount={user?.postsCount}
          rating={user?.rating}
          joinDate={user?.createdAt}
        />
        <Divider style={styles.divider} />
        <ProfileActions />
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  loginButton: {
    marginTop: 20,
  },
  divider: {
    marginVertical: 16,
  },
});
