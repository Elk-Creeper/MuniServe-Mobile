import { View, Text, FlatList, StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../config";
import { StatusBar } from "expo-status-bar";

const About = () => {
    const [about, setAbout] = useState([]);
    const MuniServe = firebase.firestore().collection("about");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await MuniServe.get();
                const about = [];

                querySnapshot.forEach((doc) => {
                    const { paragraph } = doc.data();
                    about.push({
                        id: doc.id,
                        paragraph,
                    });
                });

                setAbout(about);
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
                <Text style={styles.aboutText}>About MuniServe</Text>
            </View>

            <Text style={styles.text}>About MuniServe</Text>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <FlatList
                    data={about}
                    numColumns={1}
                    renderItem={({ item }) => (
                        <View style={styles.paraText}>
                            <Text style={styles.itemPara}>{item.paragraph}</Text>
                        </View>
                    )}
                />
            </ScrollView>
        </View>
    );
};

export default About;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "left",
        backgroundColor: "white",
        padding: 35,
    },
    header: {
        marginTop: 10,
        backgroundColor: "#307A59",
        borderRadius: 10,
    },
    aboutText: {
        fontSize: 17,
        textAlign: "center",
        marginTop: 15,
        fontWeight: "500",
        marginBottom: 15,
        color: 'white',
        fontWeight: '400'
    },
    text: {
        fontSize: 21,
        marginTop: 30,
        fontWeight: "500",
        marginBottom: 15,
        textAlign: "center",
    },
    itemPara: {
        textAlign: "justify",
        fontSize: 16,
        fontWeight: "300",
        lineHeight: 25,
        marginTop: 15,
    },
});