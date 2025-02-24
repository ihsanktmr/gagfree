import React, { useState } from "react";

import { useNavigation } from "@react-navigation/native";
import { ThemedView } from "app/components/containers/ThemedView";
import { AuthScreenNavigationProp } from "app/navigation/types";
import { loginRequest } from "app/redux/auth/actions";
import { selectAuthError, selectAuthLoading } from "app/redux/auth/selectors";
import { StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

export const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    dispatch(loginRequest({ email, password }));
  };

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>

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
  error: {
    color: "red",
    marginBottom: 16,
    textAlign: "center",
  },
});
