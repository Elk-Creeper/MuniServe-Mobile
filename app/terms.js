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
import { firebase } from "../config";
import { Link, useRouter } from "expo-router";

const Terms = () => {
    const router = useRouter();
    const [terms, setTerms] = useState([]);
    const MuniServe = firebase.firestore().collection("terms");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await MuniServe.get();
                const terms = [];

                querySnapshot.forEach((doc) => {
                    const { p1, p2, p3, p4, p5, p6, p7, p8, p9, p10 } = doc.data();
                    terms.push({
                        id: doc.id,
                        p1,
                        p2,
                        p3,
                        p4,
                        p5,
                        p6,
                        p7,
                        p8,
                        p9,
                        p10,
                    });
                });

                setTerms(terms);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

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

            <Text style={styles.texts}>Terms and Conditions</Text>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <FlatList
                    data={terms}
                    numColumns={1}
                    renderItem={({ item }) => (
                        <View style={styles.paraText}>
                            <Text style={styles.text}>Introduction</Text>
                            <Text style={styles.itemPara}>{item.p1}</Text>

                            <Text style={styles.text}>License to Use</Text>
                            <Text style={styles.itemPara}>{item.p2}</Text>

                            <Text style={styles.text}>User Accounts</Text>
                            <Text style={styles.itemPara}>{item.p3}</Text>

                            <Text style={styles.text}>User Conduct</Text>
                            <Text style={styles.itemPara}>{item.p4}</Text>

                            <Text style={styles.text}>Intellectual Property</Text>
                            <Text style={styles.itemPara}>{item.p5}</Text>

                            <Text style={styles.text}>Termination</Text>
                            <Text style={styles.itemPara}>{item.p6}</Text>

                            <Text style={styles.text}>Disclaimer of Warranty</Text>
                            <Text style={styles.itemPara}>{item.p7}</Text>

                            <Text style={styles.text}>Limitation of Liability</Text>
                            <Text style={styles.itemPara}>{item.p8}</Text>

                            <Text style={styles.text}>Changes to Terms and Conditions</Text>
                            <Text style={styles.itemPara}>{item.p9}</Text>

                            <Text style={styles.text}>Governing Law</Text>
                            <Text style={styles.itemPara}>{item.p10}</Text>
                        </View>
                    )}
                />
            </ScrollView>
        </View>
    );
};

export default Terms;

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
        marginBottom: 20,
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
        fontSize: 18,
        marginLeft: 10,
        marginTop: 10,
        fontWeight: "600",
    },
    texts: {
        fontSize: 23,
        marginLeft: 10,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 10,
    },
    itemPara: {
        textAlign: "justify",
        fontSize: 16,
        fontWeight: "300",
        lineHeight: 25,
        padding: 10,
    },
});
