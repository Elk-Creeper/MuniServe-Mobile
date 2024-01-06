import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    StatusBar,
    Image,
    Alert,
} from "react-native";
import React, { useState } from "react";
import { firebase } from "../config";
import { Link, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";

const Registration = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [barangay, setBarangay] = useState("");
    const [contact, setContact] = useState("");
    const router = useRouter();

    const isInputValid = (input) => /^[a-zA-Z\s]+$/.test(input);

    const registerUser = async () => {
        try {
            if (!firstName.trim()) {
                Alert.alert("Invalid First Name", "Please enter a valid first name.");
                return;
            }

            if (!lastName.trim()) {
                Alert.alert("Invalid Last Name", "Please enter a valid last name.");
                return;
            }

            if (!isInputValid(firstName)) {
                Alert.alert("Invalid First Name", "Please enter a valid first name with only letters.");
                return;
            }

            if (!isInputValid(lastName)) {
                Alert.alert("Invalid Last Name", "Please enter a valid last name with only letters.");
                return;
            }
            if (!contact || !contact.trim() || !/^\d{11}$/.test(contact.trim())) {
                Alert.alert("Invalid Contact", "Please enter a valid 11-digit contact number with only numbers.");
                return;
            }
            if (!barangay) {
                Alert.alert("Invalid Barangay", "Please select a valid barangay.");
                return;
            }
            await firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(async () => {
                    await firebase
                        .auth()
                        .currentUser.sendEmailVerification({
                            handleCodeInApp: true,
                            url: "https://muniserve-4dc11.firebaseapp.com",
                        });

                    await firebase
                        .firestore()
                        .collection("users")
                        .doc(firebase.auth().currentUser.uid)
                        .set({
                            firstName,
                            lastName,
                            barangay,
                            email,
                            contact,
                            password,
                        });

                    alert("Successfully Registered, Please Verify Your Email.");
                    // Proceed to the login page
                    router.push("/login");
                })
                .catch((error) => {
                    alert(error.message);
                });
        } catch (error) {
            alert(error.message);
        }
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
                            selectedValue={barangay}
                            onValueChange={(itemValue, itemIndex) =>
                                setBarangay(itemValue)
                            }
                            style={{ width: "100%" }}
                        >
                            <Picker.Item label="Barangay" value="" />
                            <Picker.Item label="Bagong Silang" value="Bagong Silang" />
                            <Picker.Item label="Bucal" value="Bucal" />
                            <Picker.Item label="Cabasag" value="Cabasag" />
                            <Picker.Item label="Comadaycaday" value="Comadaycaday" />
                            <Picker.Item label="Comadogcadog" value="Comadogcadog" />
                            <Picker.Item label="Domagondong" value="Domagondong" />
                            <Picker.Item label="Kinalangan" value="Kinalangan" />
                            <Picker.Item label="Mabini" value="Mabini" />
                            <Picker.Item label="Magais 1" value="Magais 1" />
                            <Picker.Item label="Magais 2" value="Magais 2" />
                            <Picker.Item label="Mansalaya" value="Mansalaya" />
                            <Picker.Item label="Nagkalit" value="Nagkalit" />
                            <Picker.Item label="Palaspas" value="Palaspas" />
                            <Picker.Item label="Pamplona" value="Pamplona" />
                            <Picker.Item label="Pasay" value="Pasay" />
                            <Picker.Item label="Peñafrancia" value="Peñafrancia" />
                            <Picker.Item label="Pinagdapian" value="Pinagdapian" />
                            <Picker.Item label="Pinugusan" value="Pinugusan" />
                            <Picker.Item label="Poblacion Zone 1" value="Poblacion Zone 1" />
                            <Picker.Item label="Poblacion Zone 2" value="Poblacion Zone 2" />
                            <Picker.Item label="Poblacion Zone 3" value="Poblacion Zone 3" />
                            <Picker.Item label="Sabang" value="Sabang" />
                            <Picker.Item label="Salvacion" value="Salvacion" />
                            <Picker.Item label="San Juan" value="San Juan" />
                            <Picker.Item label="San Pablo" value="San Pablo" />
                            <Picker.Item label="Santa Rita 1" value="Santa Rita 1" />
                            <Picker.Item label="Santa Rita 2" value="Santa Rita 2" />
                            <Picker.Item label="Sinuknipan 1" value="Sinuknipan 1" />
                            <Picker.Item label="Sinuknipan 2" value="Sinuknipan 2" />
                            <Picker.Item label="Sugsugin" value="Sugsugin" />
                            <Picker.Item label="Tabion" value="Tabion" />
                            <Picker.Item label="Tomagoktok" value="Tomagoktok" />
                        </Picker>
                    </View>

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
});