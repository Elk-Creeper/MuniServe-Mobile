import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    StatusBar,
    Image,
} from "react-native";
import { firebase } from "../config";
import { useRouter } from "expo-router";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [initialAuthCheckComplete, setInitialAuthCheckComplete] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            console.log("onAuthStateChanged", user);

            if (!initialAuthCheckComplete) {
                setInitialAuthCheckComplete(true);
                return;
            }

            if (user) {
                // Check if the login action triggered the listener
                if (user.metadata.creationTime === user.metadata.lastSignInTime) {
                    // This is the first sign-in after registration, do nothing
                    return;
                }
                // Check if user is verified before navigating to the home page
                if (user.emailVerified) {
                    // User is verified, handle login
                    handleLogin(user);
                } else {
                    // User is not verified, handle verification
                    alert("Please verify your email before logging in.");
                }
            }
        });

        return () => unsubscribe();
    }, [initialAuthCheckComplete]);

    const handleLogin = (user) => {
        console.log("handleLogin", user);
        router.replace("/dashboard/(tabs)/Home");
    };

    const loginUser = async () => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);

            const user = firebase.auth().currentUser;

            console.log("loginUser", user);

            if (user) {
                if (user.emailVerified) {
                    // User is verified, handle login
                    handleLogin(user);
                } else {
                    alert("Please verify your email before logging in.");
                    // Optionally, you can also resend the verification email here
                }
            }
        } catch (error) {
            console.error("loginUser error", error);
            alert(error.message);
        }
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
                <Text style={styles.regText}>Welcome back!</Text>
                <View style={{ marginTop: 100 }}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Email"
                        onChangeText={(email) => setEmail(email)}
                        autoCapitalize="none"
                        autoCorrect={false}
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
                    onPress={() => loginUser(email, password)}
                    style={styles.button}
                >
                    <Text style={{ fontWeight: "600", fontSize: 23, color: "white" }}>
                        Login
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
                    >Don't have an account?
                    </Text>
                    <TouchableOpacity onPress={() => {
                        router.push("/register");
                    }}>
                        <View style={styles.box}>
                            <Text style={styles.itemService_name}>  Register Now</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default Login;

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
        padding: 20,
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
    },
    button: {
        marginTop: 210,
        height: 60,
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
