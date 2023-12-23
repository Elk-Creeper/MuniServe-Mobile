import {
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";
import { twJoin } from "tailwind-merge";
import React, { useState, useEffect } from 'react';

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

      <TouchableOpacity onPress={() => {
        router.push("/register");
      }}>
        <View style={styles.box}>
            <Text style={styles.regText}>Register Now</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.texts}>
        <Text
          style={{
            fontWeight: "500",
            fontSize: 16,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Already have an account?
        </Text>
        <TouchableOpacity onPress={() => {
          router.push("/login");
        }}>
          <View style={styles.box2}>
            <Text style={styles.logText}>  Login Now</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  texts: {
    flexDirection: "row",
    marginLeft: 10,
  },
  box: {
    backgroundColor: "#307A59",
    height: 60,
    width: 290,
    borderRadius: 10,
  },
  regText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "light",
    textAlign: "center",
    marginTop: 15
  },
  logText: {
    color: "#0174BE",
    marginTop: 22,
    fontWeight: '500',
  },
});

