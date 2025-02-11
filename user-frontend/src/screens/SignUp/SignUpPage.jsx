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
import { signInUser } from "../../services/userApi";
import { UserContext } from "../../contexts/UserContext";
import styles from "../../styles/SignInPageStyles";

const SignUpPage = ({ navigation }) => {
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
      const response = await signInUser({
        input: input.trim(),
        password: password.trim(),
      });

      const { token, user, message } = response;

      if (token && user) {
        // Store token without quotes
        await AsyncStorage.setItem('userToken', token);
        
        // Update context
        setToken(token);
        setCurrentUser(user);

        // Clear input fields
        setInput("");
        setPassword("");

        // Navigate to main app
        navigation.reset({
          index: 0,
          routes: [{ name: "Grocce" }],
        });
      } else {
        Alert.alert("Error", "Invalid response from server");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      
      if (error.response) {
        Alert.alert("Error", error.response.message || "Invalid credentials");
      } else if (error.message) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert(
          "Connection Error",
          "Unable to connect to the server. Please check your internet connection."
        );
      }
    } finally {
      setLoading(false);
    }
  };

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
            (!input.trim() || !password.trim()) && styles.signInButtonDisabled
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

export default SignUpPage;