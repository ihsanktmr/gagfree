import React, { useState } from "react";

import { useMutation, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { ThemedView } from "app/components/containers/ThemedView";
import { AuthScreenNavigationProp } from "app/navigation/types";
import { loginSuccess } from "app/redux/auth/actions";
import { GET_USERS, LOGIN } from "app/services/authServices";
import { StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useDispatch } from "react-redux";

export const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<AuthScreenNavigationProp>();

  const { data: usersData } = useQuery(GET_USERS);

  const [login, { loading, error }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      console.log("Login successful:", data);
      dispatch(loginSuccess(data.login));
      navigation.replace("Main");
    },
    onError: (error) => {
      console.error(
        "GraphQL Error:",
        error.message,
        error.graphQLErrors,
        error.networkError,
      );
    },
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleDevFill = () => {
    setEmail("test@test.com");
    setPassword("password123");
    console.log("Dev fill - using credentials:", {
      email: "test@test.com",
      password: "password123",
    });
  };

  const handleLogin = async () => {
    try {
      const trimmedEmail = email.trim().toLowerCase();

      console.log("Existing users:", usersData?.users);
      console.log("Attempting login with:", { email: trimmedEmail });

      const response = await login({
        variables: {
          email: trimmedEmail,
          password,
        },
      });
      console.log("Login response:", response);
    } catch (err: any) {
      console.error("Login error full details:", {
        message: err.message,
        graphQLErrors: err.graphQLErrors,
        networkError: err.networkError,
      });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>

      {error && (
        <Text style={styles.error}>
          {error.graphQLErrors?.[0]?.message ||
            "Login failed. Please check your credentials."}
        </Text>
      )}

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

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        style={styles.button}
        disabled={!email || !password || loading}
      >
        Login
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
        onPress={() => navigation.replace("Auth", { screen: "ForgotPassword" })}
        style={styles.textButton}
      >
        Forgot Password?
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.replace("Auth", { screen: "Signup" })}
        style={styles.textButton}
      >
        Don't have an account? Sign up
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
  devButton: {
    marginTop: 8,
    backgroundColor: "#FFE0E0", // Light red to indicate dev feature
  },
  error: {
    color: "red",
    marginBottom: 16,
    textAlign: "center",
  },
});
