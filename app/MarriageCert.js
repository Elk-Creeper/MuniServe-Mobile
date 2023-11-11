import React, { useState, useEffect } from "react";
import { Pressable, FlatList, View, TextInput, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Platform, SafeAreaView, Button, Alert } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { firebase } from '../config';
import * as FileSystem from 'expo-file-system';
import DateTimePicker from "@react-native-community/datetimepicker";

export default function BirthReg() {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All, //All, Image, Videos
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    // upload media files
    const uploadMedia = async () => {
        setUploading(true);

        try {
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

            // Upload the image to Firebase Storage
            const snapshot = await ref.put(blob);

            // Get the download URL of the uploaded image
            const downloadURL = await snapshot.ref.getDownloadURL();

            // Store the download URL in Firestore
            const MuniServe = firebase.firestore();
            const marriageCert = MuniServe.collection("marriageCert");

            await marriageCert.add({
                hname: hname,
                wname: wname,
                date: date,
                marriage: marriage,
                rname: rname,
                address: address,
                copies: copies,
                purpose: purpose,
                payment: downloadURL, // Store the download URL here
                status: "Pending", // Set the initial status to "Pending"
                createdAt: timestamp,
            });

            setUploading(false);
            setImage(null);
            Alert.alert("Success", "Form filled successfully.");
        } catch (error) {
            console.error(error);
            setUploading(false);
            Alert.alert("Error", "Form filling failed.");
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
    const [payment, setPayment] = useState("");

    const resetForm = () => {
        setHname("");
        setWname("");
        setDate("");
        setMarriage("");
        setRname("");
        setAddress("");
        setCopies("");
        setPurpose("");
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

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios'); // Close the date picker on iOS
        setDate(currentDate); // Update the state with the selected date
    };

    return (
        <View style={styles.container}>
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
                <TouchableOpacity>
                    <Ionicons name="notifications-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }}>
                <FlatList
                    data={serve}
                    numColumns={1}
                    renderItem={({ item }) => (
                        <Pressable>
                            <View style={styles.boxes1}>
                                <View style={styles.boxAcc}>
                                    <Image
                                        source={require("../assets/imported/Del_Gallego_Camarines_Sur.png")}
                                        style={styles.boxIcon}
                                    />
                                    <Text style={styles.itemService_name}>
                                        {item.service_name}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.innerContainer}>
                                <Text style={styles.itemService_desc}>
                                    {item.service_desc}
                                </Text>
                            </View>
                        </Pressable>
                    )}
                />

                <Text style={styles.noteText}>
                    Please be ready to supply the following information. Fill the form below:</Text>
                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>
                        Complete name of the husband
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
                        Complete name of the wife
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
                        Date of marriage
                    </Text>

                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={styles.placeholder}
                    >
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                        />
                    )}

                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>
                        Place of marriage
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
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <Text style={styles.noteText}>Note: Upload first your proof of payment before submitting your application. Lack of needed information will cause delay or rejection.</Text>
                <TouchableOpacity style={styles.selectButton} onPress={pickImage}>
                    <Text style={styles.buttonText}>
                        Proof of Payment(G-CASH RECEIPT)
                    </Text>
                </TouchableOpacity>

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
                            storeFormData();
                        }}
                    >
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
        width: "100%",
        height: 50,
        backgroundColor: "#307A59",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    buttonText: {
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
        alignItems: "center",
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
});