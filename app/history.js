import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ScrollView,
    Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../config";
import { StatusBar } from "expo-status-bar";

const History = () => {
    const [history, setHistory] = useState([]);
    const MuniServe = firebase.firestore().collection("history");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await MuniServe.get();
                const historyData = [];

                querySnapshot.forEach((doc) => {
                    const { paragraph, mayor, text, text2, para2, para3, para4, para5, para6, para7, para8, para9, imageUrl } = doc.data();
                    historyData.push({
                        id: doc.id,
                        paragraph,
                        mayor,
                        text,
                        text2,
                        para2,
                        para3,
                        para4,
                        para5,
                        para6,
                        para7,
                        para8,
                        para9,
                        imageUrl, // assuming imageUrl is a field in your Firestore document
                    });
                });

                setHistory(historyData);
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

            <Text style={styles.historyText}>The Town of Del Gallego</Text>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <FlatList
                    data={history}
                    numColumns={1}
                    renderItem={({ item }) => (
                        <View style={styles.paraText}>
                            <View style={styles.imageStyle}>
                                {item.imageUrl && (
                                    <Image source={{ uri: item.imageUrl }} style={styles.image} />
                                )}
                            </View>
                            <Text style={styles.itemPara}>{item.paragraph}</Text>
                            <Text style={styles.itemPara1}>{item.para2}</Text>
                            <Text style={styles.itemPara1}>{item.para3}</Text>
                            <Text style={styles.itemText}>{item.text}</Text>
                            <Text style={styles.itemPara1}>{item.para4}</Text>
                            <Text style={styles.itemPara2}>{item.para5}</Text>
                            <Text style={styles.itemPara2}>{item.para6}</Text>
                            <Text style={styles.itemPara2}>{item.para7}</Text>
                            <Text style={styles.itemText}>{item.text2}</Text>
                            <Text style={styles.itemPara1}>{item.para8}</Text>
                            <Text style={styles.itemPara1}>{item.para9}</Text>
                            <Text style={styles.itemText}>{item.mayor}</Text>
                        </View>
                    )}
                />
                <Text style={styles.mayorsName}>Don Juan Del Gallego 1937 – 1938</Text>
                <Text style={styles.mayorsName}>Franciso Navarro 1939 – 1940 </Text>
                <Text style={styles.mayorsName}>Jose U. Del Gallego 1941-1942</Text>
                <Text style={styles.mayorsName}>Emilio Q. Natano 1942-1944</Text>
                <Text style={styles.mayorsName}>Casiano Lampos 1945 – 1946</Text>
                <Text style={styles.mayorsName}>Teodulo Rodejo 1947</Text>
                <Text style={styles.mayorsName}>Alfredo Y. Adulta 1948 – 1951</Text>
                <Text style={styles.mayorsName}>Silverio B. Veluz 1952 – 1959</Text>
                <Text style={styles.mayorsName}>Napoleon Pendor 1960 – 1971</Text>
                <Text style={styles.mayorsName}>Julio U. Del Gallego 1972 – 1976</Text>
                <Text style={styles.mayorsName}>Noneluna Pendor 1976 – 1978</Text>
                <Text style={styles.mayorsName}>Lucy B. Veluz 1978 – 1986</Text>
                <Text style={styles.mayorsName}>Henry Pendor 1986 – 1988</Text>
                <Text style={styles.mayorsName}>Silverio B. Veluz 1988 – 1998</Text>
                <Text style={styles.mayorsName}>Eduardo Q. Uy Sr. 1998 – 2000</Text>
                <Text style={styles.mayorsName}>Bayani B. Veluz 2000 – 2001</Text>
                <Text style={styles.mayorsName}>Carolina C. Uy 2001 – 2003</Text>
                <Text style={styles.mayorsName}>Lydia B. Abarientos 2010 – 2019</Text>
                <Text style={styles.mayorsName1}>Melanie Abarientos-Garcia 2019 – Present</Text>
            </ScrollView>
        </View>
    );
};

export default History;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "left",
        backgroundColor: "white",
    },
    historyText: {
        fontSize: 18,
        textAlign: "center",
        marginTop: 40,
        fontWeight: "500",
        marginBottom: 15,
        fontWeight: "600",
    },
    paraText: {
        paddingHorizontal: 35,
    },
    itemPara: {
        textAlign: "justify",
        fontSize: 16,
        fontWeight: "300",
        lineHeight: 25,
        marginTop: 30,
    },
    itemPara1: {
        textAlign: "justify",
        fontSize: 16,
        fontWeight: "300",
        lineHeight: 25,
    },
    itemPara2: {
        textAlign: "justify",
        fontSize: 16,
        fontWeight: "300",
        lineHeight: 25,
        marginTop: 20,
    },
    itemText: {
        fontSize: 20,
        fontWeight: "500",
        textAlign: "center",
        marginTop: 15,
        marginBottom: 15,
    },
    mayorsName: {
        fontSize: 16,
        fontWeight: "400",
        textAlign: "center",
        marginBottom: 10,
    },
    mayorsName1: {
        fontSize: 16,
        fontWeight: "400",
        textAlign: "center",
        marginBottom: 50,
    },
    image: {
        width: 300, // Adjust the width as needed
        height: 200, // Adjust the height as needed
        resizeMode: "center", // Adjust the resizeMode as needed
        borderRadius: 10, // Optional: add border radius for rounded corners
        marginTop: 10, // Optional: add margin for spacing
    },
    imageStyle: {
        alignItems: "center",
    },
});
