import React, { useState } from "react";

import { useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { ThemedView } from "app/components/containers/ThemedView";
import { AuthScreenNavigationProp } from "app/navigation/types";
import { signupRequest } from "app/redux/auth/actions";
import { selectAuthError, selectAuthLoading } from "app/redux/auth/selectors";
import { SIGNUP } from "app/services/authServices";
import { StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

export const SignupScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [signup, { loading: mutationLoading, error: mutationError }] =
    useMutation(SIGNUP, {
      onCompleted: (data) => {
        dispatch(signupRequest(data.signup));
        navigation.replace("Main");
      },
    });

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      // Handle password mismatch
      return;
    }

    try {
      await signup({
        variables: {
          input: {
            username,
            email,
            password,
          },
        },
      });
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  const handleDevFill = () => {
    setUsername("testuser");
    setEmail("test@test.com");
    setPassword("password123");
    setConfirmPassword("password123");
    console.log("Dev fill - using credentials:", {
      email: "test@test.com",
      password: "password123",
    });
  };

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {mutationError && (
        <Text style={styles.error}>
          {mutationError.message || "Signup failed"}
        </Text>
      )}

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

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
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
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        mode="outlined"
        secureTextEntry={!showPassword}
      />

      <Button
        mode="contained"
        onPress={handleSignup}
        loading={mutationLoading}
        style={styles.button}
        disabled={
          !username ||
          !email ||
          !password ||
          !confirmPassword ||
          mutationLoading
        }
      >
        Sign Up
      </Button>

      {__DEV__ && (
        <Button
          mode="outlined"
          onPress={handleDevFill}
          style={styles.devButton}
          icon="developer-mode"
        >
          Dev: Auto Fill Form
        </Button>
      )}

      <Button
        mode="text"
        onPress={() => navigation.replace("Auth", { screen: "Login" })}
        style={styles.textButton}
      >
        Already have an account? Login
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
    marginBottom: 24,
    textAlign: "center",
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
  devButton: {
    marginTop: 8,
    backgroundColor: "#FFE0E0",
  },
});
