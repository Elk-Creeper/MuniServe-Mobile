import { View, Text, FlatList, StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../config";
import { StatusBar } from "expo-status-bar";

const Faqs = () => {

    const [faqs, setFaqs] = useState([]);
    const MuniServe = firebase.firestore().collection("faqs");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await MuniServe.get();
                const faqs = [];

                querySnapshot.forEach((doc) => {
                    const { q1, q2, q3, q4, q5, a1, a2, a3, a4, a5 } = doc.data();
                    faqs.push({
                        id: doc.id,
                        q1,
                        q2,
                        q3,
                        q4,
                        q5,
                        a1,
                        a2,
                        a3,
                        a4,
                        a5,
                    });
                });

                setFaqs(faqs);
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
                <Text style={styles.faqText}>Frequently asked questions</Text>
            </View>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <FlatList
                    data={faqs}
                    numColumns={1}
                    renderItem={({ item }) => (
                        <View style={styles.qaText}>
                            <Text style={styles.itemQ1}>{item.q1}</Text>
                            <Text style={styles.itemA1}>{item.a1}</Text>
                            <Text style={styles.itemQ2}>{item.q2}</Text>
                            <Text style={styles.itemA2}>{item.a2}</Text>
                            <Text style={styles.itemQ3}>{item.q3}</Text>
                            <Text style={styles.itemA3}>{item.a3}</Text>
                            <Text style={styles.itemQ4}>{item.q4}</Text>
                            <Text style={styles.itemA4}>{item.a4}</Text>
                            <Text style={styles.itemQ5}>{item.q5}</Text>
                            <Text style={styles.itemA5}>{item.a5}</Text>
                        </View>
                    )}
                />
            </ScrollView>
        </View>
    );
};

export default Faqs;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "left",
        backgroundColor: "white",
        padding: 35,
    },
    header: {
        backgroundColor: "#307A59",
        borderRadius: 10,
    },
    faqText: {
        fontSize: 17,
        textAlign: "center",
        marginTop: 15,
        fontWeight: "500",
        marginBottom: 15,
        color: "white",
        fontWeight: "400",
    },
    text: {
        fontSize: 21,
        marginTop: 30,
        fontWeight: "500",
        marginBottom: 25,
        textAlign: 'center',
    },
    itemA1: {
        textAlign: "justify",
        fontSize: 15,
        fontWeight: "300",
        lineHeight: 25,
        marginTop: 10,
    },
    itemQ1: {
        textAlign: "justify",
        marginTop: 40,
        fontSize: 18,
    },
    itemA2: {
        textAlign: "justify",
        fontSize: 15,
        fontWeight: "300",
        lineHeight: 25,
        marginTop: 10,
    },
    itemQ2: {
        textAlign: "justify",
        marginTop: 15,
        fontSize: 18,
    },
    itemA3: {
        textAlign: "justify",
        fontSize: 15,
        fontWeight: "300",
        lineHeight: 25,
        marginTop: 10,
    },
    itemQ3: {
        textAlign: "justify",
        marginTop: 30,
        fontSize: 18,
    },
    itemA4: {
        textAlign: "justify",
        fontSize: 15,
        fontWeight: "300",
        lineHeight: 25,
        marginTop: 10,
    },
    itemQ4: {
        textAlign: "justify",
        fontSize: 18,
    },
    itemA5: {
        textAlign: "justify",
        fontSize: 15,
        fontWeight: "300",
        lineHeight: 25,
        marginTop: 10,
        marginBottom: 20,
    },
    itemQ5: {
        textAlign: "justify",
        marginTop: 15,
        fontSize: 18,
    },
});