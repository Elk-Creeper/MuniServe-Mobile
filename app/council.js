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
import { Link, useRouter } from "expo-router";

const Council = () => {
    const router = useRouter();

    const [council, setCouncil] = useState([]);
    const MuniServe = firebase.firestore().collection("council");

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

            <Text style={styles.muniText}>
                Municipal Council for the Year
                {'\n'} 2022 - 2025
            </Text>

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

                            <TouchableOpacity style={styles.imageStyle} onPress={() => {
                                router.push("/PC_mayora");
                            }}>
                                <Text style={styles.title}>Mayor</Text>
                                {item.mayor && (
                                    <Image source={{ uri: item.mayor }} style={styles.image} />
                                )}
                        
                                <Text style={styles.names}>Melanie Abarientos-Garcia</Text>
                                <Text style={styles.dates}>2019 – Present</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.imageStyle} onPress={() => {
                                router.push("/PC_florence");
                            }}>
                                <Text style={styles.title}>Vice Mayor</Text>
                                {item.viceMayor && (
                                    <Image
                                        source={{ uri: item.viceMayor }}
                                        style={styles.image}
                                    />
                                )}
                           
                                <Text style={styles.names}>Florencia “Florence” Bargo</Text>
                            </TouchableOpacity>

                            <Text style={styles.sanggu}>Sangguniang Bayan</Text>

                            <View style={styles.boxContainer}>
                                <View style={styles.box}>
                                    <TouchableOpacity style={styles.imageStyle} onPress={() => {
                                        router.push("/PC_carling");
                                    }}>
                                        {item.carling && (
                                            <Image
                                                source={{ uri: item.carling }}
                                                style={styles.image}
                                            />
                                        )}
                                    
                                        <Text style={styles.names}>Carlito A. Bocago</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.box}>
                                    <TouchableOpacity style={styles.imageStyle} onPress={() => {
                                        router.push("/PC_isid");
                                    }}>
                                        {item.isid && (
                                            <Image source={{ uri: item.isid }} style={styles.image} />
                                        )}

                                        <Text style={styles.names}>Isidro M. Magcawas</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.boxContainer}>
                                <View style={styles.box}>
                                    <TouchableOpacity style={styles.imageStyle} onPress={() => {
                                        router.push("/PC_aaron");
                                    }}>
                                        {item.aaron && (
                                            <Image source={{ uri: item.aaron }} style={styles.image} />
                                        )}

                                        <Text style={styles.names}>Aaron A. Malinao</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.box}>
                                    <TouchableOpacity style={styles.imageStyle} onPress={() => {
                                        router.push("/PC_uy");
                                    }}>
                                        {item.uy && (
                                            <Image source={{ uri: item.uy }} style={styles.image} />
                                        )}
                                  
                                        <Text style={styles.names}>Eduardo C. Uy Jr.</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.boxContainer}>
                                <View style={styles.box} >
                                    <TouchableOpacity style={styles.imageStyle} onPress={() => {
                                        router.push("/PC_antet");
                                    }}>
                                        {item.antet && (
                                            <Image
                                                source={{ uri: item.antet }}
                                                style={styles.image}
                                            />
                                        )}
                                   
                                        <Text style={styles.names}>Francisco D. Verceluz</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.box}>
                                    <TouchableOpacity style={styles.imageStyle} onPress={() => {
                                        router.push("/PC_adulta");
                                    }}>
                                        {item.adulta && (
                                            <Image
                                                source={{ uri: item.adulta }}
                                                style={styles.image}
                                            />
                                        )}
                                   
                                        <Text style={styles.names}>Augusto R. Adulta Jr.</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.boxContainer}>
                                <View style={styles.box}>
                                    <TouchableOpacity style={styles.imageStyle} onPress={() => {
                                        router.push("/PC_ems");
                                    }}>
                                        {item.emma && (
                                            <Image source={{ uri: item.emma }} style={styles.image} />
                                        )}
                                  
                                        <Text style={styles.names}>Emma Q. Jorvina</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.box}>
                                    <TouchableOpacity style={styles.imageStyle} onPress={() => {
                                        router.push("/PC_anie");
                                    }}>
                                        {item.anie && (
                                            <Image source={{ uri: item.anie }} style={styles.image} />
                                        )}
                                  
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
    muniText: {
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center",
        marginTop: 10,
        marginBottom: 20,
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
        width: 100, 
        height: 110, 
        resizeMode: "cover", 
        borderRadius: 10, 
        marginTop: 10, 
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
