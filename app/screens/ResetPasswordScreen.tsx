import React, { useState } from "react";

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { ThemedView } from "app/components/containers/ThemedView";
import {
  AuthScreenNavigationProp,
  AuthStackParamList,
} from "app/navigation/types";
import { resetPasswordRequest } from "app/redux/auth/actions";
import { selectAuthError, selectAuthLoading } from "app/redux/auth/selectors";
import { StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

type ResetPasswordScreenRouteProp = RouteProp<
  AuthStackParamList,
  "ResetPassword"
>;

export const ResetPasswordScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const route = useRoute<ResetPasswordScreenRouteProp>();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const email = route.params.email;

  const handleReset = () => {
    if (newPassword !== confirmPassword) {
      // Handle password mismatch
      return;
    }
    dispatch(resetPasswordRequest({ email, code, newPassword }));
  };

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Create New Password</Text>
      <Text style={styles.subtitle}>
        Enter the code we sent to your email and your new password.
      </Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        label="Reset Code"
        value={code}
        onChangeText={setCode}
        style={styles.input}
        mode="outlined"
        keyboardType="number-pad"
      />

      <TextInput
        label="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
        mode="outlined"
        secureTextEntry={!showPassword}
        right={
          <TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />

      <TextInput
        label="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        mode="outlined"
        secureTextEntry={!showPassword}
      />

      <Button
        mode="contained"
        onPress={handleReset}
        loading={loading}
        style={styles.button}
        disabled={!code || !newPassword || !confirmPassword || loading}
      >
        Reset Password
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.replace("Auth", { screen: "Login" })}
        style={styles.textButton}
      >
        Back to Login
      </Button>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.7,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  textButton: {
    marginTop: 8,
  },
  error: {
    color: "red",
    marginBottom: 16,
    textAlign: "center",
  },
});
