import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";

const Settings = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor="#93C49E" // Change the background color as needed
            />

            <View style={styles.header}>
                <Text style={styles.aboutText}>Settings</Text>
            </View>
            
            <View style={styles.box}>

                <Text style={styles.text}>Privacy and Security</Text>

                <TouchableOpacity onPress={() => {
                    router.push("/EditProfile");
                }}>
                    <View style={styles.boxes1}>
                        <View style={styles.boxAcc}>
                            <Image
                                source={require("../assets/imported/profile.png")}
                                style={styles.boxIcon}
                            />
                            <Text style={styles.itemService_name}>View User Profile</Text>
                            <Image
                                source={require("../assets/imported/arrow.png")}
                                style={styles.arrow3}
                            />
                        </View>
                    </View>
                </TouchableOpacity> 

                <TouchableOpacity onPress={() => {
                    router.push("/ChangePass");
                }}>
                    <View style={styles.boxes2}>
                        <View style={styles.boxAcc}>
                            <Image
                                source={require("../assets/imported/security.png")}
                                style={styles.boxIcon}
                            />
                            <Text style={styles.itemService_name}>Change Password</Text>
                            <Image
                                source={require("../assets/imported/arrow.png")}
                                style={styles.arrow4}
                            />
                        </View>
                    </View>
                </TouchableOpacity>

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
                    <View style={styles.boxes2}>
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
        marginTop: 10,
        backgroundColor: "#307A59",
        borderRadius: 10,
    },
    aboutText: {
        fontSize: 18,
        textAlign: "center",
        marginTop: 15,
        fontWeight: "500",
        marginBottom: 15,
        color: 'white',
        fontWeight: '600'
    },
    text: {
        fontSize: 15,
        marginLeft: 10,
        marginTop: 20,
        fontWeight: "400",
    },
    box: {
        marginTop: 50
    },
    boxes1: {
        width: "100%",
        height: 30,
        marginTop: 8,
        borderRadius: 10,
    },
    boxes2: {
        width: "100%",
        height: 30,
        marginTop: 20,
        borderRadius: 10,
        marginBottom: 60,
    },
    boxAcc: {
        flexDirection: "row",
        marginTop: 10,
    },
    boxIcon: {
        marginTop: 5,
        marginLeft: 10,
        width: 25,
        height: 25,
    },
    arrow1: {
        marginTop: 5,
        marginLeft: 110,
        width: 25,
        height: 25,
    },
    arrow2: {
        marginTop: 5,
        marginLeft: 90,
        width: 25,
        height: 25,
    },
    arrow3: {
        marginTop: 5,
        marginLeft: 115,
        width: 25,
        height: 25,
    },
    arrow4: {
        marginTop: 5,
        marginLeft: 112,
        width: 25,
        height: 25,
    },
    itemService_name: {
        marginLeft: 10,
        fontSize: 16,
        marginTop: 5,
        fontWeight: '600'
    },
});
