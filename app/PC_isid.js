import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../config";
import { StatusBar } from "expo-status-bar";

const Profile = () => {
    const [council, setCouncil] = useState([]);
    const MuniServe = firebase.firestore().collection("council");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await MuniServe.get();
                const councilData = [];

                querySnapshot.forEach((doc) => {
                    const {
                        isid,
                    } = doc.data();
                    councilData.push({
                        id: doc.id,
                        isid,
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
            <StatusBar backgroundColor="#93C49E" />

            <Text style={styles.profileText}>Profile Information</Text>

            <FlatList
                data={council}
                numColumns={1}
                renderItem={({ item }) => (
                    <View style={styles.paraText}>
                        <View style={styles.councilImage}>
                            {item.isid && (
                                <Image
                                    source={{ uri: item.isid }}
                                    style={styles.image}
                                />
                            )}
                        </View>

                        <Text style={styles.name}>Isidro Medalla Magcawas</Text>

                        <View style={styles.container1}>
                            <View style={styles.info}>
                                <Text style={styles.ask}>Date of Birth:</Text>
                                <Text style={styles.answer}>December 10, 1966</Text>
                            </View>

                            <View style={styles.info}>
                                <Text style={styles.ask}>Place of Birth:</Text>
                                <Text style={styles.answer}>Del Gallego, Camarines Sur</Text>
                            </View>

                            <View style={styles.info}>
                                <Text style={styles.ask}>Sex:</Text>
                                <Text style={styles.answer}>Male</Text>
                            </View>

                            <View style={styles.info}>
                                <Text style={styles.ask}>Civil Status:</Text>
                                <Text style={styles.answer}>Married</Text>
                            </View>

                            <View style={styles.info}>
                                <Text style={styles.ask}>Citizenship:</Text>
                                <Text style={styles.answer}>Filipino</Text>
                            </View>

                            <View style={styles.info}>
                                <Text style={styles.ask}>Address:</Text>
                                <Text style={styles.answer}>Sinuknipan 1, Del Gallego</Text>
                            </View>

                            <View style={styles.info}>
                                <Text style={styles.ask}>Educational Background:</Text>
                                <Text style={styles.answer}>Secondary</Text>
                            </View>

                            <View style={styles.info}>
                                <Text style={styles.ask}>Political Terms:</Text>
                                <Text style={styles.answer}>Last Terms</Text>
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    );

};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "left",
        backgroundColor: "white",
        padding: 20,
    },
    image: {
        width: 120,
        height: 130,
        resizeMode: "cover",
        borderRadius: 10,
        marginTop: 10,
    },
    councilImage: {
        alignItems: 'center',
        marginTop: 30,
    },
    name: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginTop: 8,
        marginBottom: 20,
    },
    profileText: {
        fontSize: 20,
        fontWeight: "600",
        textAlign: 'center',
        marginTop: 10,
    },
    info: {
        flexDirection: "row"
    },
    ask: {
        fontSize: 16,
        marginBottom: 20,
        fontWeight: '700'
    },
    answer: {
        fontSize: 16,
        marginLeft: 10,
        fontWeight: '400'
    },
    container1: {
        marginTop: 15,
    },
});
