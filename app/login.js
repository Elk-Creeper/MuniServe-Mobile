import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    StatusBar,
    ActivityIndicator
} from "react-native";
import { firebase } from "../config";
import { useRouter } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [initialAuthCheckComplete, setInitialAuthCheckComplete] = useState(false);
    const router = useRouter();
    const [loadingModalVisible, setLoadingModalVisible] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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
        setLoadingModalVisible(true);
        setUploading(true);

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

            setUploading(false);
        } catch (error) {
            setUploading(false);
            console.error("loginUser error", error);
            alert(error.message);
        } finally {
            setUploading(false);
            setLoadingModalVisible(false); // Hide loading modal
        }
    };

    const forgotPassword = async () => {
        try {
            await firebase.auth().sendPasswordResetEmail(email);
            alert("Password reset email sent. Check your email inbox.");
        } catch (error) {
            console.error("forgotPassword error", error);
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
                <Text style={styles.regText}>Welcome back!</Text>
                <View style={{ marginTop: 100 }}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Email"
                        onChangeText={(email) => setEmail(email)}
                        autoCapitalize="none"
                        autoCorrect={false}
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
                    onPress={() => loginUser(email, password)}
                    style={styles.button}
                >
                    <Text style={{ fontWeight: "600", fontSize: 23, color: "white" }}>
                        Login
                    </Text>
                </TouchableOpacity>

                {/* "Forgot Password" functionality */}
                <TouchableOpacity onPress={forgotPassword}>
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>

                <View style={styles.texts}>
                    <Text
                        style={{
                            fontWeight: "500",
                            fontSize: 16,
                            textAlign: "center",
                            marginTop: 20,
                        }}
                    >Create New Account?
                    </Text>
                    <TouchableOpacity onPress={() => {
                        router.push("/register");
                    }}>
                        <View style={styles.box}>
                            <Text style={styles.itemService_name}> Register Now</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            {uploading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#307A59" />
                </View>
            )}
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
        fontSize: 25,
    },
    greenText: {
        color: "green",
        fontWeight: "bold",
        fontSize: 25,
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
        marginTop: 180,
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
    forgotPassword: {
        fontWeight: "500",
        fontSize: 16,
        textAlign: "center",
        marginTop: 10,
        color: "#0174BE",
        textDecorationLine: "underline",
    },
    con: {
        flexDirection: 'row',
    },
    eyeIcon: {
        padding: 10,
        marginLeft: 235,
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
