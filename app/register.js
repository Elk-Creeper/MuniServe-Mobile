import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    StatusBar,
    Image,
} from "react-native";
import React, { useState } from "react";
import { firebase } from "../config";
import { Link, useRouter } from "expo-router";

const Registration = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [barangay, setBarangay] = useState("");
    const [contact, setContact] = useState("");
    const router = useRouter();


    registerUser = async (email, password, firstName, lastName, barangay) => {
        await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                firebase
                    .auth()
                    .currentUser.sendEmailVerification({
                        handleCodeInApp: true,
                        url: "https://muniserve-4dc11.firebaseapp.com",
                    })
                    .then(() => {
                        alert("Verification email sent");
                    })
                    .catch((error) => {
                        alert(error.message);
                    })
                    .then(() => {
                        firebase
                            .firestore()
                            .collection("users")
                            .doc(firebase.auth().currentUser.uid)
                            .set({
                                firstName,
                                lastName,
                                barangay,
                                email,
                                contact,
                            });
                    })
                    .catch((error) => {
                        alert(error.message);
                    });
            })
            .catch((error) => {
                alert(error.message);
            });
    };

    return (
        <View style={styles.container1}>
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
            </View>

        <View style={styles.container2}>
            <Text style={styles.regText}>Let's Sign you Up!</Text>
            <Text style={styles.text}>To sign up, please enter the following.</Text>
            <View style={{ marginTop: 30 }}>
                <TextInput
                    style={styles.textInput}
                    placeholder="First Name"
                    onChangeText={(firstName) => setFirstName(firstName)}
                    autoCorrect={false}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Last Name"
                    onChangeText={(lastName) => setLastName(lastName)}
                    autoCorrect={false}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Barangay"
                    onChangeText={(barangay) => setBarangay(barangay)}
                    autoCorrect={false}
                />
                <TextInput
                        style={styles.textInput}
                        placeholder="Mobile Number"
                        onChangeText={(contact) => setContact(contact)}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="number-pad"
                        maxLength={11}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Email"
                    onChangeText={(email) => setEmail(email)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Password"
                    onChangeText={(password) => setPassword(password)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                />
            </View>
            <TouchableOpacity
                onPress={() => registerUser(email, password, firstName, lastName, barangay)}
                style={styles.button}
            >
                <Text style={{ fontWeight: "500", fontSize: 20, color: "white" }}>
                    Register
                </Text>
            </TouchableOpacity>

            <View style={styles.texts}>
                <Text
                    style={{
                        fontWeight: "500",
                        fontSize: 16,
                        textAlign: "center",
                        marginTop: 20,
                    }}
                >
                    Already have an account?
                </Text>
                <TouchableOpacity onPress={() => {
                    router.push("/login");
                }}>
                    <View style={styles.box}>
                        <Text style={styles.itemService_name}>  Login Now</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
        </View>
    );
};

export default Registration;

const styles = StyleSheet.create({
    container1: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 20,
        backgroundColor: "#FFFFFF",
        flexGrow: 1,
    },
    container2: {
        flex: 1,
        alignItems: "left",
        backgroundColor: "white",
        padding: 15,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
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
    textInput: {
        paddingTop: 10,
        paddingBottom: 15,
        width: "100%",
        fontSize: 16,
        borderColor: "#307A59",
        borderWidth: 1.5,
        borderRadius: 10,
        marginBottom: 10,
        textAlign: "left",
        paddingHorizontal: 15,
        height: 50
    },
    button: {
        marginTop: 55,
        height: 50,
        width: "100%",
        backgroundColor: "#307A59",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    regText: {
        fontSize: 30,
        textAlign: "left",
        fontWeight: "700",
    },
    text: {
        marginTop: 10,
        fontSize: 16,
    },
    texts: {
        flexDirection: "row",
        justifyContent: 'center',
    },
    itemService_name: {
        color: "#0174BE",
        marginTop: 20,
        fontWeight: '500',
        fontSize: 16,
    },
});