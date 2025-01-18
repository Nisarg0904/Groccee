import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { UserContext } from "../contexts/UserContext";
import { signInUser, resendVerificationEmail } from "../services/api";
import styles from "../styles/SignInPageStyles";

const SignInPage = ({ navigation }) => {
  const [input, setInput] = useState(""); // Can be either email or username
  const [password, setPassword] = useState("");
  const [emailToResend, setEmailToResend] = useState(""); // For resend verification
  const { setToken, setCurrentUser } = useContext(UserContext);

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

  const handleResendVerification = async (email) => {
    try {
      await resendVerificationEmail({ email });
      Alert.alert(
        "Success",
        "Verification email has been resent. Please check your inbox."
      );
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        style={styles.input}
        placeholder="Email or Username"
        value={input}
        onChangeText={setInput}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Sign In" onPress={handleSignIn} />

      <Text
        style={styles.signUpText}
        onPress={() => navigation.navigate("SignUp")}
      >
        Don't have an account? Sign Up
      </Text>
    </View>
  );
};

export default SignInPage;
