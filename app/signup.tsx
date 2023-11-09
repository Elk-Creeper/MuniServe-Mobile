import {
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";
import { twJoin } from "tailwind-merge";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";

export default function signup() {
  const [phoneNumber, setPhoneNumber] = useState("+63"); // Set the default value to "+63"
  const [isChecked, setChecked] = useState(false);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true); // Track phone number validity

  // Function to check if the "Next" button should be enabled
  const isNextButtonEnabled = () => {
    return curIdx === 0 || (curIdx === 1 && isChecked);
  };

  const router = useRouter();
  const [curIdx, setCurIdx] = useState(0);
  const ref = useRef();
  const otpRef = useRef();
  const screens = [
    <View className="w-screen px-5">
      <Text className="font-bold text-2xl">Let's Sign you Up!</Text>
      <Text className=" text-medium font-light my-2 tracking-wide">
        To sign up, please enter your mobile number.
      </Text>
      <View className="flex-row items-center border-2 border-green-700 rounded-2xl h-14 my-10">
        <Image
          source={require("../assets/imported/flag.jpg")}
          className="w-8 h-8 ml-3 rounded-full"
        />
        <TextInput
          className="flex-1 text-black text-l ml-2"
          placeholder="+63"
          placeholderTextColor="gray"
          keyboardType="number-pad"
          maxLength={13}
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
        />
      </View>
      <View className="flex-row">
        <Checkbox
          className="border-green-700"
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? "green" : "undefined"}
        />
        <Text className="ml-2 mr-2 text-xs text-justify">
          I agree with the
          <Link href={"/login"} className="text-blue-600 ml-2">
            <Text> Terms and Conditions </Text>
          </Link>
          and
          <Link href={"/login"} className="text-blue-600 ml-2">
            <Text> Privacy Policy</Text>
          </Link>
        </Text>
      </View>
      <Text className="font-bolder text-m mb-2 mt-10 text-center">
        {" "}
        - or sign up with -{" "}
      </Text>
      <TouchableOpacity
        onPress={() => {
          Alert.alert("Google Sign Up", "Implement Google sign-up logic here.");
        }}
        className="flex-row justify-center items-center rounded-3xl py-3 mb-5"
      >
        <Image
          source={require("../assets/imported/google.png")}
          className="w-10 h-10 rounded-full"
        />
      </TouchableOpacity>
    </View>,
  ];

const handlePhoneNumberChange = (text) => {
    if (!text.startsWith("+63")) {
      setPhoneNumber("+63" + text);
    } else {
      setPhoneNumber(text);
    }
  };

  const handleNextPress = () => {
    if (!phoneNumber || !isChecked) {
      Alert.alert("Error", "Please fill in all required fields.");
    } else if (!isValidPhoneNumber(phoneNumber)) {
      Alert.alert("Error", "Please enter a valid phone number.");
    } else {
      if (curIdx === screens.length - 1) {
        router.push("/otp");
      } else {
        setCurIdx((d) => d + 1);
      }
    }
  };

  const isValidPhoneNumber = (phone) => {
    return phone.length === 13;
  };

  useEffect(() => {
    ref.current?.scrollToIndex({ animated: true, index: curIdx });
  }, [curIdx]);

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <StatusBar
        backgroundColor="#93C49E" // Change the background color as needed
      />
      <TouchableOpacity
        onPress={() => {
          if (curIdx === 0) {
            router.back();
          } else setCurIdx((d) => d - 1);
        }}
        className="p-3 self-start"
      >
        <Ionicons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>
      <View className=" px-5 flex-row justify-between items-center w-full mb-[5vh]">
        <View
          className={twJoin("w-[30vw] h-2  rounded-full bg-green-800")}
        ></View>
        <View
          className={twJoin("w-[30vw] h-2  rounded-full bg-gray-200")}
        ></View>
        <View
          className={twJoin("w-[30vw] h-2  rounded-full bg-gray-200")}
        ></View>
      </View>

      <FlatList
        ref={ref}
        data={screens}
        renderItem={({ item }) => item}
        keyExtractor={(item, index) => index.toString()}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      />

      <View style={{ justifyContent: "center", width: "100%" }}>
        <TouchableOpacity
          onPress={handleNextPress}
          className={twJoin(
            "bg-green-900 justify-center items-center mx-10 rounded-lg py-3 mb-5",
            !isChecked || !phoneNumber || !isValidPhoneNumber(phoneNumber)
              ? "opacity-50 cursor-not-allowed"
              : ""
          )}
          disabled={
            !isChecked || !phoneNumber || !isValidPhoneNumber(phoneNumber)
          }
        >
          <Text style={{ fontSize: 20, color: "white" }}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}