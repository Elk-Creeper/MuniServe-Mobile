import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { firebase, app } from "../config"; // Make sure to import the 'app' variable

const Contact = () => {
    const [c_sub, setAddSubject] = useState("");
    const [c_mess, setAddMessage] = useState("");
    const [charCount, setCharCount] = useState(200); // Initial character count
    const [loadingModalVisible, setLoadingModalVisible] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [userUid, setUserUid] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userBarangay, setUserBarangay] = useState(null);
    const [userContact, setUserContact] = useState(null);

    const resetForm = () => {
        setAddSubject("");
        setAddMessage("");
        setCharCount(200); // Reset character count
    };

    const updateCharCount = (text) => {
        const usedChars = text.length;
        setCharCount(usedChars);
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

    const contactForm = async () => {
        setLoadingModalVisible(true);
        setUploading(true);

        try {
            // Validation checks
            if (!c_sub || !c_mess) {
                Alert.alert("Incomplete Form", "Please fill in all required fields.");
                return;
            }

            const MuniServe = getFirestore(app);
            const contact = collection(MuniServe, "contact");

            await addDoc(contact, {
                c_sub: c_sub,
                c_mess: c_mess,
                userUid: userUid,
                userName: userName,
                userEmail: userEmail,
                userContact: userContact,
                userBarangay: userBarangay,
            });

            // Data is stored in 
            setUploading(false);
            resetForm(); // Reset the form after successful booking
            Alert.alert("Success", "Form filled successfully.");
        } catch (error) {
            setUploading(false);
            console.error("Error storing form data:", error);
            Alert.alert("Error", "Form filling failed.");
        } finally {
            setUploading(false);
            setLoadingModalVisible(false); // Hide loading modal
        } 
    };

    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor="#93C49E" // Change the background color as needed
            />
            
            <Text style={styles.aboutText}>Contact Us</Text>

            <Text style={styles.text}>How can we help?</Text>

            <View style={{ marginBottom: 10 }}>
                <View
                    style={{
                        width: "100%",
                        height: 48,
                        borderColor: "black",
                        borderRadius: 8,
                        borderWidth: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 10,
                    }}
                >
                    <TextInput
                        placeholder="Subject"
                        maxLength={50}
                        value={c_sub}
                        onChangeText={(text) => setAddSubject(text)}
                        style={{
                            width: "100%",
                        }}
                    ></TextInput>
                </View>
            </View>

            <View style={{ marginBottom: 10 }}>
                <View
                    style={{
                        width: "100%",
                        height: 150,
                        borderColor: "black",
                        borderRadius: 8,
                        borderWidth: 1,
                        alignItems: "center",
                        paddingLeft: 10,
                        paddingTop: 5,
                    }}
                >
                    <TextInput
                        placeholder="Message"
                        maxLength={200}
                        multiline={true}
                        value={c_mess}
                        onChangeText={(text) => {
                            setAddMessage(text);
                            updateCharCount(text);
                        }}
                        style={{
                            width: "100%",
                        }}
                    ></TextInput>
                </View>
                <Text style={{ textAlign: "right", marginTop: 5, color: "grey" }}>
                    {charCount}/200
                </Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={contactForm}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            {uploading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#307A59" />
                </View>
            )}
        </View>
    );
};

export default Contact;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "left",
        backgroundColor: "white",
        padding: 35,
    },
    aboutText: {
        fontSize: 25,
        textAlign: "center",
        marginBottom: 50,
        fontWeight: "700",
    },
    text: {
        fontSize: 21,
        marginTop: 30,
        fontWeight: "600",
        marginBottom: 15,
    },
    itemPara: {
        textAlign: "justify",
        fontSize: 16,
        fontWeight: "300",
        lineHeight: 25,
        marginTop: 5,
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: "hidden",
        backgroundColor: "white",
        paddingLeft: 16,
        flex: 1,
        marginRight: 5,
    },
    button: {
        height: 47,
        borderRadius: 10,
        backgroundColor: "#307A59",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 180,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "500"
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
});