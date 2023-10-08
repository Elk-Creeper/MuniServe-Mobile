import {
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";
import { twJoin } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { OtpInput } from "react-native-otp-entry";

export default function signup() {
  const router = useRouter();
  const [curIdx, setCurIdx] = useState(0);
  const ref = useRef();
  const otpRef = useRef();
  const screens = [
    <View className="w-screen px-5">
      <Text className="font-bold text-2xl">Create your MPIN</Text>
      <Text className=" text-medium font-light my-2 tracking-wide">
        Enter a 6-digit number to setup your MPIN.
      </Text>
      <View className="my-10">
        <View className="flex-row justify-between mb-5">
          <Text className="font-medium text-medium">Set your MPIN</Text>
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
          ref={otpRef}
          numberOfDigits={6}
          onTextChange={(text) => console.log(text)}
          focusColor={"green"}
        />
      </View>
      <Text className="ml-2 w-[50vw] text-center self-center text-xs">
        Remember that you will use this 6-digit MPIN everytime you login.
      </Text>
    </View>,
  ];

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
          className={twJoin("w-[30vw] h-2  rounded-full bg-gray-200")}
        ></View>
        <View
          className={twJoin("w-[30vw] h-2  rounded-full bg-gray-200")}
        ></View>
        <View
          className={twJoin("w-[30vw] h-2  rounded-full bg-green-800")}
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
          onPress={() => {
            router.push("/signupsuccess");
          }}
          className={twJoin(
            "bg-green-900 justify-center items-center mx-10 rounded-lg py-3 mb-5"
          )}
        >
          <Text style={{ fontSize: 20, color: "white" }}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}