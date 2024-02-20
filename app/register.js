import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    StatusBar,
    Alert,
    ScrollView,
    ActivityIndicator
} from "react-native";
import React, { useState } from "react";
import { firebase } from "../config";
import { Link, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from '@expo/vector-icons';

const Registration = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [barangay, setBarangay] = useState("");
    const [contact, setContact] = useState("");
    const router = useRouter();
    const [loadingModalVisible, setLoadingModalVisible] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [otherBarangay, setOtherBarangay] = useState("");
    const [selectedBarangay, setSelectedBarangay] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    function isInputValid(input) {
        // Allow letters, dots, and spaces in the input
        const regex = /^[a-zA-Z.\s]+$/;
        return regex.test(input);
    }

    const registerUser = async () => {
        setLoadingModalVisible(true);
        setUploading(true);

        try {
            // Validation checks
            if (!firstName.trim() || !isInputValid(firstName)) {
                Alert.alert("Invalid First Name", "Please enter a valid first name with only letters, dots, and spaces.");
                return;
            }

            if (!lastName.trim() || !isInputValid(lastName)) {
                Alert.alert("Invalid Last Name", "Please enter a valid last name with only letters, dots, and spaces.");
                return;
            }

            if (!contact || !contact.trim() || !/^09\d{9}$/.test(contact.trim())) {
                Alert.alert("Invalid Contact", "Please enter a valid contact number starting with '09' and consisting of 11 numbers.");
                return;
            }

            if (!selectedBarangay || (selectedBarangay === "From Other Town" && otherBarangay.trim() === "")) {
                Alert.alert("Invalid Barangay", "Please enter/select a valid barangay.");
                return;
            }

            // Create user with email and password
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);

            // Send email verification
            await firebase.auth().currentUser.sendEmailVerification({
                handleCodeInApp: true,
                url: "https://muniserve-4dc11.firebaseapp.com",
            });

            // Set the correct value for barangay based on selection
            const userBarangay = selectedBarangay === "From Other Town" ? otherBarangay : selectedBarangay;

            // Update Firestore with user information
            const userDocRef = firebase.firestore().collection("users").doc(userCredential.user.uid);
            const userData = {
                firstName,
                lastName,
                email,
                contact,
                barangay: userBarangay,
            };

            await userDocRef.set(userData);

            setUploading(false);
            resetForm();
            alert("Successfully Registered", "Please Verify Your Email.");
            // Proceed to the login page
            router.push("/login");
        } catch (error) {
            setUploading(false);
            alert(error.message);
        } finally {
            setUploading(false);
            setLoadingModalVisible(false); // Hide loading modal
        }
    };

    const resetForm = () => {
        setEmail("");
        setFirstName("");
        setLastName("");
        setContact("");
        setBarangay("");
        setEmail("");
        setPassword("");
    };

    return (
        <View style={styles.container1}>
            <StatusBar backgroundColor="#93C49E" />
            <View style={styles.header}>
                <Text style={styles.titleText}>
                    <Text style={styles.blackText}>MUNI</Text>
                    <Text style={styles.greenText}>SERVE</Text>
                </Text>
            </View>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
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
                            placeholder="Mobile Number"
                            onChangeText={(contact) => setContact(contact)}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="number-pad"
                            maxLength={11}
                        />
                        <View style={styles.placeholder}>
                            <Picker
                                selectedValue={selectedBarangay}
                                onValueChange={(itemValue, itemIndex) => setSelectedBarangay(itemValue)}
                                style={{ width: "100%" }}
                            >
                                <Picker.Item label="Select Your Address" value="" />
                                <Picker.Item label="From Other Town" value="From Other Town" />
                                <Picker.Item label="Bagong Silang, Del Gallego" value="Bagong Silang, Del Gallego" />
                                <Picker.Item label="Bucal, Del Gallego" value="Bucal, Del Gallego" />
                                <Picker.Item label="Cabasag, Del Gallego" value="Cabasag, Del Gallego" />
                                <Picker.Item label="Comadaycaday, Del Gallego" value="Comadaycaday, Del Gallego" />
                                <Picker.Item label="Comadogcadog, Del Gallego" value="Comadogcadog, Del Gallego" />
                                <Picker.Item label="Domagondong, Del Gallego" value="Domagondong, Del Gallego" />
                                <Picker.Item label="Kinalangan, Del Gallego" value="Kinalangan, Del Gallego" />
                                <Picker.Item label="Mabini, Del Gallego" value="Mabini, Del Gallego" />
                                <Picker.Item label="Magais 1, Del Gallego" value="Magais 1, Del Gallego" />
                                <Picker.Item label="Magais 2, Del Gallego" value="Magais 2, Del Gallego" />
                                <Picker.Item label="Mansalaya, Del Gallego" value="Mansalaya, Del Gallego" />
                                <Picker.Item label="Nagkalit, Del Gallego" value="Nagkalit, Del Gallego" />
                                <Picker.Item label="Palaspas, Del Gallego" value="Palaspas, Del Gallego" />
                                <Picker.Item label="Pamplona, Del Gallego" value="Pamplona, Del Gallego" />
                                <Picker.Item label="Pasay, Del Gallego" value="Pasay, Del Gallego" />
                                <Picker.Item label="Peñafrancia, Del Gallego" value="Peñafrancia, Del Gallego" />
                                <Picker.Item label="Pinagdapian, Del Gallego" value="Pinagdapian, Del Gallego" />
                                <Picker.Item label="Pinugusan, Del Gallego" value="Pinugusan, Del Gallego" />
                                <Picker.Item label="Poblacion Zone 1, Del Gallego" value="Poblacion Zone 1, Del Gallego" />
                                <Picker.Item label="Poblacion Zone 2, Del Gallego" value="Poblacion Zone 2, Del Gallego" />
                                <Picker.Item label="Poblacion Zone 3, Del Gallego" value="Poblacion Zone 3, Del Gallego" />
                                <Picker.Item label="Sabang, Del Gallego" value="Sabang, Del Gallego" />
                                <Picker.Item label="Salvacion, Del Gallego" value="Salvacion, Del Gallego" />
                                <Picker.Item label="San Juan, Del Gallego" value="San Juan, Del Gallego" />
                                <Picker.Item label="San Pablo, Del Gallego" value="San Pablo, Del Gallego" />
                                <Picker.Item label="Santa Rita 1, Del Gallego" value="Santa Rita 1, Del Gallego" />
                                <Picker.Item label="Santa Rita 2, Del Gallego" value="Santa Rita 2, Del Gallego" />
                                <Picker.Item label="Sinuknipan 1, Del Gallego" value="Sinuknipan 1, Del Gallego" />
                                <Picker.Item label="Sinuknipan 2, Del Gallego" value="Sinuknipan 2, Del Gallego" />
                                <Picker.Item label="Sugsugin, Del Gallego" value="Sugsugin, Del Gallego" />
                                <Picker.Item label="Tabion, Del Gallego" value="Tabion, Del Gallego" />
                                <Picker.Item label="Tomagoktok, Del Gallego" value="Tomagoktok, Del Gallego" />
                            </Picker>
                        </View>

                        {selectedBarangay === "From Other Town" && (
                            <TextInput
                                style={styles.textInput}
                                placeholder="Complete Address"
                                onChangeText={(otherBarangay) => setOtherBarangay(otherBarangay)}
                                autoCorrect={false}
                            />
                        )}

                        <TextInput
                            style={styles.textInput}
                            placeholder="Email"
                            onChangeText={(email) => setEmail(email)}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                        />
                        <View style={styles.con}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Password"
                                onChangeText={(password) => setPassword(password)}
                                autoCapitalize="none"
                                autoCorrect={false}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility}>
                                <MaterialIcons
                                    name={showPassword ? 'visibility' : 'visibility-off'}
                                    size={22}
                                    color="black"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => registerUser(email, password, firstName, lastName, barangay, contact)}
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
            </ScrollView>
            {uploading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#307A59" />
                </View>
            )}
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
        justifyContent: "center",
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
        letterSpacing: 3,
        justifyContent: "center",
        alignItems: "center",
        alignContent: 'center',
        textAlign: 'center',
        marginTop: 10,
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
    button: {
        marginTop: 40,
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
        marginTop: 15,
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
    placeholder: {
        width: "100%",
        height: 50,
        borderColor: "#307A59",
        borderRadius: 8,
        borderWidth: 1.5,
        alignItems: "left",
        justifyContent: "center",
        textAlign: "justify",
        paddingLeft: 10,
        marginBottom: 10,
    },
    con: {
        flexDirection: 'row',
    },
    eyeIcon: {
        padding: 10,
        marginLeft: 240,
        marginTop: 5,
        position: 'absolute'
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
});