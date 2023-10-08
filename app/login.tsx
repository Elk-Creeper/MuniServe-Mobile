import {
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";
import { twJoin } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";
import { OtpInput } from "react-native-otp-entry";

export default function signupsuccess() {
  const router = useRouter();
  const [curIdx, setCurIdx] = useState(0);
  const [isChecked, setChecked] = useState(false);
  const otpRef = useRef();

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#93C49E" // Change the background color as needed
      />
      <ImageBackground
        source={require("../assets/imported/back.png")}
        style={styles.backgroundImage}
      >
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
        <View style={styles.mainContent}>
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
            Forgot Password?
          </Link>
          <View style={styles.login}>
            <TouchableOpacity
              onPress={() => {
                router.replace("/dashboard/Home");
              }}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
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
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // You can also use 'contain' or 'stretch'
  },
  all: {
    
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
  },
  logoText: {
    fontWeight: "bold",
    fontSize: 20,
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
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 22,
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
    fontSize: 15,
    fontWeight: 400,
    marginTop: 28,
    marginBottom: 20,
  },
  login: {
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#307A59",
    borderRadius: 50,
    paddingVertical: 10,
    marginTop: 20,
    width: 165,
  },
  loginButtonText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
  bottom: {
    marginTop: "20%",
    bottom: 0,
  },
  bottomImage: {
    width: "100%",
    height: 100,
    alignSelf: "flex-end",
    marginBottom: 0,
  },
});
