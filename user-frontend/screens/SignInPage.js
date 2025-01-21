import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { UserContext } from "../contexts/UserContext";
import { signInUser, resendVerificationEmail } from "../services/api";
import styles from "../styles/SignInPageStyles";

const SignInPage = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const { setToken, setCurrentUser } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    try {
      const credentials = { input, password };
      const response = await signInUser(credentials);

      const { token, user } = response;

      if (token && user) {
        setToken(token);
        setCurrentUser(user);
        Alert.alert("Success", "You are signed in!");
        navigation.navigate("MainMenu");
      }
    } catch (error) {
      if (error.message.includes("Please verify your email")) {
        Alert.alert(
          "Email Not Verified",
          "Would you like to resend the verification email?",
          [
            {
              text: "Resend Email",
              onPress: () => handleResendVerification(input),
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ]
        );
      } else {
        Alert.alert("Sign In Failed", error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#1d2f23", "#3f6a54", "#4f6e71"]} style={styles.gradient}>
        <View style={styles.content}>
          <Text style={styles.title}>Sign In</Text>

          <TextInput
            style={styles.input}
            placeholder="Email or Username"
            placeholderTextColor="#D3D3D3"
            value={input}
            onChangeText={setInput}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#D3D3D3"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>

          <Text
            style={styles.signUpText}
            onPress={() => navigation.navigate("SignUp")}
          >
            Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default SignInPage;
