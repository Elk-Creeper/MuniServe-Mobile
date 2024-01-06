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
import { firebase } from "../config";
import { StatusBar } from "expo-status-bar";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";

const Council = () => {
    const [council, setCouncil] = useState([]);
    const MuniServe = firebase.firestore().collection("council");
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await MuniServe.get();
                const councilData = [];

                querySnapshot.forEach((doc) => {
                    const {
                        councils,
                        mayor,
                        viceMayor,
                        carling,
                        isid,
                        aaron,
                        uy,
                        antet,
                        adulta,
                        emma,
                        anie,
                    } = doc.data();
                    councilData.push({
                        id: doc.id,
                        councils,
                        mayor,
                        viceMayor,
                        carling,
                        isid,
                        aaron,
                        uy,
                        antet,
                        adulta,
                        emma,
                        anie,
                    });
                });

                setCouncil(councilData);
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
                <TouchableOpacity
                    onPress={() => {
                        router.push("/notif");
                    }}
                >
                    <Ionicons name="notifications-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <FlatList
                    data={council}
                    numColumns={1}
                    renderItem={({ item }) => (
                        <View style={styles.paraText}>
                            <View style={styles.councilImage}>
                                {item.councils && (
                                    <Image
                                        source={{ uri: item.councils }}
                                        style={styles.cImage}
                                    />
                                )}
                            </View>

                            <Text style={styles.muniText}>
                                Municipal Council for the Year
                                {'\n'} 2022 - 2025
                            </Text>

                            <TouchableOpacity style={styles.imageStyle}>
                                <Text style={styles.title}>Mayor</Text>
                                {item.mayor && (
                                    <Image source={{ uri: item.mayor }} style={styles.image} />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.name}>
                                <Text style={styles.names}>Melanie Abarientos-Garcia</Text>
                                <Text style={styles.dates}>2019 – Present</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.imageStyle}>
                                <Text style={styles.title}>Vice Mayor</Text>
                                {item.viceMayor && (
                                    <Image
                                        source={{ uri: item.viceMayor }}
                                        style={styles.image}
                                    />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.name}>
                                <Text style={styles.names}>Florencia “Florence” Bargo</Text>
                            </TouchableOpacity>

                            <Text style={styles.sanggu}>Sangguniang Bayan</Text>

                            <View style={styles.boxContainer}>
                                <View style={styles.box}>
                                    <TouchableOpacity style={styles.imageStyle}>
                                        {item.carling && (
                                            <Image
                                                source={{ uri: item.carling }}
                                                style={styles.image}
                                            />
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.name}>
                                        <Text style={styles.names}>Carlito A. Bocago</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.box}>
                                    <TouchableOpacity style={styles.imageStyle}>
                                        {item.isid && (
                                            <Image source={{ uri: item.isid }} style={styles.image} />
                                        )}
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.name}>
                                        <Text style={styles.names}>Isidro M. Magcawas</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.boxContainer}>
                                <View style={styles.box}>
                                    <TouchableOpacity style={styles.imageStyle}>
                                        {item.aaron && (
                                            <Image
                                                source={{ uri: item.aaron }}
                                                style={styles.image}
                                            />
                                        )}
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.name}>
                                        <Text style={styles.names}>Aaron L. Malinao</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.box}>
                                    <TouchableOpacity style={styles.imageStyle}>
                                        {item.uy && (
                                            <Image source={{ uri: item.uy }} style={styles.image} />
                                        )}
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.name}>
                                        <Text style={styles.names}>Eduardo C. Uy Jr.</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.boxContainer}>
                                <View style={styles.box}>
                                    <TouchableOpacity style={styles.imageStyle}>
                                        {item.antet && (
                                            <Image
                                                source={{ uri: item.antet }}
                                                style={styles.image}
                                            />
                                        )}
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.name}>
                                        <Text style={styles.names}>Francisco D. Verceluz</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.box}>
                                    <TouchableOpacity style={styles.imageStyle}>
                                        {item.adulta && (
                                            <Image
                                                source={{ uri: item.adulta }}
                                                style={styles.image}
                                            />
                                        )}
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.name}>
                                        <Text style={styles.names}>Augusto R. Adulta Jr.</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.boxContainer}>
                                <View style={styles.box}>
                                    <TouchableOpacity style={styles.imageStyle}>
                                        {item.emma && (
                                            <Image source={{ uri: item.emma }} style={styles.image} />
                                        )}
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.name}>
                                        <Text style={styles.names}>Emma Q. Jorvina</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.box}>
                                    <TouchableOpacity style={styles.imageStyle}>
                                        {item.anie && (
                                            <Image source={{ uri: item.anie }} style={styles.image} />
                                        )}
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.name}>
                                        <Text style={styles.names}>Arnel T. Verdejo</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                />
            </ScrollView>
        </View>
    );
};

export default Council;

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
    historyText: {
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
        textAlign: "center",
    },
    muniText: {
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
        marginTop: 5,
    },
    mayorsName: {
        fontSize: 16,
        fontWeight: "400",
        textAlign: "center",
        marginBottom: 10,
    },
    councilImage: {
        marginLeft: 10,
        alignItems: "center",
    },
    cImage: {
        width: 270,
        height: 150,
        resizeMode: "cover",
        borderRadius: 10,
    },
    image: {
        width: 100, // Adjust the width as needed
        height: 110, // Adjust the height as needed
        resizeMode: "cover", // Adjust the resizeMode as needed
        borderRadius: 10, // Optional: add border radius for rounded corners
        marginTop: 10, // Optional: add margin for spacing
    },
    imageStyle: {
        marginLeft: 10,
        marginTop: 20,
        alignItems: "center",
    },
    names: {
        fontSize: 15,
        fontWeight: "500",
        textAlign: "center",
        marginTop: 5,
    },
    dates: {
        fontSize: 15,
        fontWeight: "500",
        textAlign: "center",
        marginBottom: 20,
    },
    boxContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 30
    },
    title: { 
        fontSize: 18,
        fontWeight: "700",
    },
    sanggu: {
        fontSize: 25,
        fontWeight: "700",
        textAlign: 'center',
        marginTop: 30,
    },
});
