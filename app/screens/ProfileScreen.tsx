import React from "react";

import { useNavigation } from "@react-navigation/native";
import { ThemedView } from "app/components/containers/ThemedView";
import { ProfileActions } from "app/components/profile/ProfileActions";
import { ProfileInfo } from "app/components/profile/ProfileInfo";
import { ProfileStats } from "app/components/profile/ProfileStats";
import { ProfileScreenNavigationProp } from "app/navigation/types";
import { selectIsAuthenticated, selectUser } from "app/redux/auth/selectors";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useSelector } from "react-redux";

export const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

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
      <ProfileInfo
        avatar={user?.avatar}
        username={user?.username}
        email={user?.email}
      />
      <ProfileStats
        postsCount={user?.postsCount}
        rating={user?.rating}
        joinDate={user?.createdAt}
      />
      <ProfileActions />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loginButton: {
    marginTop: 20,
  },
});
