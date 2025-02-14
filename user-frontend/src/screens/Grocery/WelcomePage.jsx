import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Animated, Dimensions } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import styles from "../../styles/WelcomePageStyles";
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get("window");

const WelcomePage = () => {
  const navigation = useNavigation();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#1d2f23", "#3f6a54", "#4f6e71"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
            <View style={styles.titleSection}>
              <Text style={styles.appName}>GroceryPal</Text>
              <Text style={styles.subtitle}>Your Smart Shopping Manager</Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.welcomeText}>
                Simplify your grocery shopping with GroceryPal.
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.smallSignInButton, { elevation: 5 }]}
                onPress={() => navigation.navigate("SignIn")}
                activeOpacity={0.7}
              >
                <Text style={styles.signInText}>Sign In</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.smallSignUpButton, { elevation: 5 }]}
                onPress={() => navigation.navigate("SignUp")}
                activeOpacity={0.7}
              >
                <Text style={styles.signUpText}>Create Account</Text>
              </TouchableOpacity>

              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity
                  style={styles.googleButton}
                  onPress={() => {}}
                  activeOpacity={0.7}
                  accessibilityLabel="Sign in with Google"
                >
                  <AntDesign name="google" size={50} color="white" />
                  <Text style={styles.socialText}>Google</Text>
                </TouchableOpacity>
                <Text style={styles.orText}>or</Text>
                <TouchableOpacity
                  style={styles.appleButton}
                  onPress={() => {}}
                  activeOpacity={0.7}
                  accessibilityLabel="Sign in with Apple"
                >
                  <MaterialIcons name="apple" size={50} color="white" />
                  <Text style={styles.socialText}>Apple</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.termsText}>
                By continuing, you agree to our <Text style={styles.termsLink}>Terms and Conditions</Text>.
              </Text>
            </View>
          </Animated.View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default WelcomePage;


// import React, { useEffect } from "react";
// import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Animated, Image, Dimensions } from "react-native";
// import { LinearGradient } from 'expo-linear-gradient';
// import { MaterialIcons, AntDesign } from '@expo/vector-icons';
// import styles from "../styles/WelcomePageStyles";
// import { useNavigation } from '@react-navigation/native';

// const { width } = Dimensions.get("window");

// const WelcomePage = () => {
//   const navigation = useNavigation();
//   const fadeAnim = new Animated.Value(0);

//   useEffect(() => {
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 1500,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" />
//       <LinearGradient
//         colors={["#1d2f23", "#3f6a54", "#4f6e71"]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.gradient}
//       >
//         <View style={styles.content}>
//           <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
//             <View style={styles.titleSection}>
//               <Text style={styles.appName}>GMS</Text>
//               <Text style={styles.subtitle}>Welcome to Grocery Management System</Text>
//             </View>

//             <View style={styles.buttonContainer}>
//               <TouchableOpacity
//                 style={styles.smallSignInButton}
//                 onPress={() => navigation.navigate("SignIn")}
//                 activeOpacity={0.7}
//               >
//                 <Text style={styles.signInText}>Sign In</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.smallSignUpButton}
//                 onPress={() => navigation.navigate("SignUp")}
//                 activeOpacity={0.7}
//               >
//                 <Text style={styles.signUpText}>Register</Text>
//               </TouchableOpacity>
//             </View>

//             <View style={styles.socialButtonsContainer}>
//               <TouchableOpacity style={styles.googleButton} onPress={() => {}}>
//                 <AntDesign name="google" size={24} color="white" />
//                 <Text style={styles.socialText}>Google</Text>
//               </TouchableOpacity>

//               <Text style={styles.orText}>or</Text>

//               <TouchableOpacity style={styles.appleButton} onPress={() => {}}>
//                 <MaterialIcons name="apple" size={24} color="white" />
//                 <Text style={styles.socialText}>Apple</Text>
//               </TouchableOpacity>
//             </View>

//             <Text style={styles.termsText}>
//               By continuing, you agree to our <Text style={styles.termsLink}>Terms and Conditions</Text>.
//             </Text>

//             <Image
//               source={{ uri: 'https://via.placeholder.com/445x382' }}
//               style={{ width: 445, height: 382, alignSelf: 'center', marginTop: 20 }}
//             />
//           </Animated.View>
//         </View>
//       </LinearGradient>
//     </SafeAreaView>
//   );
// };

// export default WelcomePage;