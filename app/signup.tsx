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

export default function signup() {
  const router = useRouter();
  const [curIdx, setCurIdx] = useState(0);
  const [isChecked, setChecked] = useState(false);
  const ref = useRef();
  const otpRef = useRef();
  const screens = [
    <View className="w-screen px-5">
      <Text className="font-bold text-2xl">Let's Sign you Up!</Text>
      <Text className=" text-xl font-light my-2 tracking-wide">
        To sign up, please enter your mobile number.
      </Text>
      <TextInput
        keyboardType="number-pad"
        className=" px-3 border-green-700 rounded-xl h-14 my-10 border-2"
      />
      <View className="flex-row">
        <Checkbox
          className="border-green-700 "
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? "green" : "undefined"}
        />

        <Text className="ml-2">
          I agree with the Terms and Conditions and Privacy Policy
        </Text>
      </View>
    </View>,
    <View className="w-screen px-5">
      <Text className="font-bold text-2xl">Enter One Time Password</Text>
      <Text className=" text-xl font-light my-2 tracking-wide">
        Please enter the One- Time Password (OTP) that we sent to your mobile
        number.
      </Text>
      <View className="my-10">
        <View className="flex-row justify-between mb-5">
          <Text className="font-medium text-xl">OTP</Text>
          <TouchableOpacity
            className="text-green-700"
            onPress={() => {
              otpRef.current.clear();
            }}
          >
            <Text className="font-medium text-xl">Clear</Text>
          </TouchableOpacity>
        </View>
        <OtpInput
          ref={otpRef}
          numberOfDigits={6}
          onTextChange={(text) => console.log(text)}
          focusColor={"green"}
        />
      </View>
      <Text className="ml-2 w-[50vw] text-center self-center">
        If you didn't receive the code?{" "}
        <Link href={"/login"} className="text-blue-600 ml-2">
          Resend
        </Link>
      </Text>
    </View>,
    <View className="w-screen px-5">
      <Text className="font-bold text-2xl">Create your MPIN</Text>
      <Text className=" text-xl font-light my-2 tracking-wide">
        Enter a 6-digit number to setup your MPIN.
      </Text>
      <View className="my-10">
        <View className="flex-row justify-between mb-5">
          <Text className="font-medium text-xl">Set your MPIN</Text>
          <TouchableOpacity
            className="text-green-700"
            onPress={() => {
              otpRef.current.clear();
            }}
          >
            <Text className="font-medium text-xl">Clear</Text>
          </TouchableOpacity>
        </View>
        <OtpInput
          ref={otpRef}
          numberOfDigits={6}
          onTextChange={(text) => console.log(text)}
          focusColor={"green"}
        />
      </View>
      <Text className="ml-2 w-[50vw] text-center self-center">
        Remember that vou will use this 6-digit MPIN everytime you login.
      </Text>
    </View>,
  ];
  useEffect(() => {
    ref.current?.scrollToIndex({ animated: true, index: curIdx });
  }, [curIdx]);
  
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <TouchableOpacity
        onPress={() => {
          if (curIdx == 0) {
            router.back();
          } else setCurIdx((d) => d - 1);
        }}
        className="p-3 self-start"
      >
        <Ionicons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>
      <View className=" px-5 flex-row justify-between items-center w-full mb-[5vh]">
        {screens.map((_, index) => {
          return (
            <View
              key={index}
              className={twJoin(
                "w-[30vw] h-2  rounded-full ",
                index == curIdx ? "bg-green-800" : "bg-gray-200"
              )}
            ></View>
          );
        })}
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

      <View className="justify-center w-full">
        <TouchableOpacity
          onPress={() => {
            if (curIdx == screens.length - 1) {
              router.push("/signupsuccess");
            } else setCurIdx((d) => d + 1);
          }}
          className="bg-green-900 justify-center items-center  mx-10 rounded-lg py-3 mb-5"
        >
          <Text className="text-xl text-white">Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
