import {
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";
import { twJoin } from "tailwind-merge";

export default function onboarding() {
  const router = useRouter();
  const [curIdx, setCurIdx] = useState(0);
  const screens = [
    <View className="justify-center items-center w-screen">
      <Image
        source={require("../assets/imported/slider1.png")}
        className=" w-80 h-80"
        resizeMode="contain"
      />
      <View>
        <Text className="text-center font-bold text-xl ">
          Gmail Authetication
        </Text>
        <Text className="text-center px-10 text-medium font-light mt-3">
          MuniServe ensures secure transaction and great user experience.
        </Text>
      </View>
    </View>,
    <View className="justify-center items-center w-screen">
      <Image
        source={require("../assets/imported/slider2.png")}
        className=" w-80 h-80"
        resizeMode="contain"
      />
      <View>
        <Text className="text-center font-bold text-xl ">
          Interactive Navigation
        </Text>
        <Text className="text-center px-10 text-medium font-light mt-3">
          Effortlessly explore our office spaces through virtual tours,
          discovering each workspaces.
        </Text>
      </View>
    </View>,
    <View className="justify-center items-center w-screen">
      <Image
        source={require("../assets/imported/slider3.png")}
        className=" w-80 h-80"
        resizeMode="contain"
      />
      <View>
        <Text className="text-center font-bold text-xl ">
          Ease of Acquiring Services
        </Text>
        <Text className="text-center px-10 text-medium font-light mt-3">
          Enjoy hassle-free, simplified steps, and quick access to a wide range
          of services at your fingertips.
        </Text>
      </View>
    </View>,
  ];
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <Text className="font-bold text-2xl tracking-[3px] mt-10">
        MUNI<Text className="text-green-800">SERVE</Text>
      </Text>

      <FlatList
        data={screens}
        renderItem={({ item }) => item}
        keyExtractor={(item, index) => index.toString()}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          let contentOffset = Math.floor(event.nativeEvent.contentOffset.x);
          let layoutMeasurement = Math.floor(
            event.nativeEvent.layoutMeasurement.width
          );
          // console.log(contentOffset, layoutMeasurement);
          const index = Math.round(contentOffset / layoutMeasurement);
          setCurIdx(index);
        }}
      />

      <View className="flex-row justify-between items-center w-[30%] mb-[5vh]">
        {screens.map((_, index) => {
          return (
            <View
              key={index}
              className={twJoin(
                "w-5 h-5  rounded-full ",
                index == curIdx ? "bg-green-800" : "bg-gray-200"
              )}
            ></View>
          );
        })}
      </View>

      <View className="justify-center w-full">
        <TouchableOpacity
          onPress={() => {
            router.push("/signup");
          }}
          className="bg-green-900 justify-center items-center  mx-10 rounded-lg py-3"
        >
          <Text className="text-xl text-white">Sign Up</Text>
        </TouchableOpacity>
        <View className="flex-row mt-3 self-center">
          <Text>Already a member?</Text>
          <Link href = {"/login"} className="text-blue-600 ml-2">
            Login here
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
