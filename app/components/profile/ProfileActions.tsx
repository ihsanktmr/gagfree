import React from "react";

import { useNavigation } from "@react-navigation/native";
import { ProfileScreenNavigationProp } from "app/navigation/types";
import { logout } from "app/redux/auth/actions";
import { StyleSheet, View } from "react-native";
import { Button, Divider, List } from "react-native-paper";
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
          description="Change your profile details"
          left={(props) => <List.Icon {...props} icon="account-edit" />}
          onPress={() => navigation.navigate("EditProfile")}
          style={styles.listItem}
        />
        <Divider />
        <List.Item
          title="My Posts"
          description="View and manage your posts"
          left={(props) => <List.Icon {...props} icon="post" />}
          onPress={() => navigation.navigate("MyPosts")}
          style={styles.listItem}
        />
      </List.Section>

      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
        textColor="purple"
      >
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  listItem: {
    paddingVertical: 8,
  },
  logoutButton: {
    marginTop: 24,
    alignSelf: "center",
    width: "90%",
    borderRadius: 8,
  },
});
