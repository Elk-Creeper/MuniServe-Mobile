import React, { useState, useEffect, useRef } from "react";
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    Animated,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    Platform,
    Alert,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { firebase } from "../config";
import * as FileSystem from "expo-file-system";
import * as Animatable from "react-native-animatable";
import { Link, useRouter } from "expo-router";
import * as DocumentPicker from 'expo-document-picker';

export default function JobApplication() {
    const router = useRouter();

    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const fadeAnimation = useRef(new Animated.Value(1)).current;
    const [loadingModalVisible, setLoadingModalVisible] = useState(false);

    const [userUid, setUserUid] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userBarangay, setUserBarangay] = useState(null);
    const [userContact, setUserContact] = useState(null);

    const [documents, setDocuments] = useState([]);

    const pickDocument = async () => {
        try {
            let result = await DocumentPicker.getDocumentAsync({
                type: '*/*', // Allow all types of documents
            });

            if (!result.cancelled) {
                setDocuments([...documents, result]);
                console.log("Documents:", documents);
            }
        } catch (error) {
            console.error("Error picking documents:", error);
            Alert.alert(
                "Error",
                "There was an error picking documents. Please try again.",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
            );
        }
    };

    useEffect(() => {
        // If an image is selected, start the fade-out animation
        if (pictures.length > 0) {
            Animated.timing(fadeAnimation, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    }, [pictures, fadeAnimation]);

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All, //All, Image, Videos
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

    //to get user identity
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

    // Data add
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [sex, setSex] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [educ, setEduc] = useState("");
    const [pictures, setPictures] = useState("");
    const [position, setPosition] = useState("");

    // upload media files
    const uploadMedia = async () => {
        setLoadingModalVisible(true);
        setUploading(true);

        try {
            // Validate required fields
            const requiredFields = [name, age, sex, address, phoneNum, educ, position];
            if (requiredFields.some((field) => !field)) {
                Alert.alert("Incomplete Form", "Please fill in all required fields.");
                return;
            }
            // Validate name
            if (!/^[a-zA-Z.\s]+$/.test(name)) {
                Alert.alert("Invalid Name", "Name should only contain letters, dots, and spaces.");
                return;
            }

            // Validate phone number
            if (!/^\d{11}$/.test(phoneNum)) {
                Alert.alert("Invalid Phone Number", "Phone number must be exactly 11 digits.");
                return;
            }

            // Check if image or document is provided
            if (!image && documents.length === 0) {
                Alert.alert("Missing Media", "Please upload an image or document.");
                return;
            }

            const documentUploadPromises = documents.map(async (document, index) => {
                try {
                    const uri = document.assets[0]?.uri;
                    if (!uri) {
                        console.warn(`Document uri is null or undefined for document at index ${index}`);
                        return null; // Return null for invalid document URI
                    }

                    const blob = await createBlob(uri);
                    const filename = document.assets[0]?.name || `document_${index + 1}.pdf`;
                    const documentRef = firebase.storage().ref().child(filename);
                    const documentSnapshot = await documentRef.put(blob);
                    const documentUrl = await documentSnapshot.ref.getDownloadURL();
                    return { url: documentUrl, name: filename }; // Return both URL and name
                } catch (error) {
                    console.error("Error uploading document:", error);
                    throw error;
                }
            });

            const [documentInfos] = await Promise.all([
                Promise.all(documentUploadPromises),
            ]);

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

            const MuniServe = firebase.firestore();
            const job = MuniServe.collection("job");

            await job.add({
                userUid: userUid,
                userName: userName,
                userEmail: userEmail,
                userContact: userContact,
                userBarangay: userBarangay,
                name: name,
                age: age,
                sex: sex,
                address: address,
                phoneNum: phoneNum,
                educ: educ,
                position: position,
                pictures: downloadURL, // Store the download URLs of images
                documents: documentInfos, // Store the download URLs of documents
                status: "Pending", // Set the initial status to "Pending"
                createdAt: timestamp,
                remarks: "",
            });

            setUploading(false);
            setImage(null);
            setDocuments([]);
            resetForm();
            Alert.alert("Success", "Form filled successfully.");
        } catch (error) {
            console.error(error);
            setUploading(false);
            Alert.alert("Error", "Form filling failed.");
        } finally {
            setUploading(false);
            setLoadingModalVisible(false);
        }
    };

    // Helper function to create a blob from a file URI
    const createBlob = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob;
    };
    
    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)));
        return Math.round((bytes / Math.pow(k, i))) + ' ' + sizes[i];
    };

    const resetForm = () => {
        setName("");
        setAge("");
        setSex("");
        setAddress("");
        setPhoneNum("");
        setEduc("");
        setPosition("");
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
                        <Text style={styles.itemService_name}>Job Application</Text>
                    </View>
                </View>
                <View style={styles.innerContainer}>
                    <Text style={styles.itemService_desc}>
                        A job application is a form employers use to collection information
                        about you to see if you are a good fit for the position.
                    </Text>
                </View>

                <Text style={styles.noteText}>
                    Please be ready to supply the following information. Fill the form
                    below:
                </Text>
                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>Complete name</Text>

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
                    <Text style={styles.label}>Age</Text>

                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={2}
                            value={age}
                            keyboardType="number-pad"
                            onChangeText={(age) => setAge(age)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>Sex</Text>

                    <View style={styles.placeholder}>
                        <Picker
                            selectedValue={sex}
                            onValueChange={(itemValue, itemIndex) =>
                                setSex(itemValue)
                            }
                            style={{ width: "100%" }}
                        >
                            <Picker.Item label="Select" value="" />
                            <Picker.Item label="Female" value="Female" />
                            <Picker.Item label="Male" value="Male" />
                        </Picker>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>Address</Text>

                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={100}
                            value={address}
                            onChangeText={(address) => setAddress(address)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>Phone Number</Text>

                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={11}
                            value={phoneNum}
                            keyboardType="number-pad"
                            onChangeText={(phoneNum) => setPhoneNum(phoneNum)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>Educational Attainment</Text>

                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            value={educ}
                            onChangeText={(educ) => setEduc(educ)}
                            maxLength={100}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>Position</Text>

                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={100}
                            value={position}
                            onChangeText={(position) => setPosition(position)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>Resume</Text>

                    <View style={styles.selectButton}>
                        <Text style={styles.buttonText}>Upload Documents</Text>
                        <TouchableOpacity onPress={pickDocument}>
                            {documents.length > 0 ? (
                                <View style={styles.checkCircle}>
                                    <Ionicons name="ios-checkmark" size={24} color="white" />
                                </View>
                            ) : (
                                <Animatable.View
                                    style={{
                                        ...styles.plusCircle,
                                        opacity: fadeAnimation,
                                    }}
                                >
                                    <Ionicons name="ios-add" size={24} color="white" />
                                </Animatable.View>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Display selected documents */}
                    <View style={styles.documentContainer}>
                        {documents.map((document, index) => (
                            <View key={index} style={styles.documentItem}>
                                <Ionicons name="ios-document" size={50} color="black" />
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={styles.documentName}>
                                        {document.assets?.[0]?.name || "Unknown Name"}
                                    </Text>
                                    <Text style={styles.documentSize}>
                                        {formatBytes(document.assets?.[0]?.size) || "Unknown Size"}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                <Text style={styles.noteText}>
                    Note: Upload first the needed requirements before submitting your
                    application. Lack of needed information will cause delay or rejection.
                </Text>

                <View style={styles.selectButton}>
                    <Text style={styles.buttonText}>Formal 2x2 Pictures</Text>
                    <TouchableOpacity onPress={pickImage}>
                        {pictures.length > 0 ? (
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
                        {pictures.length > 0 && (
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
                            style={{ width: 200, height: 200 }}
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
        marginBottom: 15,
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
        marginBottom: 20,
    },
    imageContainer: {
        alignItems: "center",
    },
    documentContainer: {
        marginTop: 10,
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
    regText: {
        fontSize: 25,
        textAlign: "center",
    },
    noteText: {
        fontSize: 15,
        textAlign: "justify",
        marginTop: 5,
        marginBottom: 10,
        fontWeight: "400",
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
        width: 165,
        marginTop: 30,
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
        flexDirection: "row",
        padding: 10,
    },
    buttonText: {
        flex: 1, // Take up available space
        color: "#000",
        fontSize: 14,
        fontWeight: "light",
        textAlign: "left",
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
    datePickerStyle: {
        width: "100%",
        borderColor: "black",
        borderRadius: 8,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
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
        marginTop: 30,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    documentName: {
        color: "#000"
    }
});
