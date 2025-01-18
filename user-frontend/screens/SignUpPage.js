import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { signUpUser } from "../services/api";
import styles from "../styles/SignUpPageStyles";

const SignUpPage = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignUp = async () => {
    if (!username) {
      Alert.alert("Invalid Username", "Please enter a valid username.");
      return;
    }

    if (!firstName) {
      Alert.alert("Invalid First Name", "Please enter your first name.");
      return;
    }

    if (!lastName) {
      Alert.alert("Invalid Last Name", "Please enter your last name.");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one digit, and one special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    try {
      const userData = { username, firstName, lastName, email, password };
      await signUpUser(userData);

      Alert.alert(
        "Success",
        "You have successfully registered! Please verify your email and then sign in.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("SignIn"),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Sign Up Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

export default SignUpPage;
