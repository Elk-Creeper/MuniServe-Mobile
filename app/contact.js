import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert, // Import Alert
} from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { firebase } from '../config';

const Contact = () => {
    const [c_sub, setAddSubject] = useState("");
    const [c_mess, setAddMessage] = useState("");
    const [charCount, setCharCount] = useState(200); // Initial character count

    const resetForm = () => {
        setAddSubject("");
        setAddMessage("");
        setCharCount(200); // Reset character count
    };

    const updateCharCount = (text) => {
        const usedChars = text.length;
        setCharCount(usedChars);
    };

    const contactForm = async () => {
        try {
            const MuniServe = getFirestore(app);
            const contact = collection(MuniServe, "contact");

            await addDoc(contact, {
                c_sub: c_sub,
                c_mess: c_mess,
            });

            // Data is stored in Firestore
            resetForm(); // Reset the form after successful booking
            Alert.alert("Success", "Form filled successfully.");
        } catch (error) {
            console.error("Error storing form data:", error);
            Alert.alert("Error", "Form filling failed.");
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor="#93C49E" // Change the background color as needed
            />

            <View style={styles.header}>
                <Text style={styles.aboutText}>Contact Us</Text>
            </View>

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
    header: {
        marginTop: 10,
        backgroundColor: "#307A59",
        borderRadius: 10,
    },
    aboutText: {
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
        marginTop: 200,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
    },
});