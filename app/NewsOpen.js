import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
} from "react-native";
import { firebase } from "../config";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

const NewsOpen = () => {
    const [news, setNews] = useState([]);
    const MuniServe = firebase.firestore().collection("news");

    const calculateElapsedTime = (createdAt) => {
        const now = new Date();
        const createdDate = createdAt.toDate();
        const timeDifference = now - createdDate;
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);

        if (seconds < 60) {
            return `${seconds} ${seconds === 1 ? "s" : "s"} ago`;
        } else if (minutes < 60) {
            return `${minutes} ${minutes === 1 ? "min" : "mins"} ago`;
        } else if (hours < 24) {
            return `${hours} ${hours === 1 ? "hour" : "hrs"} ago`;
        } else if (days < 30) {
            return `${days} ${days === 1 ? "day" : "days"} ago`;
        } else if (months < 12) {
            return `${months} ${months === 1 ? "month" : "months"} ago`;
        } else {
            return `${years} ${years === 1 ? "year" : "years"} ago`;
        }
    };

    useEffect(() => {
        const unsubscribe = MuniServe.onSnapshot((querySnapshot) => {
            const newsData = [];

            querySnapshot.forEach((doc) => {
                const { imageUrls, content, createdAt, title } = doc.data();

                if (createdAt && createdAt.toDate) {
                    const formattedCreatedAt = calculateElapsedTime(createdAt);

                    newsData.push({
                        id: doc.id,
                        imageUrls,
                        content,
                        createdAt: formattedCreatedAt,
                        title,
                    });
                } else {
                    console.warn(
                        "Skipping document with missing or invalid createdAt:",
                        doc.id
                    );
                }
            });

            setNews(newsData);
        });

        return () => unsubscribe(); // Cleanup function to unsubscribe from the snapshot listener
    }, []); // Empty dependency array means this effect runs once on mount

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#93C49E" />

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

            <Text style={styles.newsText}>News and Announcements</Text>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                {news.length === 0 ? (
                    <View style={styles.emptyListContainer}>
                        <Image
                            source={require("../assets/imported/box.png")} // Replace with your empty image source
                            style={styles.emptyBox}
                        />
                        <Text style={styles.emptyBoxText}>No Data found.</Text>
                    </View>
                ) : (
                    <FlatList
                        style={{ height: "100%" }}
                        data={news}
                        numColumns={1}
                        renderItem={({ item }) => (
                            <View style={styles.container2}>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                <View style={styles.container3}>
                                    <Image
                                        source={require("../assets/imported/Del_Gallego_Camarines_Sur.png")}
                                        style={styles.boxIcon}
                                    />
                                    <Text style={styles.appText}>Admin</Text>
                                    <Text style={styles.itemCreatedAt}> {item.createdAt}</Text>
                                </View>
                                <View style={styles.subContainer3}>
                                    <View style={styles.imageStyle}>
                                        {item.imageUrls &&
                                            item.imageUrls.length > 0 &&
                                            item.imageUrls.map((imageUrl, index) => (
                                                <Image
                                                    key={index}
                                                    source={{ uri: imageUrl }}
                                                    style={styles.cImage}
                                                />
                                            ))}
                                    </View>
                                </View>
                                <Text style={styles.itemContent}>{item.content}</Text>
                            </View>
                        )}
                    />
                )}
            </ScrollView>
        </View>
    );
};

export default NewsOpen;

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
        marginBottom: 10,
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
    assembler: {
        flexDirection: "row",
        marginTop: 20,
        marginBottom: 20,
        justifyContent: "center",
    },
    Main: {
        backgroundColor: "#FFF",
        width: "92%",
        height: 40,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 50,
    },
    Input: {
        marginLeft: 10,
        marginTop: 5,
    },
    newsText: {
        fontSize: 20,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 20,
    },
    newsImage: {
        marginLeft: 10,
        alignItems: "center",
        marginTop: 10,
    },
    cImage: {
        width: 300,
        height: 200,
        resizeMode: "cover",
        borderRadius: 5,
    },
    imageStyle: {
        marginTop: 10,
        alignItems: "center",
        marginBottom: 20,
    },
    container2: {
        margin: 5,
        marginHorizontal: 10,
        marginTop: 10,
    },
    itemContent: {
        textAlign: "justify",
        lineHeight: 25,
        marginTop: 10,
        fontSize: 15,
    },
    itemTitle: {
        fontWeight: "700",
        marginBottom: 30,
        fontSize: 30,
    },
    appText: {
        fontSize: 18,
        marginLeft: 8,
        marginBottom: 10,
    },
    boxIcon: {
        width: 25,
        height: 25,
    },
    container4: {
        flexDirection: "row",
    },
    container3: {
        flexDirection: "row",
    },
    itemCreatedAt: {
        marginLeft: 140,
        fontSize: 13,
        color: "#597ae8",
        fontWeight: "600",
    },
    emptyBox: {
        width: 130,
        height: 130,
        marginLeft: 95,
        marginTop: 150,
    },
    emptyBoxText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 270,
    },
});
