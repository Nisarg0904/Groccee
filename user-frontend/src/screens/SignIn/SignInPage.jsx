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
import { MaterialIcons } from "@expo/vector-icons";
import { UserContext } from "../../contexts/UserContext";
import { signInUser, resendVerificationEmail } from "../../services/userApi";
import styles from "../../styles/SignInPageStyles";

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
              onPress: () => resendVerificationEmail(input),
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
    </SafeAreaView>
  );
};

export default SignInPage;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------


// import React, { useState, useContext } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   SafeAreaView,
//   StatusBar,
// } from "react-native";
// import { MaterialIcons } from "@expo/vector-icons";
// import { UserContext } from "../../contexts/UserContext";
// import styles from "../../styles/SignInPageStyles";

// const SignInPage = ({ navigation }) => {
//   const [input, setInput] = useState("");
//   const [password, setPassword] = useState("");
//   const { setToken, setCurrentUser } = useContext(UserContext);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleSignIn = async () => {
//     try {
//       // Mock response for testing purposes
//       const mockToken =
//         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0X3VzZXIiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE2NzAwMDAwMDAsImV4cCI6MTY3MDAwMDYwMH0.N1Ggkp6-EY2fTTAufKgPiUHdFBlGbcOEtXDBrv8sfiM";
//       const mockUser = {
//         id: 1,
//         username: "test_user",
//         email: "test@example.com",
//         firstName: "Test",
//         lastName: "User",
//       };

//       // Set the mock token and user in context
//       setToken(mockToken);
//       setCurrentUser(mockUser);

//       // Show a success alert
//       Alert.alert("Success", "You are signed in!");

//       // Navigate to the main menu (or the next screen)
//       navigation.navigate("MainMenu");
//     } catch (error) {
//       // Catch any unexpected errors during mock login
//       Alert.alert(
//         "Sign In Failed",
//         "This is a mocked response. No backend calls were made."
//       );
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" />
//       <View style={styles.content}>
//         <Text style={styles.title}>Sign In</Text>

//         <TextInput
//           style={styles.input}
//           placeholder="Email or Username"
//           placeholderTextColor="#D3D3D3"
//           value={input}
//           onChangeText={setInput}
//         />

//         <View style={styles.passwordContainer}>
//           <TextInput
//             style={styles.passwordInput}
//             placeholder="Password"
//             placeholderTextColor="#D3D3D3"
//             secureTextEntry={!showPassword}
//             value={password}
//             onChangeText={setPassword}
//           />
//           <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//             <MaterialIcons
//               name={showPassword ? "visibility" : "visibility-off"}
//               size={24}
//               color="white"
//             />
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
//           <Text style={styles.signInButtonText}>Sign In</Text>
//         </TouchableOpacity>

//         <Text
//           style={styles.signUpText}
//           onPress={() => navigation.navigate("SignUp")}
//         >
//           Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
//         </Text>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default SignInPage;
