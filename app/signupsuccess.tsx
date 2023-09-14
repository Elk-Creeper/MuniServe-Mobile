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

  return (
    <SafeAreaView className="flex-1 justify-between items-center bg-white">
      <View className="justify-center items-center mt-5">
        <Image
          source={require("../assets/imported/Del_Gallego_Camarines_Sur.png")}
          resizeMode="contain"
          className="w-20 h-20 mt-5"
        />
        <Text className="font-bold text-2xl tracking-[3px]">
          MUNI<Text className="text-green-700">SERVE</Text>
        </Text>
      </View>
      <View className=" flex-1 justify-center items-center mb-10">
        <Image
          source={require("../assets/imported/icons8-confetti-100.png")}
          resizeMode="contain"
        />
        <Text className="font-bold text-3xl mb-5">Congratulations!</Text>
        <Text className=" text-center w-[80vw]">
          You have successfully created your account. Login now to avail our
          services.
        </Text>
      </View>
      <View className="justify-center w-full">
        <TouchableOpacity
          onPress={() => {
            router.push("/login");
          }}
          className="bg-green-900 justify-center items-center  mx-10 rounded-lg py-3"
        >
          <Text className="text-xl text-white">Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}