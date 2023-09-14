import {
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";
import { twJoin } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { OtpInput } from "react-native-otp-entry";

export default function signupsuccess() {
  const router = useRouter();
  const [curIdx, setCurIdx] = useState(0);
  const [isChecked, setChecked] = useState(false);
  const ref = useRef();
  const otpRef = useRef();
  const screens = []

  return (
    <SafeAreaView className="flex-1 justify-between  bg-white">
      <View className="justify-center items-center mt-5 ">
        <Image
          source={require("../assets/imported/Del_Gallego_Camarines_Sur.png")}
          resizeMode="contain"
          className="w-20 h-20 mt-5"
        />
        <Text className="font-bold text-2xl tracking-[3px]">
          MUNI<Text className="text-green-700">SERVE</Text>
        </Text>
      </View>
      <View className="my-10 flex-1 px-5">
        <Text className="font-bold text-2xl text-center">Welcome to MuniServe!</Text>
        <View className="flex-row justify-between mb-5">
          <Text className="font-medium text-medium">Enter your MPIN</Text>
          <TouchableOpacity
            className="text-green-700"
            onPress={() => {
              otpRef.current.clear();
            }}
          >
            <Text className="font-medium text-medium">Clear</Text>
          </TouchableOpacity>
        </View>
        <OtpInput
          className=" flex-row items-center justify-between"
          ref={otpRef}
          numberOfDigits={6}
          onTextChange={(text) => console.log(text)}
          focusColor={"green"}
        />
      </View>

      <Image
        source={require("../assets/imported/bg.jpg")}
        resizeMode="cover"
        className="w-full h-28  mb-0"
      />
    </SafeAreaView>
  );
}
