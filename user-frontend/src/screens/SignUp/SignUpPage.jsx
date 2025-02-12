import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../../styles/SignUpPageStyles";
``;
import { COLORS } from "../../styles/WelcomePageStyles";
import { signUpUser } from "../../services/userApi";

const SignUpPage = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignUp = async () => {
    // Trim inputs to remove accidental spaces
    const trimmedUsername = username.trim();
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    // Validation Checks
    if (!trimmedUsername) {
      return Alert.alert("Error", "Username is required.");
    }
    if (!trimmedFirstName) {
      return Alert.alert("Error", "First name is required.");
    }
    if (!trimmedLastName) {
      return Alert.alert("Error", "Last name is required.");
    }
    if (!validateEmail(trimmedEmail)) {
      return Alert.alert("Error", "Please enter a valid email address.");
    }
    if (!validatePassword(trimmedPassword)) {
      return Alert.alert(
        "Error",
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
    }
    if (trimmedPassword !== trimmedConfirmPassword) {
      return Alert.alert("Error", "Passwords do not match.");
    }
    if (!accepted) {
      return Alert.alert("Error", "You must accept the Terms and Conditions.");
    }

    // Preparing user data
    const userData = {
      username: trimmedUsername,
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      email: trimmedEmail,
      password: trimmedPassword,
    };

    try {
      // Show loading alert while processing
      Alert.alert("Processing", "Signing up...", [{ text: "OK" }]);
      console.log("User data being sent:", userData);

      // ✅ Call the API to register the user
      const registeredUser = await signUpUser(userData);
      console.log("Signup successful:", registeredUser);

      // ✅ Automatically send verification email after signup
      await resendVerificationEmail({ email: userData.email });

      // Success feedback
      Alert.alert(
        "Success",
        "You have successfully registered! A verification email has been sent. Please verify your email before signing in.",
        [{ text: "OK", onPress: () => navigation.navigate("SignIn") }]
      );
    } catch (error) {
      console.error("Sign-up error:", error);
      Alert.alert(
        "Sign-Up Failed",
        error.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.headerTitle}>User Registration</Text>
        <Text style={styles.title}>Create an Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
        />
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={24}
              color="rgba(255, 255, 255, 0.8)"
              style={styles.icon}
            />
          </Pressable>
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
          />
          <Pressable
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <MaterialIcons
              name={showConfirmPassword ? "visibility" : "visibility-off"}
              size={24}
              color="rgba(255, 255, 255, 0.8)"
              style={styles.icon}
            />
          </Pressable>
        </View>
        <View style={styles.termsContainer}>
          <Pressable onPress={() => setAccepted(!accepted)}>
            <MaterialIcons
              name={accepted ? "check-box" : "check-box-outline-blank"}
              size={20}
              color={COLORS.accent}
            />
          </Pressable>
          <Text style={styles.termsText}>
            I agree to the{" "}
            <Text style={styles.termsLink}>Terms and Conditions</Text>.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.signUpButton,
            pressed && styles.signUpButtonPressed,
          ]}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          onPress={handleSignUp}
        >
          <Text
            style={[
              styles.signUpButtonText,
              isPressed && styles.signUpButtonTextPressed,
            ]}
          >
            Sign Up
          </Text>
        </Pressable>

        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account?</Text>
          <Pressable onPress={() => navigation.navigate("SignIn")}>
            <Text style={styles.signInLink}>Sign In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpPage;
