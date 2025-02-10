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
import axios from "axios";
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
    setLoading(true);

    // Temporary bypassing backend integration:
    setTimeout(() => {
      const tempToken = "temporary-bypass-token";
      const tempUser = {
        id: 1,
        username: "temp_user",
        email: "temp@example.com",
        firstName: "Temp",
        lastName: "User",
      };

      setToken(tempToken);
      setCurrentUser(tempUser);
      setLoading(false);
      Alert.alert("Success", "Temporary bypass sign-in successful!");

      // Reset navigation to remove the Auth flow and go straight to the main app.
      // 'Grocce' is the name of the home screen in your AppNavigator.
      navigation.reset({
        index: 0,
        routes: [{ name: "Grocce" }],
      });
    }, 1000);

    /*
    // --- Old Axios integration with backend ---
    try {
      // Replace the URL with your actual backend sign-in endpoint.
      const response = await axios.post("http://YOUR_BACKEND_URL/api/auth/signin", {
        input,
        password,
      });
      const { token, user } = response.data;
      setToken(token);
      setCurrentUser(user);
      Alert.alert("Success", "You are signed in!");
      navigation.navigate("MainMenu");
    } catch (error) {
      if (error.response && error.response.data) {
        Alert.alert("Sign In Failed", error.response.data.message || "Invalid credentials");
      } else {
        Alert.alert("Sign In Failed", error.message);
      }
    } finally {
      setLoading(false);
    }
    */
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
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
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
          ]}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          onPress={handleSignIn}
          disabled={loading}
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
          <Pressable onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignInPage;
