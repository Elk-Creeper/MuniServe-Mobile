import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";

const Settings = () => {
    const router = useRouter();
    
    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor="#93C49E" // Change the background color as needed
            />

            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Image
                        source={require("../assets/imported/Del_Gallego_Camarines_Sur.png")}
                        style={styles.logo}
                    />
                    <Text style={styles.titleText}>
                        <Text style={styles.blackText}>MUNI</Text>
                        <Text style={styles.greenText}>SERVE</Text>
                    </Text>
                </View>
                <TouchableOpacity>
                    <Ionicons name="notifications-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <Text style={styles.text}>About MuniServe</Text>
            <TouchableOpacity onPress={() => {
                router.push("/privacy");
            }}>
                <View style={styles.boxes1}>
                    <View style={styles.boxAcc}>
                        <Image
                            source={require("../assets/imported/file1.png")}
                            style={styles.boxIcon}
                        />
                        <Text style={styles.itemService_name}>Privacy and Policy</Text>
                        <Image
                            source={require("../assets/imported/arrow.png")}
                            style={styles.arrow1}
                        />
                    </View>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
                router.push("/terms");
            }}>
                <View style={styles.boxes1}>
                    <View style={styles.boxAcc}>
                        <Image
                            source={require("../assets/imported/file2.png")}
                            style={styles.boxIcon}
                        />
                        <Text style={styles.itemService_name}>Terms and Condition</Text>
                        <Image
                            source={require("../assets/imported/arrow.png")}
                            style={styles.arrow2}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "left",
        backgroundColor: "white",
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    logo: {
        width: 40,
        height: 40,
        marginRight: 8,
    },
    titleText: {
        fontSize: 24,
        fontWeight: "bold",
        flexDirection: "row",
        letterSpacing: 3,
    },
    blackText: {
        color: "black",
        fontWeight: "bold",
        fontSize: 20,
    },
    greenText: {
        color: "green",
        fontWeight: "bold",
        fontSize: 20,
    },
    text: {
        fontSize: 20,
        marginLeft: 10,
        marginTop: 20,
        fontWeight: "600",
    },
    boxes1: {
        width: "100%",
        height: 40,
        marginTop: 30,
    },
    boxAcc: {
        flexDirection: "row",
    },
    boxIcon: {
        marginTop: 5,
        marginLeft: 10,
        width: 30,
        height: 30,
    },
    arrow1: {
        marginTop: 5,
        marginLeft: 103,
        width: 25,
        height: 25,
    },
    arrow2: {
        marginTop: 5,
        marginLeft: 80,
        width: 25,
        height: 25,
    },
    itemService_name: {
        marginLeft: 10,
        fontSize: 18,
        marginTop: 5,
    },
});
