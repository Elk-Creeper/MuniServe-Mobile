import React, { useState, useEffect, useRef } from "react";
import { View, TextInput, Text, StyleSheet, Animated, Image, ActivityIndicator, TouchableOpacity, ScrollView, Platform, Alert } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { firebase } from '../config';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Link, useRouter } from "expo-router";

export default function MarriageCertReq() {
    const router = useRouter();

    const [uploading, setUploading] = useState(false);
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const [selectedDateText, setSelectedDateText] = useState("");
    const [loadingModalVisible, setLoadingModalVisible] = useState(false);

    const [userUid, setUserUid] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userBarangay, setUserBarangay] = useState(null);
    const [userContact, setUserContact] = useState(null);
    const [userLastName, setUserLastName] = useState(null);

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const user = firebase.auth().currentUser;
                if (user) {
                    setUserUid(user.uid);
                    // Fetch user's name from Firestore using UID
                    const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
                    if (userDoc.exists) {
                        setUserName(userDoc.data().firstName);
                        setUserEmail(userDoc.data().email);
                        setUserBarangay(userDoc.data().barangay);
                        setUserContact(userDoc.data().contact);
                        setUserLastName(userDoc.data().lastName);

                    } else {
                        console.log("User data not found in Firestore");
                    }
                } else {
                    console.log("User not authenticated");
                }
            } catch (error) {
                console.error("Error getting user info:", error);
            }
        };

        getUserInfo();
    }, []);

    // upload media files
    const uploadMedia = async () => {
        setLoadingModalVisible(true);
        setUploading(true);

        try {
            // Validate required fields
            const requiredFields = [hname, wname, marriage, rname, address, copies, purpose];

            if (requiredFields.some(field => !field)) {
                Alert.alert("Incomplete Form", "Please fill in all required fields.");
                return;
            }

            // Validate name fields
            const nameFields = [hname, rname, wname];

            if (nameFields.some(name => !/^[a-zA-Z.\s]+$/.test(name.trim()))) {
                Alert.alert(
                    "Invalid Name",
                    "Name fields should only contain letters, dots, and spaces."
                );
                return;
            }

            // Validate the date
            if (!selectedDateText) {
                Alert.alert("Invalid Date", "Please select a valid date.");
                return;
            }

            // Validate the number of copies
            const parsedCopies = parseInt(copies);
            if (isNaN(parsedCopies) || parsedCopies <= 0) {
                Alert.alert("Invalid Number of Copies", "Please enter a valid number of copies.");
                return;
            }

            // Store the download URL in Firestore
            const MuniServe = firebase.firestore();
            const marriageCert = MuniServe.collection("marriageCert");

            await marriageCert.add({
                userUid: userUid,
                userName: userName,
                userLastName: userLastName,
                userEmail: userEmail,
                userContact: userContact,
                userBarangay: userBarangay,
                hname: hname,
                wname: wname,
                date: date,
                marriage: marriage,
                rname: rname,
                address: address,
                copies: copies,
                purpose: purpose,
                status: "Pending", // Set the initial status to "Pending"
                createdAt: timestamp,
                remarks: "",
            });

            setUploading(false);
            resetForm();
            Alert.alert("Success", "Form filled successfully. \n\nPlease prepare P110 pesos to be paid at Treasurer's Office and 1 valid ID for claiming your document at Civil Registrar Office.");
        } catch (error) {
            console.error(error);
            setUploading(false);
            Alert.alert("Error", "Form filling failed.");
        } finally {
            setUploading(false);
            setLoadingModalVisible(false); // Hide loading modal
        }
    };


    // Data add
    const [hname, setHname] = useState("");
    const [wname, setWname] = useState("");
    const [date, setDate] = useState(new Date());
    const [marriage, setMarriage] = useState("");
    const [rname, setRname] = useState("");
    const [address, setAddress] = useState("");
    const [copies, setCopies] = useState("");
    const [purpose, setPurpose] = useState("");

    const resetForm = () => {
        setHname("");
        setWname("");
        setDate(new Date());
        setMarriage("");
        setRname("");
        setAddress("");
        setCopies("");
        setPurpose("");
        setSelectedDateText("");
    };

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [maxDate, setMaxDate] = useState(new Date());

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();

        // Set maxDate only once when the component mounts
        if (!maxDate.getTime()) {
            setMaxDate(new Date());
        }

        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
        setSelectedDateText(formatDate(currentDate));
    };

    const formatDate = (date) => {
        // Format the date as needed (you can customize this based on your requirements)
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        return formattedDate;
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#93C49E" />
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
                <TouchableOpacity
                    onPress={() => {
                        router.push("/notif");
                    }}
                >
                    <Ionicons name="notifications-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={styles.boxes1}>
                    <View style={styles.boxAcc}>
                        <Image
                            source={require("../assets/imported/Del_Gallego_Camarines_Sur.png")}
                            style={styles.boxIcon}
                        />
                        <Text style={styles.itemService_name}>
                            Marriage Certificate
                        </Text>
                    </View>
                </View>

                <Text style={styles.noteText}>
                    Please be ready to supply the following information. Fill the form below:</Text>
                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>
                        COMPLETE NAME OF THE HUSBAND
                    </Text>

                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={hname}
                            onChangeText={(hname) => setHname(hname)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>
                        COMPLETE NAME OF THE WIFE
                    </Text>

                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={wname}
                            onChangeText={(wname) => setWname(wname)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>
                        DATE OF MARRIAGE
                    </Text>

                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={styles.placeholder}
                    >
                        <Text>{selectedDateText}</Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                            maximumDate={maxDate}
                        />
                    )}
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>
                        PLACE OF MARRIAGE
                    </Text>

                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={marriage}
                            onChangeText={(marriage) => setMarriage(marriage)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>
                        COMPLETE NAME OF THE REQUESTING PARTY
                    </Text>

                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={100}
                            value={rname}
                            onChangeText={(rname) => setRname(rname)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>
                        COMPLETE ADDRESS OF THE REQUESTING PARTY
                    </Text>

                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={100}
                            value={address}
                            onChangeText={(address) =>
                                setAddress(address)
                            }
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>
                        NUMBER OF COPIES NEEDED
                    </Text>

                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            value={copies}
                            onChangeText={(copies) => setCopies(copies)}
                            maxLength={10}
                            keyboardType="number-pad"
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>
                        PURPOSE OF THE CERTIFICATION
                    </Text>

                    <View style={styles.placeholder3}>
                        <TextInput
                            placeholder=""
                            multiline={true}
                            numberOfLines={5}
                            value={purpose}
                            onChangeText={(purpose) => setPurpose(purpose)}
                            maxLength={300}
                            style={{
                                width: "100%", textAlignVertical: "top",
                            }}
                        ></TextInput>
                    </View>
                </View>
              
                <View style={styles.imageContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            uploadMedia();
                        }}
                    >
                        <Text style={styles.submitText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {uploading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#307A59" />
                </View>
            )}
        </View>
    );
}

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
    boxes1: {
        width: "100%",
        height: 65,
        backgroundColor: "#307A59",
        borderRadius: 15,
        marginBottom: 30,
        marginTop: 15,
    },
    boxAcc: {
        flexDirection: "row",
    },
    boxIcon: {
        marginTop: 12,
        marginLeft: 15,
        width: 40,
        height: 40,
    },
    itemService_name: {
        marginLeft: 20,
        color: "white",
        fontSize: 18,
        marginTop: 19,
    },
    itemService_desc: {
        fontWeight: "300",
        fontSize: 15,
        textAlign: "justify",
        lineHeight: 30,
    },
    imageContainer: {
        marginTop: 20,
        alignItems: "center",
    },
    noteText: {
        fontSize: 17,
        textAlign: "justify",
        marginTop: 5,
        marginBottom: 5,
        fontWeight: "500",
    },
    button: {
        backgroundColor: "#307A59",
        alignItems: "center",
        borderRadius: 50,
        paddingVertical: 10,
        marginTop: 10,
        width: 165,
        marginLeft: 15,
    },
    submitText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "bold",
    },
    imageContainer: {
        marginTop: 30,
        marginBottom: 50,
        alignItems: "center",
    },
    placeholder: {
        width: "100%",
        height: 48,
        borderColor: "black",
        borderRadius: 8,
        borderWidth: 1,
        alignItems: "left",
        justifyContent: "center",
        textAlign: "justify",
        paddingLeft: 10,
    },
    placeholder2: {
        width: 150,
        height: 48,
        borderColor: "black",
        borderRadius: 8,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 10,
    },
    placeholder3: {
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 15,
        padding: 10,
        marginBottom: 20,
    },
    label: {
        fontSize: 15,
        fontWeight: "400",
        marginVertical: 8,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
});