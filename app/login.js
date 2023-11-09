import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";
import { OtpInput } from "react-native-otp-entry";

export default function signupsuccess() {
  const router = useRouter();
  const otpRef = useRef();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [mainContentHeight, setMainContentHeight] = useState("100%");

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        setMainContentHeight("100%"); // Adjust the height as needed
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
        setMainContentHeight("100%");
      }
    );

    // Cleanup listeners on component unmount
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);


  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#93C49E" // Change the background color as needed
      />
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/imported/Del_Gallego_Camarines_Sur.png")}
            resizeMode="contain"
            style={styles.logo}
          />
          <Text style={styles.logoText}>
            MUNI<Text style={styles.greenText}>SERVE</Text>
          </Text>
        </View>
        <View style={[styles.mainContent]}>          
          <Text style={styles.boldText}>Welcome to MuniServe!</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.mediumText}>Enter your MPIN</Text>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                otpRef.current.clear();
              }}
            >
              <Text style={styles.mediumText}>Clear</Text>
            </TouchableOpacity>
          </View>
          <OtpInput
            style={styles.otpInput}
            ref={otpRef}
            numberOfDigits={6}
            onTextChange={(text) => console.log(text)}
            focusColor={"green"}
          />
          <Link href={""} style={styles.forgotPasswordLink}>
            Forgot MPIN?
          </Link>
          <View style={styles.login}>
            <TouchableOpacity
              onPress={() => {
                router.replace("/dashboard/Home");
              }}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Reset Credentials</Text>
            </TouchableOpacity>
          </View>
        </View>
      {!isKeyboardVisible && (
        <Image
          source={require("../assets/imported/bg.jpg")}
          style={styles.bottomImage}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    flexGrow: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  logo: {
    width: 80,
    height: 80,
  },
  logoText: {
    fontWeight: "bold",
    fontSize: 22,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  greenText: {
    color: "green",
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    justifyContent: "center",
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  mediumText: {
    fontWeight: "medium",
    fontSize: 16,
    marginBottom: 10,
  },
  clearButton: {
    color: "green",
    marginBottom: 10,
  },
  otpInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  forgotPasswordLink: {
    color: "blue",
    marginLeft: 2,
    textAlign: "center",
    fontSize: 12,
    fontWeight: 400,
    marginTop: 28,
    marginBottom: 10,
  },
  login: {
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#307A59",
    borderRadius: 50,
    padding: 20,
    paddingVertical: 10,
    marginTop: 10,
  },
  loginButtonText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
  bottom: {
    marginTop: "20%",
    bottom: 0,
  },
  bottomImage: {
    width: "100%",
    height: 150,
    alignSelf: "flex-end",
    bottom: 0,
    borderRadius: 25,
    paddingHorizontal: 0,
  },
});
