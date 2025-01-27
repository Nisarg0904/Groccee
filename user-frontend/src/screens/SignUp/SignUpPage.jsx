import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../../styles/SignUpPageStyles";
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

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
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
      console.log(userData)
      // Call the API to register the user
      await signUpUser(userData);
      console.log('Success');
      // Success feedback
      Alert.alert(
        "Success",
        "You have successfully registered! Please verify your email and then sign in.",
        [{ text: "OK", onPress: () => navigation.navigate("SignIn") }]
      );
    } catch (error) {
      console.error("Sign-up error:", error);
      Alert.alert("Sign-Up Failed", error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create an Account</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#A9A9A9"
        />
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          placeholderTextColor="#A9A9A9"
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          placeholderTextColor="#A9A9A9"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#A9A9A9"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#A9A9A9"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={24} color="white" style={styles.icon} />
          </TouchableOpacity>
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholderTextColor="#A9A9A9"
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <MaterialIcons name={showConfirmPassword ? "visibility" : "visibility-off"} size={24} color="white" style={styles.icon} />
          </TouchableOpacity>
        </View>
        <View style={styles.termsContainer}>
          <TouchableOpacity onPress={() => setAccepted(!accepted)}>
            <MaterialIcons name={accepted ? "check-box" : "check-box-outline-blank"} size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.termsText}>
            I agree to the <Text style={styles.termsLink}>Terms and Conditions</Text>.
          </Text>
        </View>
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpPage;
