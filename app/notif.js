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

        const appointmentPage = firebase.firestore().collection("appointments");
        const unsubscribeTransaction = appointmentPage
            .where("userUid", "==", currentUserUid)
            .onSnapshot((querySnapshot) => {
                const appointments = [];
                const currentTime = new Date();

                querySnapshot.forEach((doc) => {
                    const {
                        department,
                        personnel,
                        reason,
                        status,
                        time,
                        date,
                        name,
                        createdAt,
                        remarks,
                        userName,
                    } = doc.data();

                    if (
                        date &&
                        date.toDate &&
                        time &&
                        time.toDate &&
                        createdAt &&
                        createdAt.toDate
                    ) {
                        const appointmentDate = date.toDate();
                        const formattedDate = appointmentDate.toLocaleDateString();
                        const formattedTime = time.toDate().toLocaleTimeString();

                        const timeDiffInMilliseconds = currentTime - createdAt.toDate();
                        const timeDiffInMinutes = Math.floor(
                            timeDiffInMilliseconds / (1000 * 60)
                        );

                        let formattedCreatedAt;
                        if (timeDiffInMinutes < 1) {
                            formattedCreatedAt = "Just now";
                        } else if (timeDiffInMinutes < 60) {
                            formattedCreatedAt = `${timeDiffInMinutes}m ago`;
                        } else if (timeDiffInMinutes < 1440) {
                            const hours = Math.floor(timeDiffInMinutes / 60);
                            formattedCreatedAt = `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
                        } else if (timeDiffInMinutes < 43200) { // 30 days in minutes
                            const days = Math.floor(timeDiffInMinutes / 1440);
                            formattedCreatedAt = `${days} ${days === 1 ? "day" : "days"} ago`;
                        } else if (timeDiffInMinutes < 525600) { // 365 days in minutes
                            const months = Math.floor(timeDiffInMinutes / 43200);
                            formattedCreatedAt = `${months} ${months === 1 ? "month" : "months"} ago`;
                        } else {
                            const years = Math.floor(timeDiffInMinutes / 525600);
                            formattedCreatedAt = `${years} ${years === 1 ? "year" : "years"} ago`;
                        }

                        appointments.push({
                            id: doc.id,
                            department,
                            personnel,
                            reason,
                            status,
                            date: formattedDate,
                            time: formattedTime,
                            name,
                            createdAt: formattedCreatedAt,
                            remarks,
                            userName,
                        });
                    } else {
                        console.warn(
                            "Skipping document with missing or invalid date/time/createdAt:",
                            doc.id
                        );
                    }
                });

                setAppointmentData(appointments);
            });

        return () => {
            unsubscribeTransaction();
        };
    }, []);

    const getStatusMessage = (item) => {
        const { userName, status, remarks, personnel, date, time, department } = item;

        switch (status) {
            case 'Pending':
                return `Dear ${userName}, your requested appointment for ${personnel} from ${department} on ${date} at ${time} is still PENDING.\n\nREMARKS: ${remarks}`;
            case 'Approved':
                return `Dear ${userName}, your requested appointment for ${personnel} from ${department} on ${date} at ${time} is already APPROVED.\n\nREMARKS: ${remarks}`;
            case 'Rejected':
                return `Dear ${userName}, your requested appointment for ${personnel} from ${department} on ${date} at ${time} is REJECTED.\n\nREMARKS: ${remarks}`;
           case 'Disapproved':
                return `Dear ${userName}, your requested appointment for ${personnel} from ${department} on ${date} at ${time} is DISAPPROVED.\n\nREMARKS: ${remarks}`;
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
            <Text style={styles.regText}>My Appointments</Text>

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
                                            <Text style={styles.itemCreatedAt}>
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
    itemStatus: {
        color: "green",
        fontWeight: "500",
        textTransform: "uppercase",
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
        fontSize: 23,
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
    itemCreatedAt: {
        marginLeft: 80,
        marginTop: 3,
        fontSize: 13,
        color: "#597ae8",
        fontWeight: "600",
    },
});
