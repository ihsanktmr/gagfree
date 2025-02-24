import React from "react";

import { useNavigation } from "@react-navigation/native";
import { ProfileScreenNavigationProp } from "app/navigation/types";
import { logout } from "app/redux/auth/actions";
import { StyleSheet, View } from "react-native";
import { Button, List } from "react-native-paper";
import { useDispatch } from "react-redux";

export const ProfileActions = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigation.replace("Auth", { screen: "Login" });
  };

  return (
    <View style={styles.container}>
      <List.Section>
        <List.Item
          title="Edit Profile"
          left={(props) => <List.Icon {...props} icon="account-edit" />}
          onPress={() => navigation.navigate("EditProfile")}
        />
        <List.Item
          title="My Posts"
          left={(props) => <List.Icon {...props} icon="post" />}
          onPress={() => navigation.navigate("MyPosts")}
        />
        <List.Item
          title="Settings"
          left={(props) => <List.Icon {...props} icon="cog" />}
          onPress={() => navigation.navigate("Settings")}
        />
      </List.Section>

      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
        color="red"
      >
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  logoutButton: {
    marginTop: 20,
    marginHorizontal: 16,
  },
});
