import React, { useState, useEffect } from "react";
import { View, TextInput, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, SafeAreaView, Alert } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { firebase } from '../config';
import * as FileSystem from 'expo-file-system';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Link, useRouter } from "expo-router";

export default function DeathCertReq() {
    const router = useRouter();

    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const [selectedDateText, setSelectedDateText] = useState("");
    const [loadingModalVisible, setLoadingModalVisible] = useState(false);

    const [userUid, setUserUid] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userBarangay, setUserBarangay] = useState(null);
    const [userContact, setUserContact] = useState(null);

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: false,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert(
                "Error",
                "There was an error picking images. Please try again.",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
            );
        }
    };

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

    const uploadMedia = async () => {
        setLoadingModalVisible(true);
        setUploading(true);

        try {
            // Check for null or empty values in required fields
            const requiredFields = [
                name,
                place,
                rname,
                address,
                copies,
                purpose,
            ];

            if (requiredFields.some((field) => !field || field.trim() === '')) {
                Alert.alert(
                    "Incomplete Form",
                    "Please fill in all required fields.",
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

            // Validate the name and rname fields
            if (!/^[a-zA-Z. ]+$/.test(name)) {
                Alert.alert("Invalid Characters", "Name should only contain letters, dots, and spaces.");
                return;
            }

            if (!/^[a-zA-Z. ]+$/.test(rname)) {
                Alert.alert("Invalid Characters", "Requesting party name should only contain letters, dots, and spaces.");
                return;
            }

            // Check if the user has selected an image
            if (!image) {
                Alert.alert("Missing Image", "Please select an image for proof of payment.");
                return;
            }

            const { uri } = await FileSystem.getInfoAsync(image);
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = () => {
                    resolve(xhr.response);
                };
                xhr.onerror = (e) => {
                    reject(new TypeError("Network request failed"));
                };
                xhr.responseType = "blob";
                xhr.open("GET", uri, true);
                xhr.send(null);
            });

            const filename = image.substring(image.lastIndexOf("/") + 1);
            const ref = firebase.storage().ref().child(filename);

            const snapshot = await ref.put(blob);
            const downloadURL = await snapshot.ref.getDownloadURL();

            const MuniServe = firebase.firestore();
            const deathCert = MuniServe.collection("deathCert");

            await deathCert.add({
                userUid: userUid,
                userName: userName,
                userEmail: userEmail,
                userContact: userContact,
                userBarangay: userBarangay,
                name: name,
                date: date,
                place: place,
                rname: rname,
                address: address,
                copies: parsedCopies,
                purpose: purpose,
                payment: downloadURL,
                status: "Pending",
                createdAt: timestamp,
            });

            setImage(null);
            resetForm();
            Alert.alert("Success", "Form filled successfully.");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Form filling failed.");
        } finally {
            setUploading(false);
            setLoadingModalVisible(false);
        }
    };

    // Data add
    const [name, setName] = useState("");
    const [date, setDate] = useState(new Date());
    const [place, setPlace] = useState("");
    const [rname, setRname] = useState("");
    const [address, setAddress] = useState("");
    const [copies, setCopies] = useState("");
    const [purpose, setPurpose] = useState("");
    const [payment, setPayment] = useState("");

    const resetForm = () => {
        setName("");
        setDate(new Date());
        setPlace("");
        setRname("");
        setAddress("");
        setCopies("");
        setPurpose("");
        setPayment("");

        // Reset date related states
        setSelectedDateText("");
    };

    const [serve, setServe] = useState([]);
    const MuniServe = firebase.firestore().collection("services");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await MuniServe.get(); // Use get() to fetch the data
                const serve = [];

                querySnapshot.forEach((doc) => {
                    const { service_name, service_desc, service_proc } = doc.data();
                    serve.push({
                        id: doc.id,
                        service_name,
                        service_desc,
                        service_proc,
                    });
                });

                setServe(serve);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

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
        <SafeAreaView style={styles.container}>
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
                            Death Certificate Request
                        </Text>
                    </View>
                </View>
                <View style={styles.innerContainer}>
                    <Text style={styles.itemService_desc}>
                        A Death Certificate is an official document setting forth particulars relating to a dead person, including the name of the individual, the date of birth and the date of death.  When requesting for death certificate, the interested party shall provide the following information to facilitate verification and issuance of certification.
                    </Text>
                </View>


                <Text style={styles.noteText}>
                    Please be ready to supply the following information. Fill the form below:</Text>
                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>
                        Complete name of the deceased person
                    </Text>

                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={name}
                            onChangeText={(name) => setName(name)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>
                        Date of death
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
                        Place of death
                    </Text>

                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={place}
                            onChangeText={(place) => setPlace(place)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>
                        Complete name of the requesting party
                    </Text>

                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
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
                        Complete address of the requesting party
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
                        Number of copies needed
                    </Text>

                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            value={copies}
                            onChangeText={(copies) => setCopies(copies)}
                            maxLength={10}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>
                        Purpose of the certification
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

                <Text style={styles.noteText}>Note: Upload first your proof of payment before submitting your application. Lack of needed information will cause delay or rejection.</Text>
                
                <Text style={styles.noteText2}>
                    FEE FOR REGISTRATION: 110 PESOS
                </Text>
                
                <View style={styles.selectButton}>
                    <Text style={styles.buttonText}>Proof of Payment(G-CASH RECEIPT)</Text>
                    <TouchableOpacity onPress={pickImage}>
                        {payment.length > 0 ? (
                            <Animatable.View
                                style={{
                                    ...styles.plusCircle,
                                    opacity: fadeAnimation,
                                }}
                            >
                                <Ionicons name="ios-add" size={24} color="white" />
                            </Animatable.View>
                        ) : (
                            <View style={styles.plusCircle}>
                                <Ionicons name="ios-add" size={24} color="white" />
                            </View>
                        )}
                        {payment.length > 0 && (
                            <View style={styles.checkCircle}>
                                <Ionicons name="ios-checkmark" size={24} color="white" />
                            </View>
                        )}

                    </TouchableOpacity>
                </View>

                <View style={styles.imageContainer}>
                    {image && (
                        <Image
                            source={{ uri: image }}
                            style={{ width: 300, height: 300 }}
                        />
                    )}
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
        </SafeAreaView>
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
    serveText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "black",
        textAlign: "left",
        marginTop: 15,
        marginBottom: 15,
    },
    boxes1: {
        width: "100%",
        height: 65,
        backgroundColor: "#307A59",
        borderRadius: 15,
        marginBottom: 30,
        marginTop: 15,
    },
    box: {
        marginLeft: 20,
        color: "white",
        fontSize: 17,
        marginTop: 19,
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
    containers: {
        alignItems: "center",
        justifyContent: "center",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#307A59",
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginTop: 25,
        height: 60,
    },
    icon: {
        marginRight: 10,
        color: "#307A59", // Change the color to match your design
    },
    input: {
        flex: 1,
        fontSize: 17,
    },
    loginButton: {
        backgroundColor: "#307A59",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        paddingVertical: 10,
        marginTop: 20,
        width: 165,
    },
    loginButtonText: {
        color: "white",
        fontSize: 15,
    },
    serveContainer: {
        padding: 15,
        borderRadius: 15,
        margin: 5,
        marginHorizontal: 10,
    },
    innerContainer: {
        alignContent: "center",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
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
    itemService_proc: {
        fontWeight: "300",
        fontSize: 15,
        textAlign: "justify",
        lineHeight: 30,
    },
    imageContainer: {
        marginTop: 20,
        alignItems: "center",
    },
    imageName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: "cover",
    },
    closeButton: {
        position: "absolute",
        top: 30,
        right: 10,
        backgroundColor: "#307A59",
        borderRadius: 100,
        padding: 5,
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
    },
    closeButtonText: {
        fontSize: 18,
        color: "white",
        textAlign: "center",
    },
    regText: {
        fontSize: 25,
        textAlign: "center",
    },
    noteText: {
        fontSize: 17,
        textAlign: "justify",
        marginTop: 5,
        marginBottom: 5,
        fontWeight: "500",
    },
    noteText2: {
        fontSize: 17,
        textAlign: "justify",
        marginTop: 5,
        marginBottom: 5,
        fontWeight: "500",
        color: "#945",
    },
    boxContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    Input: {
        marginLeft: 10,
        marginTop: 5,
        textAlign: "left",
    },
    Main: {
        backgroundColor: "#FFF",
        width: 270,
        height: 40,
        borderWidth: 1,
        borderColor: "black",
        borderTopLeftRadius: 40,
        borderBottomLeftRadius: 40,
    },
    button: {
        backgroundColor: "#307A59",
        alignItems: "center",
        borderRadius: 50,
        paddingVertical: 10,
        marginTop: 10,
        width: 165,
        marginLeft: 15,
        marginBottom: 40,
    },
    selectButton: {
        borderRadius: 10,
        flexDirection: "row", // Align items horizontally
        justifyContent: "space-between", // Space between children
        alignItems: "center", // Center vertically
        width: "100%",
        height: 50,
        backgroundColor: "transparent",
        borderColor: "#000",
        borderWidth: 1,
        marginTop: 10,
        flexDirection: "row",
        marginVertical: 10,
        padding: 10,
    },
    buttonText: {
        flex: 1, // Take up available space
        color: "#000",
        fontSize: 14,
        fontWeight: "light",
        textAlign: "left",
    },
    plusCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#307A59",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10, // Adjust margin as needed
    },
    checkCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#3498db", // Check sign color
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10, // Adjust margin as needed
        marginBottom: 30,
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
        alignItems: "justify",
        justifyContent: "center",
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
    datePickerStyle: {
        width: '100%',
        borderColor: 'black',
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
});