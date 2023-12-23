import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Modal,
    Animated,
    ScrollView,
    FlatList,
    Pressable,
    Alert,
    TextInput,
    ActivityIndicator,
    Button
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { firebase } from "../config";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as VideoThumbnails from "expo-video-thumbnails";
import { Video } from "expo-av";

export default function Tab4() {
    const [barangayClearance1, setBarangayClearance1] = useState([]);
    const [appForm1, setAppForm1] = useState([]);
    const [dti, setDti] = useState([]);
    const [sec, setSec] = useState([]);
    const [lessor, setLessor] = useState([]);
    const [tax, setTax] = useState([]);
    const [publicLiability, setPublicLiability] = useState([]);
    const [appForm2, setAppForm2] = useState([]);
    const [barangayClearance2, setBarangayClearance2] = useState([]);
    const [xerox, setXerox] = useState([]);
    const [audited, setAudited] = useState([]);
    const [publicLiability2, setPublicLiability2] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loadingModalVisible, setLoadingModalVisible] = useState(false); 

    // for storing user info
    const [userUid, setUserUid] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userBarangay, setUserBarangay] = useState(null);
    const [userContact, setUserContact] = useState(null);

    const [selectedApplicationType, setSelectedApplicationType] = useState(null);
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    const fadeAnimation = useRef(new Animated.Value(1)).current;
    const colorAnimation = useRef(new Animated.Value(0)).current;

    // for downloading the docx
    const [mediaData, setMediaData] = useState([]);

    useEffect(() => {
        async function getMediaData() {
            const mediaRefs = [
                firebase.storage().ref("Business Permit Form.docx"),
            ];

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
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 10,
                marginTop: 15,
            }}
            onPress={onPress}
        >
            <Text style={{ color: "white" }}>{title}</Text>
        </TouchableOpacity>
    );


    useEffect(() => {
        // If an image is selected, start the fade-out animation
        if (
            appForm1.length > 0 &&
            barangayClearance1.length > 0 &&
            dti.length > 0 &&
            sec.length > 0 &&
            lessor.length > 0 &&
            tax.length > 0 &&
            publicLiability.length > 0 &&
            appForm2.length > 0 &&
            barangayClearance2.length > 0 &&
            xerox.length > 0 &&
            audited > 0 &&
            publicLiability2.length > 0
        ) {
            Animated.timing(fadeAnimation, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    }, [appForm1, barangayClearance1, dti, sec, lessor, tax, publicLiability, appForm2, barangayClearance2, xerox, audited, publicLiability2, fadeAnimation]);

    const pickImage = async (category) => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: false,
                aspect: [4, 3],
                quality: 1,
                multiple: true, // Allow multiple selection
            });

            if (!result.canceled) {
                // Add selected images to the respective arrays based on category
                if (category === "app form 1") {
                    setAppForm1([
                        ...appForm1,
                        ...result.assets.map((asset) => asset.uri),
                    ]);
                } else if (category === "barangay clearance 1") {
                    setBarangayClearance1([
                        ...barangayClearance1,
                        ...result.assets.map((asset) => asset.uri),
                    ]);
                } else if (category === "dti") {
                    setDti([...dti, ...result.assets.map((asset) => asset.uri)]);
                } else if (category === "sec") {
                    setSec([...sec, ...result.assets.map((asset) => asset.uri)]);
                } else if (category === "lessor") {
                    setLessor([...lessor, ...result.assets.map((asset) => asset.uri)]);
                } else if (category === "tax") {
                    setTax([...tax, ...result.assets.map((asset) => asset.uri)]);
                } else if (category === "public liability") {
                    setPublicLiability([
                        ...publicLiability,
                        ...result.assets.map((asset) => asset.uri),
                    ]);
                } else if (category === "app form 2") {
                    setAppForm2([
                        ...appForm2,
                        ...result.assets.map((asset) => asset.uri),
                    ]);
                } else if (category === "barangay clearance 2") {
                    setBarangayClearance2([
                        ...barangayClearance2,
                        ...result.assets.map((asset) => asset.uri),
                    ]);
                } else if (category === "xerox") {
                    setXerox([
                        ...xerox,
                        ...result.assets.map((asset) => asset.uri),
                    ]);
                } else if (category === "audited") {
                    setAudited([
                        ...audited,
                        ...result.assets.map((asset) => asset.uri),
                    ]);
                } else if (category === "public liability 2") {
                    setPublicLiability2([
                        ...publicLiability2,
                        ...result.assets.map((asset) => asset.uri),
                    ]);
                }
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

    const removeImage = (category, index) => {
        if (category === "app form 1") {
            const newImages = [...appForm1];
            newImages.splice(index, 1);
            setAppForm1(newImages);
        } else if (category === "barangay clearance 1") {
            const newImages = [...barangayClearance1];
            newImages.splice(index, 1);
            setBarangayClearance1(newImages);
        } else if (category === "dti") {
            const newImages = [...dti];
            newImages.splice(index, 1);
            setDti(newImages);
        } else if (category === "sec") {
            const newImages = [...sec];
            newImages.splice(index, 1);
            setSec(newImages);
        } else if (category === "lessor") {
            const newImages = [...lessor];
            newImages.splice(index, 1);
            setLessor(newImages);
        } else if (category === "tax") {
            const newImages = [...tax];
            newImages.splice(index, 1);
            setTax(newImages);
        } else if (category === "public liability") {
            const newImages = [...publicLiability];
            newImages.splice(index, 1);
            setPublicLiability(newImages);
        } else if (category === "app form 2") {
            const newImages = [...appForm2];
            newImages.splice(index, 1);
            setAppForm2(newImages);
        } else if (category === "barangay clearance 2") {
            const newImages = [...barangayClearance2];
            newImages.splice(index, 1);
            setBarangayClearance2(newImages);
        } else if (category === "xerox") {
            const newImages = [...xerox];
            newImages.splice(index, 1);
            setXerox(newImages);
        } else if (category === "audited") {
            const newImages = [...audited];
            newImages.splice(index, 1);
            setAudited(newImages);
        } else if (category === "public liability 2") {
            const newImages = [...publicLiability2];
            newImages.splice(index, 1);
            setPublicLiability2(newImages);
        }
    };

    const uploadMedia = async () => {
        setLoadingModalVisible(true); // Show loading modal
        setUploading(true);

        try {
            const imageURLs = {
                userUid: userUid,
                userName: userName,
                userEmail: userEmail,
                userContact: userContact,
                userBarangay: userBarangay,
                appForm1: [],
                barangayClearance1: [],
                dti: [],
                sec: [],
                lessor: [],
                tax: [],
                publicLiability: [],
                appForm2: [],
                barangayClearance2: [],
                xerox: [],
                audited: [],
                publicLiability2: [],
            };

            // Loop through the selected images and upload each one
            for (const uri of appForm1) {
                const { uri: fileUri } = await FileSystem.getInfoAsync(uri);
                const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = () => {
                        resolve(xhr.response);
                    };
                    xhr.onerror = (e) => {
                        reject(new TypeError("Network request failed"));
                    };
                    xhr.responseType = "blob";
                    xhr.open("GET", fileUri, true);
                    xhr.send(null);
                });

                const filename = uri.substring(uri.lastIndexOf("/") + 1);
                const ref = firebase.storage().ref().child(filename);

                // Upload the image to Firebase Storage
                const snapshot = await ref.put(blob);

                // Get the download URL of the uploaded image
                const downloadURL = await snapshot.ref.getDownloadURL();

                // Add the download URL to the appropriate array based on the category
                imageURLs.appForm1.push(downloadURL);
            }

            for (const uri of barangayClearance1) {
                const { uri: fileUri } = await FileSystem.getInfoAsync(uri);
                const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = () => {
                        resolve(xhr.response);
                    };
                    xhr.onerror = (e) => {
                        reject(new TypeError("Network request failed"));
                    };
                    xhr.responseType = "blob";
                    xhr.open("GET", fileUri, true);
                    xhr.send(null);
                });

                const filename = uri.substring(uri.lastIndexOf("/") + 1);
                const ref = firebase.storage().ref().child(filename);

                // Upload the image to Firebase Storage
                const snapshot = await ref.put(blob);

                // Get the download URL of the uploaded image
                const downloadURL = await snapshot.ref.getDownloadURL();

                // Add the download URL to the appropriate array based on the category
                imageURLs.barangayClearance1.push(downloadURL);
            }

            for (const uri of dti) {
                const { uri: fileUri } = await FileSystem.getInfoAsync(uri);
                const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = () => {
                        resolve(xhr.response);
                    };
                    xhr.onerror = (e) => {
                        reject(new TypeError("Network request failed"));
                    };
                    xhr.responseType = "blob";
                    xhr.open("GET", fileUri, true);
                    xhr.send(null);
                });

                const filename = uri.substring(uri.lastIndexOf("/") + 1);
                const ref = firebase.storage().ref().child(filename);

                // Upload the image to Firebase Storage
                const snapshot = await ref.put(blob);

                // Get the download URL of the uploaded image
                const downloadURL = await snapshot.ref.getDownloadURL();

                // Add the download URL to the appropriate array based on the category
                imageURLs.dti.push(downloadURL);
            }

            for (const uri of sec) {
                const { uri: fileUri } = await FileSystem.getInfoAsync(uri);
                const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = () => {
                        resolve(xhr.response);
                    };
                    xhr.onerror = (e) => {
                        reject(new TypeError("Network request failed"));
                    };
                    xhr.responseType = "blob";
                    xhr.open("GET", fileUri, true);
                    xhr.send(null);
                });

                const filename = uri.substring(uri.lastIndexOf("/") + 1);
                const ref = firebase.storage().ref().child(filename);

                // Upload the image to Firebase Storage
                const snapshot = await ref.put(blob);

                // Get the download URL of the uploaded image
                const downloadURL = await snapshot.ref.getDownloadURL();

                // Add the download URL to the appropriate array based on the category
                imageURLs.sec.push(downloadURL);
            }

            for (const uri of lessor) {
                const { uri: fileUri } = await FileSystem.getInfoAsync(uri);
                const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = () => {
                        resolve(xhr.response);
                    };
                    xhr.onerror = (e) => {
                        reject(new TypeError("Network request failed"));
                    };
                    xhr.responseType = "blob";
                    xhr.open("GET", fileUri, true);
                    xhr.send(null);
                });

                const filename = uri.substring(uri.lastIndexOf("/") + 1);
                const ref = firebase.storage().ref().child(filename);

                // Upload the image to Firebase Storage
                const snapshot = await ref.put(blob);

                // Get the download URL of the uploaded image
                const downloadURL = await snapshot.ref.getDownloadURL();

                // Add the download URL to the appropriate array based on the category
                imageURLs.lessor.push(downloadURL);
            }

            for (const uri of tax) {
                const { uri: fileUri } = await FileSystem.getInfoAsync(uri);
                const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = () => {
                        resolve(xhr.response);
                    };
                    xhr.onerror = (e) => {
                        reject(new TypeError("Network request failed"));
                    };
                    xhr.responseType = "blob";
                    xhr.open("GET", fileUri, true);
                    xhr.send(null);
                });

                const filename = uri.substring(uri.lastIndexOf("/") + 1);
                const ref = firebase.storage().ref().child(filename);

                // Upload the image to Firebase Storage
                const snapshot = await ref.put(blob);

                // Get the download URL of the uploaded image
                const downloadURL = await snapshot.ref.getDownloadURL();

                // Add the download URL to the appropriate array based on the category
                imageURLs.tax.push(downloadURL);
            }

            for (const uri of publicLiability) {
                const { uri: fileUri } = await FileSystem.getInfoAsync(uri);
                const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = () => {
                        resolve(xhr.response);
                    };
                    xhr.onerror = (e) => {
                        reject(new TypeError("Network request failed"));
                    };
                    xhr.responseType = "blob";
                    xhr.open("GET", fileUri, true);
                    xhr.send(null);
                });

                const filename = uri.substring(uri.lastIndexOf("/") + 1);
                const ref = firebase.storage().ref().child(filename);

                // Upload the image to Firebase Storage
                const snapshot = await ref.put(blob);

                // Get the download URL of the uploaded image
                const downloadURL = await snapshot.ref.getDownloadURL();

                // Add the download URL to the appropriate array based on the category
                imageURLs.publicLiability.push(downloadURL);
            }

            for (const uri of appForm2) {
                const { uri: fileUri } = await FileSystem.getInfoAsync(uri);
                const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = () => {
                        resolve(xhr.response);
                    };
                    xhr.onerror = (e) => {
                        reject(new TypeError("Network request failed"));
                    };
                    xhr.responseType = "blob";
                    xhr.open("GET", fileUri, true);
                    xhr.send(null);
                });

                const filename = uri.substring(uri.lastIndexOf("/") + 1);
                const ref = firebase.storage().ref().child(filename);

                // Upload the image to Firebase Storage
                const snapshot = await ref.put(blob);

                // Get the download URL of the uploaded image
                const downloadURL = await snapshot.ref.getDownloadURL();

                // Add the download URL to the appropriate array based on the category
                imageURLs.appForm2.push(downloadURL);
            }

            for (const uri of barangayClearance2) {
                const { uri: fileUri } = await FileSystem.getInfoAsync(uri);
                const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = () => {
                        resolve(xhr.response);
                    };
                    xhr.onerror = (e) => {
                        reject(new TypeError("Network request failed"));
                    };
                    xhr.responseType = "blob";
                    xhr.open("GET", fileUri, true);
                    xhr.send(null);
                });

                const filename = uri.substring(uri.lastIndexOf("/") + 1);
                const ref = firebase.storage().ref().child(filename);

                // Upload the image to Firebase Storage
                const snapshot = await ref.put(blob);

                // Get the download URL of the uploaded image
                const downloadURL = await snapshot.ref.getDownloadURL();

                // Add the download URL to the appropriate array based on the category
                imageURLs.barangayClearance2.push(downloadURL);
            }

            for (const uri of xerox) {
                const { uri: fileUri } = await FileSystem.getInfoAsync(uri);
                const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = () => {
                        resolve(xhr.response);
                    };
                    xhr.onerror = (e) => {
                        reject(new TypeError("Network request failed"));
                    };
                    xhr.responseType = "blob";
                    xhr.open("GET", fileUri, true);
                    xhr.send(null);
                });

                const filename = uri.substring(uri.lastIndexOf("/") + 1);
                const ref = firebase.storage().ref().child(filename);

                // Upload the image to Firebase Storage
                const snapshot = await ref.put(blob);

                // Get the download URL of the uploaded image
                const downloadURL = await snapshot.ref.getDownloadURL();

                // Add the download URL to the appropriate array based on the category
                imageURLs.xerox.push(downloadURL);
            }

            for (const uri of audited) {
                const { uri: fileUri } = await FileSystem.getInfoAsync(uri);
                const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = () => {
                        resolve(xhr.response);
                    };
                    xhr.onerror = (e) => {
                        reject(new TypeError("Network request failed"));
                    };
                    xhr.responseType = "blob";
                    xhr.open("GET", fileUri, true);
                    xhr.send(null);
                });

                const filename = uri.substring(uri.lastIndexOf("/") + 1);
                const ref = firebase.storage().ref().child(filename);

                // Upload the image to Firebase Storage
                const snapshot = await ref.put(blob);

                // Get the download URL of the uploaded image
                const downloadURL = await snapshot.ref.getDownloadURL();

                // Add the download URL to the appropriate array based on the category
                imageURLs.audited.push(downloadURL);
            }

            for (const uri of publicLiability2) {
                const { uri: fileUri } = await FileSystem.getInfoAsync(uri);
                const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = () => {
                        resolve(xhr.response);
                    };
                    xhr.onerror = (e) => {
                        reject(new TypeError("Network request failed"));
                    };
                    xhr.responseType = "blob";
                    xhr.open("GET", fileUri, true);
                    xhr.send(null);
                });

                const filename = uri.substring(uri.lastIndexOf("/") + 1);
                const ref = firebase.storage().ref().child(filename);

                // Upload the image to Firebase Storage
                const snapshot = await ref.put(blob);

                // Get the download URL of the uploaded image
                const downloadURL = await snapshot.ref.getDownloadURL();

                // Add the download URL to the appropriate array based on the category
                imageURLs.publicLiability2.push(downloadURL);
            }

            // Store the data in Firestore
            const docRef = await firebase
                .firestore()
                .collection("businessPermit")
                .add({
                    typeOfApplication: selectedApplicationType,
                    ...imageURLs,
                    timestamp, // Move the timestamp field inside uploadMedia function
                    // Add other relevant fields as needed
                });

            console.log("Document written with ID: ", docRef.id);

            // Show a success alert
            Alert.alert(
                "Success",
                "Application submitted successfully!",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
            );

            // Clear the state and reset form values
            setSelectedApplicationType(null);
            setAppForm1([]);
            setBarangayClearance1([]);
            setDti([]);
            setSec([]);
            setLessor([]);
            setTax([]);
            setPublicLiability([]);
            setAppForm2([]);
            setBarangayClearance2([]);
            setXerox([]);
            setAudited([]);
            setPublicLiability2([]);
            resetForm();
        } catch (error) {
            // Show an error alert
        } finally {
            setUploading(false);
            setLoadingModalVisible(false); // Hide loading modal
        }
    };

    const handleApplicationTypeSelection = (type) => {
        setSelectedApplicationType(type);

        // Animated color change for selected application type
        Animated.timing(colorAnimation, {
            toValue: type === "new" ? 0 : 1, // Use indices based on the number of types
            duration: 300,
            useNativeDriver: true, // Set to false for color animation
        }).start();
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
                Alert.alert(
                    "Error",
                    "There was an error uploading images. Please try again.",
                    [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                    { cancelable: false }
                );
            }
        };

        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#93C49E" />

            {/* Loading Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={loadingModalVisible}
                onRequestClose={() => {
                    setLoadingModalVisible(false);
                }}
            >
                <View style={styles.loadingModal}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            </Modal>

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
                        <Text style={styles.itemService_name}>Business Permit</Text>
                    </View>
                </View>
                <View style={styles.innerContainer}>
                    <Text style={styles.itemService_desc}>
                        A legal document that offers proof of compliance with certain city
                        or state laws regulating structural appearances and safety as well
                        as the sale of products. Business permits regulate safety, structure
                        and appearance of the business community. They act as proof that
                        your business follows certain laws and ordinances. Requirements vary
                        by jurisdiction, and failure to comply often results in fines or
                        even having your business shut down. Research the permits you need
                        before you start any work, setup or property purchase. That way, you
                        can make sure compliance is in order and avoid the additional
                        expenses and delays of fixing things later. This annual BOSS gathers
                        under one roof all the government agencies to set up desks for
                        permits or clearances needed to renew and apply for a business
                        permit.
                    </Text>
                </View>

                <Text style={styles.noteText}>
                    Direction: Select the application type then download and fill up the application form below.
                </Text>

                <View style={styles.choices}>
                    <TouchableOpacity
                        style={[
                            styles.selection,
                            selectedApplicationType === "new" && {
                                backgroundColor: colorAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ["#93C49E", "#FFFFFF"],
                                }),
                            },
                        ]}
                        onPress={() => handleApplicationTypeSelection("new")}
                    >
                        <Image source={require("../assets/imported/form.png")} style={styles.form} />
                        <Text style={styles.selectionText}>New Applications</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.selection,
                            selectedApplicationType === "renew" && {
                                backgroundColor: colorAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ["#93C49E", "#FFFFFF"],
                                }),
                            },
                        ]}
                        onPress={() => handleApplicationTypeSelection("renew")}
                    >
                        <Image source={require("../assets/imported/form.png")} style={styles.form} />
                        <Text style={styles.selectionText}>Renewal of Permit</Text>
                    </TouchableOpacity>
                </View>

                {selectedApplicationType === "new" && (
                    <>
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

                        <Text style={styles.noteText}>
                            Note: Upload the requirements needed before submitting your
                            application. Lack of needed information will cause delay or
                            rejection.
                        </Text>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                Application form (2 copies, Notarized)
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("app form 1")}>
                                {appForm1.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {appForm1.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={appForm1}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("app form 1", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                Original Barangay Business Clearance
                            </Text>
                            <TouchableOpacity
                                onPress={() => pickImage("barangay clearance 1")}
                            >
                                {barangayClearance1.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {barangayClearance1.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={barangayClearance1}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("barangay clearance 1", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                DTI Registration (Single Proprietor)
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("dti")}>
                                {dti.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {dti.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={dti}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("dti", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                SEC Registration (Corporation)
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("sec")}>
                                {sec.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {sec.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={sec}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("sec", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                Lessor’s Permit (If Renting){" "}
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("lessor")}>
                                {lessor.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {lessor.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={lessor}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("lessor", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                Tax Declaration of Property (If Owned)
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("tax")}>
                                {tax.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {tax.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={tax}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("tax", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                Public Liability Insurance SPA for Authorized Representatives
                                with I.D.
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("public liability")}>
                                {publicLiability.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {publicLiability.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={publicLiability}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("public liability", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>
                    </>
                )}

                {selectedApplicationType === "renew" && (
                    <>
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

                        <Text style={styles.noteText}>
                            Note: Upload the requirements needed before submitting your
                            application. Lack of needed information will cause delay or
                            rejection.
                        </Text>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>Application form (2 copies)</Text>
                            <TouchableOpacity onPress={() => pickImage("app form 2")}>
                                {appForm2.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {appForm2.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={appForm2}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("app form 2", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                Original Barangay Business Clearance
                            </Text>
                            <TouchableOpacity
                                onPress={() => pickImage("barangay clearance 2")}
                            >
                                {barangayClearance2.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {barangayClearance2.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={barangayClearance2}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("barangay clearance 2", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                Xerox Copy of previous Business Permit and Receipt
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("xerox")}>
                                {xerox.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {xerox.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={xerox}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("xerox", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                Audited Financial Statement and/or Monthly or Quarterly VAT
                                Returns
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("audited")}>
                                {audited.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {audited.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={audited}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("audited", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                Public Liability Insurance SPA for Authorized Representatives
                                with I.D.
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("public liability 2")}>
                                {publicLiability2.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {publicLiability2.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={publicLiability2}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("public liability 2", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>
                    </>
                )}

                <View style={styles.submit}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            // Check if a category is selected
                            if (!selectedApplicationType) {
                                // Show an alert if no category is selected
                                Alert.alert(
                                    "Error",
                                    "Please choose an application type before submitting.",
                                    [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                                    { cancelable: false }
                                );
                            } else if (selectedApplicationType === "new") {
                                // Check if any information is typed
                                if (
                                    appForm1.length === 0 ||
                                    barangayClearance1.length === 0 ||
                                    dti.length === 0 ||
                                    sec.length === 0 ||
                                    lessor.length === 0 ||
                                    tax.length === 0 ||
                                    publicLiability.length === 0
                                ) {
                                    // Show an alert if any of the required fields is empty
                                    Alert.alert(
                                        "Error",
                                        "Please upload all required documents before submitting.",
                                        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                                        { cancelable: false }
                                    );
                                } else {
                                    uploadMedia();
                                }
                            } else if (selectedApplicationType === "renew") {
                                // Check if any information is typed
                                if (
                                    appForm2.length === 0 ||
                                    barangayClearance2.length === 0 ||
                                    xerox.length === 0 ||
                                    audited.length === 0 ||
                                    publicLiability2.length === 0
                                ) {
                                    // Show an alert if any of the required fields is empty
                                    Alert.alert(
                                        "Error",
                                        "Please upload all required documents before submitting.",
                                        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                                        { cancelable: false }
                                    );
                                } else {
                                    uploadMedia();
                                }
                            }
                        }}
                    >
                        <Text style={styles.submitText}>Submit</Text>
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
    noteText: {
        fontSize: 15,
        textAlign: "justify",
        marginTop: 5,
        marginBottom: 10,
        fontWeight: "400",
    },
    submit: {
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        borderRadius: 50,
    },
    button: {
        backgroundColor: "#307A59",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        borderRadius: 50,
        paddingVertical: 10,
        marginTop: 20,
        width: 165,
        marginBottom: 40,
    },
    selectButton: {
        borderRadius: 10,
        flexDirection: "row", // Align items horizontally
        justifyContent: "space-between", // Space between children
        alignItems: "center", // Center vertically
        width: "100%",
        height: 60,
        backgroundColor: "transparent",
        borderColor: "#307A59",
        borderWidth: 1,
        marginTop: 10,
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
    uploadedImageContainer: {
        position: "relative",
    },
    uploadedImage: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    removeImageButton: {
        position: "absolute",
        top: 0,
        right: 5,
        backgroundColor: "transparent",
        borderRadius: 15,
        padding: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    choices: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    selection: {
        width: 120,
        height: 100,
        borderColor: "#307A59",
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        padding: 10,
        margin: 5,
    },
    form: {
        justifyContent: "center",
        alignItems: "center",
        resizeMode: "contain",
        flex: 1,
        width: 50,
        height: 50,
    },
    selectionText: {
        textAlign: "center",
        marginBottom: 10,
        fontSize: 11,
    },
    placeholder: {
        width: "100%",
        height: 48,
        borderColor: "307A59",
        borderRadius: 8,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 10,
    },
    label: {
        fontSize: 15,
        fontWeight: "400",
        marginVertical: 8,
    },
    loadingModal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    buttonDocx: {
        backgroundColor: "#307A59",
    },
});
