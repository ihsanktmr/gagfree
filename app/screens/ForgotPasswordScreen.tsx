import React, { useState } from "react";

import { useNavigation } from "@react-navigation/native";
import { ThemedView } from "app/components/containers/ThemedView";
import { AuthScreenNavigationProp } from "app/navigation/types";
import { forgotPasswordRequest } from "app/redux/auth/actions";
import { selectAuthError, selectAuthLoading } from "app/redux/auth/selectors";
import { StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

export const ForgotPasswordScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    dispatch(forgotPasswordRequest(email));
  };

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address and we'll send you instructions to reset your
        password.
      </Text>

      {error && <Text style={styles.error}>{error}</Text>}

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
        onPress={handleSubmit}
        loading={loading}
        style={styles.button}
        disabled={!email || loading}
      >
        Send Reset Instructions
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
