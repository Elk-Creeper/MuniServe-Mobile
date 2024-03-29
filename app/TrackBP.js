import React, { useState, useEffect } from "react";
import { firebase } from "../config";
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";

const Transaction = () => {
    const [appointmentData, setAppointmentData] = useState([]);

    useEffect(() => {
        const currentUser = firebase.auth().currentUser;
        const currentUserUid = currentUser ? currentUser.uid : null;

        if (!currentUserUid) {
            // Handle the case when the user is not authenticated
            return;
        }

        const appointmentPage = firebase.firestore().collection("businessPermit");
        const unsubscribeTransaction = appointmentPage
            .where("userUid", "==", currentUserUid)
            .onSnapshot((querySnapshot) => {
                const appointments = [];
                const currentTime = new Date();

                querySnapshot.forEach((doc) => {
                    const { userName, status, createdAt, remarks} = doc.data();

                    // Add a check to ensure createdAt is defined
                    if (createdAt) {
                        const timeDiffInMilliseconds = currentTime - createdAt.toDate();
                        const timeDiffInMinutes = Math.floor(timeDiffInMilliseconds / (1000 * 60));

                        let formattedTimestamp;
                        if (timeDiffInMinutes < 1) {
                            formattedTimestamp = "Just now";
                        } else if (timeDiffInMinutes < 60) {
                            formattedTimestamp = `${timeDiffInMinutes}m ago`;
                        } else if (timeDiffInMinutes < 1440) {
                            const hours = Math.floor(timeDiffInMinutes / 60);
                            formattedTimestamp = `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
                        } else {
                            formattedTimestamp = createdAt.toDate().toLocaleDateString();
                        }

                        appointments.push({
                            id: doc.id,
                            userName,
                            status,
                            remarks,
                            createdAt: formattedTimestamp,
                        });
                    }
                });

                setAppointmentData(appointments);
            });

        return () => {
            unsubscribeTransaction();
        };
    }, []);

    const getStatusMessage = (item) => {
        const { userName, status, remarks} = item;

        switch (status) {
            case 'Pending':
                return `Dear ${userName}, your request for Business Permit is PENDING. REMARKS: ${remarks}`;
            case 'Approved':
                return `Dear ${userName}, your request for Business Permit is already APPROVED and now ready to be processed. REMARKS: ${remarks}`;
            case 'Rejected':
                return `Dear ${userName}, your request for Business Permit is now REJECTED. Please wait for at least 10 days for it to be completed. REMARKS: ${remarks}`;
            case 'Completed':
                return `Dear ${userName}, your request for Business Permit has been COMPLETED and ready to be claimed at the Office of Municipal Civil Registrar. Note that you can claim it during office hours and days. REMARKS: ${remarks}`;
            case 'On Process':
                return `Dear ${userName}, your request for Business Permit has been ON PROCESS. REMARKS: ${remarks}`;
                default:
                return ''; // Handle other statuses if needed
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor="#93C49E" // Change the background color as needed
            />
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
            </View>
            <Text style={styles.regText}>Business Permit Transaction</Text>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={styles.container5}>
                    {appointmentData.length === 0 ? (
                        <View style={styles.emptyListContainer}>
                            <Image
                                source={require("../assets/imported/box.png")} // Replace with your empty image source
                                style={styles.emptyBox}
                            />
                            <Text style={styles.emptyBoxText}>No appointments found.</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={appointmentData}
                            renderItem={({ item }) => (
                                <View style={styles.container2}>
                                    <View style={styles.container4}>
                                        <Image
                                            source={require("../assets/imported/Del_Gallego_Camarines_Sur.png")}
                                            style={styles.boxIcon}
                                        />
                                        <Text style={styles.appText}>Transaction</Text>
                                        <Text style={styles.itemTimestamp}>
                                            {item.createdAt}
                                        </Text>
                                    </View>
                                    <Text style={styles.itemPersonnel}>
                                        {getStatusMessage(item)}
                                    </Text>
                                </View>
                            )}
                        />

                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default Transaction;

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
    container2: {
        padding: 15,
        borderRadius: 15,
        margin: 5,
        marginHorizontal: 10,
        borderWidth: 1,
        backgroundColor: "#F6F3F3",
    },
    container5: {
        marginBottom: 30,
    },
    itemPersonnel: {
        textAlign: "justify",
        lineHeight: 20,
    },
    appText: {
        fontSize: 18,
        marginLeft: 8,
        marginBottom: 10,
    },
    regText: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: "500",
        marginBottom: 20,
    },
    boxIcon: {
        width: 25,
        height: 25,
    },
    container4: {
        flexDirection: "row",
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
    itemTimestamp: {
        marginLeft: 70,
        marginTop: 3,
        fontSize: 13,
        color: "#597ae8",
        fontWeight: "600",
    },
});
