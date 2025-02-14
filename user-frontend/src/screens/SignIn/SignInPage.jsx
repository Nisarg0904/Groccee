// screens/SignIn/SignInPage.jsx
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInUser,resendVerificationEmail } from "../../services/userApi"; // Import the signInUser function
import { UserContext } from "../../contexts/UserContext";
import styles from "../../styles/SignInPageStyles";


const SignInPage = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const { setToken, setCurrentUser } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!input.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      console.log("Attempting sign in with:", { input: input.trim() }); // Debug log
      const response = await signInUser({
        input: input.trim(),
        password: password.trim(),
      });
      console.log("Sign in response:", response); // Debug log

      const { token, user, message } = response;

      if (token && user) {
        // ✅ Store token securely
        await AsyncStorage.setItem("userToken", token);

        // ✅ Update context
        setToken(token);
        setCurrentUser(user);

        // ✅ Clear input fields
        setInput("");
        setPassword("");

        // ✅ Navigate to main app
        navigation.reset({
          index: 0,
          routes: [{ name: "Grocce" }],
        });
      } else {
        Alert.alert("Error", "Invalid response from server");
      }
    } catch (error) {
      console.error("Sign in error:", error);

      let errorMessage = "Failed to sign in. Please try again.";

      if (error.message) {
        if (error.message.includes("User not found")) {
          errorMessage = "User not found";
        } else if (error.message.includes("Wrong password")) {
          errorMessage = "Invalid password";
        } else if (error.message.includes("verify your email")) {
          errorMessage = "Please verify your email before logging in.";

          // ✅ Automatically resend verification email
          try {
            await resendVerificationEmail({ email: input.trim() });
            Alert.alert(
              "Email Verification Required",
              "Your email is not verified. We have sent you a new verification email. Please check your inbox and verify your email before signing in."
            );
          } catch (emailError) {
            console.error("Error resending verification email:", emailError);
            Alert.alert(
              "Error",
              "Your email is not verified, and we could not resend the verification email. Please try again later."
            );
          }

          return; // Exit function to prevent further alerts
        } else {
          errorMessage = error.message;
        }
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component remains the same...
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>Welcome Back</Text>
        <Text style={styles.title}>Sign in to your account</Text>

        <TextInput
          style={styles.input}
          placeholder="Email or Username"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={input}
          onChangeText={setInput}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            editable={!loading}
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

        <Pressable
          style={({ pressed }) => [
            styles.signInButton,
            pressed && styles.signInButtonPressed,
            (!input.trim() || !password.trim()) && styles.signInButtonDisabled,
          ]}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          onPress={handleSignIn}
          disabled={loading || !input.trim() || !password.trim()}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={[
                styles.signInButtonText,
                isPressed && styles.signInButtonTextPressed,
              ]}
            >
              Sign In
            </Text>
          )}
        </Pressable>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account?</Text>
          <Pressable
            onPress={() => navigation.navigate("SignUp")}
            disabled={loading}
          >
            <Text style={styles.signUpLink}>Sign Up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignInPage;