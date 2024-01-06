import {
    View,
    Text,
    Image,
    FlatList,
    SafeAreaView,
    StyleSheet,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { twJoin } from "tailwind-merge";
import React, { useState, useEffect } from 'react';

export default function onboarding() {
    const router = useRouter();
    const [curIdx, setCurIdx] = useState(0);

    const screens = [
        <View className="justify-center items-center w-screen">
            <Image
                source={require("../assets/imported/starita.jpg")}
                className=" w-64 h-80 rounded-xl"
                resizeMode="cover"
            />
            <View>
                <Text className="text-center font-bold text-xl mt-6 ">
                    Sta. Rita Island Resort
                </Text>
                <Text className="text-justify px-8 text-medium leading-6 font-light mt-3">
                    Sta. Rita Island Resort is located at Brgy. Magais 1 Del Gallego, Camarines Sur. It has the longest infinity in Camarines Sur. It gives you a taste of a natural tropical island with a panoramic view of the ocean surrounded by Bondoc Peninsula, Quezon Province, Camarines Norte and Camarines Sur.
                </Text>
            </View>
        </View>,

        <View className="justify-center items-center w-screen">
            <Image
                source={require("../assets/imported/pamplona.jpg")}
                className=" w-64 h-80 rounded-xl"
                resizeMode="cover"
            />
            <View>
                <Text className="text-center font-bold text-xl mt-6">
                    Tabion Falls
                </Text>
                <Text className="text-justify px-8 text-medium leading-6 font-light mt-3 mb-12">
                    Tabion Falls in Brgy. Pamplona, Del Gallego, Camarines Sur - Discover a small yet stunning waterfall with crystal-clear waters. The breathtaking scenery makes every minute of the trek worthwhile.                </Text>
            </View>
        </View>,

        <View className="justify-center items-center w-screen">
            <Image
                source={require("../assets/imported/tanawan.jpg")}
                className=" w-64 h-80 rounded-xl"
                resizeMode="cover"
            />
            <View>
                <Text className="text-center font-bold text-xl mt-6 ">
                    Tanawan Hills
                </Text>
                <Text className="text-justify px-8 text-medium leading-6 font-light mt-3 mb-6">
                    Discover the enchanting Tanawan Hills in Tabion, Del Gallego – a mini version of the iconic Chocolate Hills in Bohol, Philippines. Enjoy the beauty of many lovely small hills, creating a delightful spot for nature lovers and anyone seeking a scenic getaway.
                </Text>
            </View>
        </View>,

        <View className="justify-center items-center w-screen">
            <Image
                source={require("../assets/imported/puti.jpg")}
                className=" w-64 h-80 rounded-xl"
                resizeMode="cover"
            />
            <View>
                <Text className="text-center font-bold text-xl mt-6 ">
                    Puting Buhangin Beach Resort
                </Text>
                <Text className="text-justify px-8 text-medium leading-6 font-light mt-3 mb-12">
                    Dive into the charm of Puting Buhangin Beach Resort in Sinuknipan 2, Del Gallego, Camarines Sur! With its budget-friendly digs and a stretch of gorgeous white sand, it's the perfect spot for a simple yet unforgettable getaway.                </Text>
            </View>
        </View>,
    ];

    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-white">
            <Text className="font-bold text-xl tracking-[3px] mt-5">
                TOURIST<Text className="text-green-800">SPOTS</Text>
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

            <View className="flex-row justify-between items-center w-[30%] mb-[2vh]">
                {screens.map((_, index) => {
                    return (
                        <View
                            key={index}
                            className={twJoin(
                                "w-3 h-3 rounded-full ",
                                index == curIdx ? "bg-green-800" : "bg-gray-300"
                            )}
                        ></View>
                    );
                })}
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
        marginTop: 20,
        fontWeight: '500',
        fontSize: 16,
    },
});

