import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, StatusBar, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
    if (!username.trim()) return Alert.alert("Error", "Username is required.");
    if (!firstName.trim()) return Alert.alert("Error", "First name is required.");
    if (!lastName.trim()) return Alert.alert("Error", "Last name is required.");
    if (!validateEmail(email)) return Alert.alert("Error", "Invalid email address.");
    if (!validatePassword(password)) {
      return Alert.alert(
        "Error",
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
    }
    if (password !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match.");
    }

    try {
      const userData = { username, firstName, lastName, email, password };
      await signUpUser(userData);
      Alert.alert("Success", "Registration successful! Please sign in.", [
        { text: "OK", onPress: () => navigation.navigate("SignIn") },
      ]);
    } catch (error) {
      Alert.alert("Sign Up Failed", error.message || "Something went wrong.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#1d2f23", "#1d2f23"]} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Create an Account</Text>

          <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} placeholderTextColor="#A9A9A9" />
          <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} placeholderTextColor="#A9A9A9" />
          <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} placeholderTextColor="#A9A9A9" />
          <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} placeholderTextColor="#A9A9A9" />
          <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} placeholderTextColor="#A9A9A9" />
          <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} placeholderTextColor="#A9A9A9" />
          <Text style={styles.passwordHint}>Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.</Text>

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signInRedirect} onPress={() => navigation.navigate("SignIn")}>
            <Text style={styles.signInRedirectText}>Already have an account? <Text style={styles.signInLink}>Sign In</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default SignUpPage;
