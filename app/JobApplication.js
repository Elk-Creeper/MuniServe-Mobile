import React, { useState, useEffect, useRef } from "react";
import {
    Pressable,
    Modal,
    FlatList,
    View,
    TextInput,
    Text,
    StyleSheet,
    Animated,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Platform,
    SafeAreaView,
    Button,
    Alert,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { firebase } from "../config";
import * as FileSystem from "expo-file-system";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Animatable from "react-native-animatable";
import * as MediaLibrary from "expo-media-library";


export default function BirthReg() {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const [selectedDateText, setSelectedDateText] = useState("");
    const fadeAnimation = useRef(new Animated.Value(1)).current;
    const [loadingModalVisible, setLoadingModalVisible] = useState(false);

    // for downloading the docx
    const [mediaData, setMediaData] = useState([]);

    useEffect(() => {
        async function getMediaData() {
            const mediaRefs = [firebase.storage().ref("RESUME.docx")];

            const mediaInfo = await Promise.all(
                mediaRefs.map(async (ref) => {
                    const url = await ref.getDownloadURL();
                    const metadata = await ref.getMetadata();
                    return { url, metadata };
                })
            );
            setMediaData(mediaInfo);
        }

        getMediaData();
    }, []);

    async function downloadFile(url, filename, isVideo) {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== "granted") {
                Alert.alert(
                    "Permission needed",
                    "This app needs access to your Media library to download files."
                );
                return;
            }

            const fileUri = FileSystem.cacheDirectory + filename;
            console.log("Starting download..!");
            const downloadResumable = FileSystem.createDownloadResumable(
                url,
                fileUri,
                {},
                false
            );
            const { uri } = await downloadResumable.downloadAsync(null, {
                shouldCache: false,
            });
            console.log("Download completed: ", uri);

            if (isVideo) {
                const { uri: thumbnailUri } = await VideoThumbnails.getThumbnailAsync(
                    uri,
                    { time: 1000 }
                );
                console.log("Thumbnail created:", thumbnailUri);
            }

            const asset = await MediaLibrary.createAssetAsync(uri);
            console.log("asset created:", asset);

            Alert.alert("Download successful", `File saved to: ${fileUri}`);
        } catch (error) {
            console.error("Error during download:", error);
            Alert.alert(
                "Download failed",
                "There was an error while downloading the file."
            );
        }
    }

    // docx design
    const CustomButton = ({ title, onPress }) => (
        <TouchableOpacity
            style={{
                backgroundColor: "#307A59",
                height: 50,
                width: '100%',
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
            }}
            onPress={onPress}
        >
            <Text style={{ color: "white" }}>{title}</Text>
        </TouchableOpacity>
    );

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

    // upload media files
    const uploadMedia = async () => {
        setLoadingModalVisible(true);
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
            const job = MuniServe.collection("job");

            await job.add({
                name: name,
                age: age,
                sex: sex,
                address: address,
                phoneNum: phoneNum,
                educ: educ,
                pictures: downloadURL, // Store the download URL here
                status: "Pending", // Set the initial status to "Pending"
                createdAt: timestamp,
            });

            setUploading(false);
            setImage(null);
            resetForm();
            Alert.alert("Success", "Form filled successfully.");
        } catch (error) {
            console.error(error);
            setUploading(false);
            Alert.alert("Error", "Form filling failed.");
        } finally {
            setUploading(false);
            setLoadingModalVisible(false); // Hide loading modal
        }
    };

    // Data add
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [sex, setSex] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [educ, setEduc] = useState("");
    const [pictures, setPictures] = useState("");

    const resetForm = () => {
        setName("");
        setAge("");
        setSex("");
        setAddress("");
        setPhoneNum("");
        setEduc("");
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
        setShowDatePicker(Platform.OS === "ios"); // Close the date picker on iOS
        setDate(currentDate); // Update the state with the selected date
        setSelectedDateText(formatDate(currentDate)); // Format and set the selected date text
    };

    const formatDate = (date) => {
        // Format the date as needed (you can customize this based on your requirements)
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1
            }/${date.getFullYear()}`;
        return formattedDate;
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
                <TouchableOpacity>
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
                            maxLength={50}
                            value={age}
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
                        <TextInput
                            placeholder=""
                            maxLength={6}
                            value={sex}
                            onChangeText={(sex) => setSex(sex)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
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
                    <Text style={styles.label}>Phone number</Text>

                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={11}
                            value={phoneNum}
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

                <Text style={styles.noteText}>
                    Note: Upload first the needed requirements before submitting your
                    application. Lack of needed information will cause delay or rejection.
                </Text>

                {mediaData.map((media, index) => {
                    const { url, metadata } = media;
                    const { name, contentType } = metadata;
                    const isVideo = contentType.includes("video");
                    const isImage = contentType.includes("image");
                    return (
                        <View key={index} style={styles.imageContainer}>
                            <CustomButton
                                title={`${name}`}
                                onPress={() => downloadFile(url, name, isVideo)}
                            />
                        </View>
                    );
                })}

                <View style={styles.selectButton}>
                    <Text style={styles.buttonText}>2x2 Pictures</Text>
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
        marginBottom: 20,
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
        marginTop: 50,
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
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
});
