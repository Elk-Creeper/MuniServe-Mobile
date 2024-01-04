import React, { useState, useEffect } from "react";
import { View, TextInput, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, SafeAreaView, Alert } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";

export default function DeathCert() {
    const router = useRouter();

    return (
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor="#93C49E" />

            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Image
                        source={require("../assets/imported/Del_Gallego_Camarines_Sur.png")}
                        style={styles.imageStyle}
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

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                            <View style={styles.boxes1}>
                                <View style={styles.boxAcc}>
                                    <Image
                                        source={require("../assets/imported/Del_Gallego_Camarines_Sur.png")}
                                        style={styles.boxIcon}
                                    />
                                    <Text style={styles.itemService_name}>
                                        Death Certificate
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.innerContainer}>
                                <Text style={styles.itemService_desc}>
                                    A Death Certificate is an official document setting forth particulars relating to a dead person, including the name of the individual, the date of birth and the date of death.  When requesting for death certificate, the interested party shall provide the following information to facilitate verification and issuance of certification.
                                </Text>
                            </View>
                       
                <Text style={styles.noteText}>Please choose services you want to avail</Text>

                <View style={styles.choices}>
                    <TouchableOpacity
                        style={[
                            styles.selection
                        ]}
                        onPress={() => {
                            router.push("/DeathCertReq");
                        }}                    >
                        <Image source={require("../assets/imported/form.png")} style={styles.form} />
                        <Text style={styles.selectionText}>Death Certificate Request Form</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.selection
                        ]}
                        onPress={() => {
                            router.push("/DeathReg");
                        }}                    >
                        <Image source={require("../assets/imported/form.png")} style={styles.form} />
                        <Text style={styles.selectionText}>Death Certificate Registration Form</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 20,
        backgroundColor: "#FFFFFF",
        flexGrow: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    imageStyle: {
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
    boxes1: {
        width: "100%",
        height: 65,
        backgroundColor: "#307A59",
        borderRadius: 15,
        marginBottom: 30,
        marginTop: 15,
    },
    boxAcc: {
        flexDirection: "row",
    },
    boxIcon: {
        marginTop: 12,
        marginLeft: 15,
        width: 40,
        height: 40,
    },
    innerContainer: {
        alignContent: "center",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    itemService_name: {
        marginLeft: 20,
        color: "white",
        fontSize: 18,
        marginTop: 19,
    },
    itemService_desc: {
        fontWeight: "300",
        fontSize: 15,
        textAlign: "justify",
        lineHeight: 30,
    },
    regText: {
        fontSize: 25,
        textAlign: "center",
    },
    noteText: {
        fontSize: 17,
        textAlign: "justify",
        marginTop: 20,
        marginBottom: 20,
        fontWeight: "500",
    },
    choices: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    selection: {
        width: 120,
        height: 100,
        borderColor: "#307A59",
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        padding: 10,
        margin: 5,
    },
    selectionText: {
        textAlign: "center",
        marginBottom: 10,
        fontSize: 11,
    },
    form: {
        justifyContent: "center",
        alignItems: "center",
        resizeMode: "contain",
        flex: 1,
        width: 50,
        height: 50,
    },
});