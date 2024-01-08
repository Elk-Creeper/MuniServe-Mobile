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
    Alert,
    TextInput,
    ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { firebase } from "../config";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as VideoThumbnails from "expo-video-thumbnails";
import { Link, useRouter } from "expo-router";

export default function Tab4() {
    const router = useRouter();

    const [cedula1, setCedula1] = useState([]);
    const [barangayClearance1, setBarangayClearance1] = useState([]);
    const [dti1, setDti1] = useState([]);
    const [sec1, setSec1] = useState([]);
    const [fire1, setFire1] = useState([]);
    const [sanitary1, setSanitary1] = useState([]);
    const [police1, setPolice1] = useState([]);
    const [picture1, setPicture1] = useState([]);
    const [mayorsPermit1, setMayorsPermit1] = useState([]);
    const [mpdc1, setMpdc1] = useState([]);
    const [meo1, setMeo1] = useState([]);
    const [contact1, setContact1] = useState([]);
    const [businessNum1, setBusinessNum1] = useState([]);

    const [cedula2, setCedula2] = useState([]);
    const [barangayClearance2, setBarangayClearance2] = useState([]);
    const [dti2, setDti2] = useState([]);
    const [sec2, setSec2] = useState([]);
    const [fire2, setFire2] = useState([]);
    const [sanitary2, setSanitary2] = useState([]);
    const [police2, setPolice2] = useState([]);
    const [picture2, setPicture2] = useState([]);
    const [mayorsPermit2, setMayorsPermit2] = useState([]);
    const [mpdc2, setMpdc2] = useState([]);
    const [meo2, setMeo2] = useState([]);
    const [contact2, setContact2] = useState([]);
    const [businessNum2, setBusinessNum2] = useState([]);
  
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
            cedula1.length > 0 &&
            barangayClearance1.length > 0 &&
            dti1.length > 0 &&
            sec1.length > 0 &&
            fire1.length > 0 &&
            sanitary1.length > 0 &&
            police1.length > 0 &&
            picture1.length > 0 &&
            mayorsPermit1.length > 0 &&
            mpdc1.length > 0 &&
            meo1.length > 0 &&

            cedula2.length > 0 &&
            barangayClearance2.length > 0 &&
            dti2.length > 0 &&
            sec2.length > 0 &&
            fire2.length > 0 &&
            sanitary2.length > 0 &&
            police2.length > 0 &&
            picture2.length > 0 &&
            mayorsPermit2.length > 0 &&
            mpdc2.length > 0 &&
            meo2.length > 0 
        ) {
            Animated.timing(fadeAnimation, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    }, [cedula1, barangayClearance1, dti1, sec1, fire1, sanitary1, police1, picture1, mayorsPermit1, mpdc1, meo1, 
        cedula2, barangayClearance2, dti2, sec2, fire2, sanitary2, police2, picture2, mayorsPermit2, mpdc2, meo2
    ]);

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
                if (category === "cedula1") {
                    setCedula1([
                        ...cedula1,
                        ...result.assets.map((asset) => asset.uri),
                    ]);
                } else if (category === "barangayClearance1") {
                    setBarangayClearance1([
                        ...barangayClearance1,
                        ...result.assets.map((asset) => asset.uri),
                    ]);
                } else if (category === "dti1") {
                    setDti1([...dti1, ...result.assets.map((asset) => asset.uri)]);
                } else if (category === "sec1") {
                    setSec1([...sec1, ...result.assets.map((asset) => asset.uri)]);
                } else if (category === "fire1") {
                    setFire1([...fire1, ...result.assets.map((asset) => asset.uri)]);
                } else if (category === "sanitary1") {
                    setSanitary1([...sanitary1, ...result.assets.map((asset) => asset.uri)]);
                } else if (category === "police1") {
                    setPolice1([
                        ...police1,
                        ...result.assets.map((asset) => asset.uri),
                    ]);
                } else if (category === "picture1") {
                    setPicture1([
                        ...picture1,
                        ...result.assets.map((asset) => asset.uri),
                    ]);
                } else if (category === "mayorsPermit1") {
                    setMayorsPermit1([
                        ...mayorsPermit1,
                        ...result.assets.map((asset) => asset.uri),
                    ]);
                } else if (category === "mpdc1") {
                    setMpdc1([
                        ...mpdc1,
                        ...result.assets.map((asset) => asset.uri),
                    ]);
                } else if (category === "meo1") {
                    setMeo1([
                        ...meo1,
                        ...result.assets.map((asset) => asset.uri),
                    ]);
                } else if (category === "cedula2") {
                    setCedula2([
                        ...cedula2,
                        ...result.assets.map((asset) => asset.uri),
                    ]);
                } else if (category === "barangayClearance2") {
                    setBarangayClearance2([
                        ...barangayClearance2,
                        ...result.assets.map((asset) => asset.uri),
                    ]);
                } else if (category === "dti2") {
                    setDti2([...dti2, ...result.assets.map((asset) => asset.uri)]);
                } else if (category === "sec2") {
                    setSec2([...sec2, ...result.assets.map((asset) => asset.uri)]);
                } else if (category === "fire2") {
                    setFire2([...fire2, ...result.assets.map((asset) => asset.uri)]);
                } else if (category === "sanitary2") {
                    setSanitary2([...sanitary2, ...result.assets.map((asset) => asset.uri)]);
                } else if (category === "police2") {
                    setPolice2([
                        ...police2,
                        ...result.assets.map((asset) => asset.uri),
                    ]);
                } else if (category === "picture2") {
                    setPicture2([
                        ...picture2,
                        ...result.assets.map((asset) => asset.uri),
                    ]);
                } else if (category === "mayorsPermit2") {
                    setMayorsPermit2([
                        ...mayorsPermit2,
                        ...result.assets.map((asset) => asset.uri),
                    ]);
                } else if (category === "mpdc2") {
                    setMpdc2([
                        ...mpdc2,
                        ...result.assets.map((asset) => asset.uri),
                    ]);
                } else if (category === "meo2") {
                    setMeo2([
                        ...meo2,
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
        if (category === "cedula1") {
            const newImages = [...cedula1];
            newImages.splice(index, 1);
            setCedula1(newImages);
        } else if (category === "barangayClearance1") {
            const newImages = [...barangayClearance1];
            newImages.splice(index, 1);
            setBarangayClearance1(newImages);
        } else if (category === "dti1") {
            const newImages = [...dti1];
            newImages.splice(index, 1);
            setDti1(newImages);
        } else if (category === "sec1") {
            const newImages = [...sec1];
            newImages.splice(index, 1);
            setSec1(newImages);
        } else if (category === "fire1") {
            const newImages = [...fire1];
            newImages.splice(index, 1);
            setFire1(newImages);
        } else if (category === "sanitary1") {
            const newImages = [...sanitary1];
            newImages.splice(index, 1);
            setSanitary1(newImages);
        } else if (category === "police1") {
            const newImages = [...police1];
            newImages.splice(index, 1);
            setPolice1(newImages);
        } else if (category === "picture1") {
            const newImages = [...picture1];
            newImages.splice(index, 1);
            setPicture1(newImages);
        } else if (category === "mayorsPermit1") {
            const newImages = [...mayorsPermit1];
            newImages.splice(index, 1);
            setMayorsPermit1(newImages);
        } else if (category === "mpdc1") {
            const newImages = [...mpdc1];
            newImages.splice(index, 1);
            setMpdc1(newImages);
        } else if (category === "meo1") {
            const newImages = [...meo1];
            newImages.splice(index, 1);
            setMeo1(newImages);
        } else if (category === "cedula2") {
            const newImages = [...cedula2];
            newImages.splice(index, 1);
            setCedula2(newImages);
        } else if (category === "barangayClearance2") {
            const newImages = [...barangayClearance2];
            newImages.splice(index, 1);
            setBarangayClearance2(newImages);
        } else if (category === "dti2") {
            const newImages = [...dti2];
            newImages.splice(index, 1);
            setDti2(newImages);
        } else if (category === "sec2") {
            const newImages = [...sec2];
            newImages.splice(index, 1);
            setSec2(newImages);
        } else if (category === "fire2") {
            const newImages = [...fire2];
            newImages.splice(index, 1);
            setFire2(newImages);
        } else if (category === "sanitary2") {
            const newImages = [...sanitary2];
            newImages.splice(index, 1);
            setSanitary2(newImages);
        } else if (category === "police2") {
            const newImages = [...police2];
            newImages.splice(index, 1);
            setPolice2(newImages);
        } else if (category === "picture2") {
            const newImages = [...picture2];
            newImages.splice(index, 1);
            setPicture2(newImages);
        } else if (category === "mayorsPermit2") {
            const newImages = [...mayorsPermit2];
            newImages.splice(index, 1);
            setMayorsPermit2(newImages);
        } else if (category === "mpdc2") {
            const newImages = [...mpdc2];
            newImages.splice(index, 1);
            setMpdc2(newImages);
        } else if (category === "meo2") {
            const newImages = [...meo2];
            newImages.splice(index, 1);
            setMeo2(newImages);
        } 
    };

    const uploadMedia = async () => {
        setLoadingModalVisible(true); // Show loading modal
        setUploading(true);

        try {

            // Validate phone number
            if (!/^\d{11}$/.test(contact1) || !/^\d{11}$/.test(contact2)) {
                Alert.alert("Invalid Phone Number", "Phone number must be exactly 11 digits.");
                return;
            }

            const imageURLs = {
                userUid: userUid,
                userName: userName,
                userEmail: userEmail,
                userContact: userContact,
                userBarangay: userBarangay,
                cedula1: [],
                barangayClearance1: [],
                dti1: [],
                sec1: [],
                fire1: [],
                sanitary1: [],
                police1: [],
                picture1: [],
                mayorsPermit1: [],
                mpdc1: [],
                meo1: [],
                contact1: contact1,
                businessNum1: businessNum1,
                cedula2: [],
                barangayClearance2: [],
                dti2: [],
                sec2: [],
                fire2: [],
                sanitary2: [],
                police2: [],
                picture2: [],
                mayorsPermit2: [],
                mpdc2: [],
                meo2: [],
                contact2: contact2,
                businessNum2: businessNum2,
            };

            // Loop through the selected images and upload each one
            for (const uri of cedula1) {
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
                imageURLs.cedula1.push(downloadURL);
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

            for (const uri of dti1) {
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
                imageURLs.dti1.push(downloadURL);
            }

            for (const uri of sec1) {
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
                imageURLs.sec1.push(downloadURL);
            }

            for (const uri of fire1) {
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
                imageURLs.fire1.push(downloadURL);
            }

            for (const uri of sanitary1) {
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
                imageURLs.sanitary1.push(downloadURL);
            }

            for (const uri of police1) {
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
                imageURLs.police1.push(downloadURL);
            }

            for (const uri of picture1) {
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
                imageURLs.picture1.push(downloadURL);
            }

            for (const uri of mayorsPermit1) {
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
                imageURLs.mayorsPermit1.push(downloadURL);
            }

            for (const uri of mpdc1) {
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
                imageURLs.mpdc1.push(downloadURL);
            }

            for (const uri of meo1) {
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
                imageURLs.meo1.push(downloadURL);
            }

            for (const uri of cedula2) {
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
                imageURLs.cedula2.push(downloadURL);
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

            for (const uri of dti2) {
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
                imageURLs.dti2.push(downloadURL);
            }

            for (const uri of sec2) {
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
                imageURLs.sec2.push(downloadURL);
            }

            for (const uri of fire2) {
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
                imageURLs.fire2.push(downloadURL);
            }

            for (const uri of sanitary2) {
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
                imageURLs.sanitary2.push(downloadURL);
            }

            for (const uri of police2) {
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
                imageURLs.police2.push(downloadURL);
            }

            for (const uri of picture2) {
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
                imageURLs.picture2.push(downloadURL);
            }

            for (const uri of mayorsPermit2) {
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
                imageURLs.mayorsPermit2.push(downloadURL);
            }

            for (const uri of mpdc2) {
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
                imageURLs.mpdc2.push(downloadURL);
            }

            for (const uri of meo2) {
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
                imageURLs.meo2.push(downloadURL);
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
            resetForm();

        } catch (error) {
            // Show an error alert
        } finally {
            setUploading(false);
            setLoadingModalVisible(false); // Hide loading modal
        }
    };

    const resetForm = () => {
        setSelectedApplicationType(null);
        setCedula1([]);
        setBarangayClearance1([]);
        setDti1([]);
        setSec1([]);
        setFire1([]);
        setSanitary1([]);
        setPolice1([]);
        setPicture1([]);
        setMayorsPermit1([]);
        setMpdc1([]);
        setMeo1([]);
        setContact1("");
        setBusinessNum1("");
        setCedula2([]);
        setBarangayClearance2([]);
        setDti2([]);
        setSec2([]);
        setFire2([]);
        setSanitary2([]);
        setPolice2([]);
        setPicture2([]);
        setMayorsPermit2([]);
        setMpdc2([]);
        setMeo2([]);
        setContact2("");
        setBusinessNum2("");
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
                        <Text style={styles.itemService_name}>Business Permit</Text>
                    </View>
                </View>
                <View style={styles.innerContainer}>
                    <Text style={styles.titleSteps}>CLIENT STEPS</Text>
                    <Text style={styles.textSteps}>1. Proceed to the Office of the Mayor</Text>
                    <View style={styles.stepsCon}>
                        <Text style={styles.titleSteps}>AGENCY ACTION</Text>
                        <Text style={styles.textSteps}>1. Check Application Forms and minimum requirements</Text>
                        <Text style={styles.titleSteps}>FEES TO BE PAID</Text>
                        <Text style={styles.textSteps}>None</Text>
                        <Text style={styles.titleSteps}>PROCESSING TIME</Text>
                        <Text style={styles.textSteps}>10 minutes</Text>
                        <Text style={styles.titleSteps}>PERSON RESPONSIBLE</Text>
                        <Text style={styles.textName}>Sofia B. Soledad</Text>
                        <Text style={{ fontWeight: "600" }}>Administrative Aide I</Text>
                        <Text style={{ fontWeight: "600" }}>Mayor's Office</Text>
                    </View>
                    <Text style={styles.titleSteps}>CLIENT STEPS</Text>
                    <Text style={styles.textSteps}>2. Proceed to the Municipal Treasurers Office for the assessment and payment of fees</Text>
                    <View style={styles.stepsCon}>
                        <Text style={styles.titleSteps}>AGENCY ACTION</Text>
                        <Text style={styles.textSteps}>2. Receive payment</Text>
                        <Text style={styles.textSteps}>2. (1) Issue Official Receipt</Text>
                        <Text style={styles.titleSteps}>FEES TO BE PAID</Text>
                        <Text style={styles.textSteps}>None</Text>
                        <Text style={styles.titleSteps}>PROCESSING TIME</Text>
                        <Text style={styles.textSteps}>10 minutes</Text>
                        <Text style={styles.titleSteps}>PERSON RESPONSIBLE</Text>
                        <Text style={styles.textName}>Revenue Collection Clerk</Text>
                        <Text style={{ fontWeight: "600" }}>Municipal Treasurer's Office</Text>
                    </View>
                    <Text style={styles.titleSteps}>CLIENT STEPS</Text>
                    <Text style={styles.textSteps}>3. Proceed to the Office of the Mayor and submit the required documents</Text>
                    <View style={styles.stepsCon}>
                        <Text style={styles.titleSteps}>AGENCY ACTION</Text>
                        <Text style={styles.textSteps}>3. Prepare the requested document  and print the Mayor's permit for approval of the Municipal Mayor</Text>
                        <Text style={styles.titleSteps}>FEES TO BE PAID</Text>
                        <Text style={styles.textSteps}>None</Text>
                        <Text style={styles.titleSteps}>PROCESSING TIME</Text>
                        <Text style={styles.textSteps}>30 minutes{"\n"}{"\n"}{"\n"}5 minutes</Text>
                        <Text style={styles.titleSteps}>PERSON RESPONSIBLE</Text>
                        <Text style={styles.textName}>Sofia B. Soledad</Text>
                        <Text style={{ fontWeight: "600" }}>Administrative Aide I</Text>
                        <Text style={{ fontWeight: "600" }}>Mayor's Office{"\n"}{"\n"}{"\n"}Hon. Melanie Abarientos-Garcia</Text>
                    </View>

                </View>

                <Text style={styles.noteText}>
                    Direction: Select the application type, then proceed to upload the requirements.                
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
                        <Text style={styles.noteText}>
                            Note: Upload the requirements needed before submitting your
                            application. Lack of needed information will cause delay or
                            rejection.
                        </Text>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                Cedula
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("cedula1")}>
                                {cedula1.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {cedula1.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={cedula1}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("cedula1", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                Barangay Business Clearance
                            </Text>
                            <TouchableOpacity
                                onPress={() => pickImage("barangayClearance1")}
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
                                            onPress={() => removeImage("barangayClearance1", index)}
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
                            <TouchableOpacity onPress={() => pickImage("dti1")}>
                                {dti1.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {dti1.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={dti1}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("dti1", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                SEC Registration (Corporation & Partnership)
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("sec1")}>
                                {sec1.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {sec1.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={sec1}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("sec1", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                Fire Safety Clearance
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("fire1")}>
                                {fire1.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {fire1.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={fire1}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("fire1", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                Sanitary/Health Certificate
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("sanitary1")}>
                                {sanitary1.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {sanitary1.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={sanitary1}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("sanitary1", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                Police Clearance
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("police1")}>
                                {police1.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {police1.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={police1}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("police1", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>
                        
                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                Picture 2x2 (1 piece)
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("picture1")}>
                                {picture1.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {picture1.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={picture1}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("picture1", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                Official Receipt for Mayor's Permit
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("mayorsPermit1")}>
                                {mayorsPermit1.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {mayorsPermit1.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={mayorsPermit1}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("mayorsPermit1", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                MPDC Certification
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("mpdc1")}>
                                {mpdc1.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {mpdc1.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={mpdc1}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("mpdc1", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                MEO Certification
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("meo1")}>
                                {meo1.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {meo1.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={meo1}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("meo1", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.label}>Contact Number</Text>

                            <View style={styles.placeholder}>
                                <TextInput
                                    placeholder=""
                                    maxLength={11}
                                    value={contact1}
                                    keyboardType="phone-pad"
                                    onChangeText={(contact1) => setContact1(contact1)}
                                    style={{
                                        width: "100%",
                                    }}
                                ></TextInput>
                            </View>
                        </View>

                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.label}>Business Registration Number</Text>

                            <View style={styles.placeholder}>
                                <TextInput
                                    placeholder=""
                                    maxLength={20}
                                    value={businessNum1}
                                    keyboardType="phone-pad"
                                    onChangeText={(businessNum1) => setBusinessNum1(businessNum1)}
                                    style={{
                                        width: "100%",
                                    }}
                                ></TextInput>
                            </View>
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
                            <Text style={styles.buttonText}>
                                Cedula
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("cedula2")}>
                                {cedula2.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {cedula2.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={cedula2}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("cedula2", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                Barangay Business Clearance
                            </Text>
                            <TouchableOpacity
                                onPress={() => pickImage("barangayClearance2")}
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
                                            onPress={() => removeImage("barangayClearance2", index)}
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
                            <TouchableOpacity onPress={() => pickImage("dti2")}>
                                {dti2.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {dti2.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={dti2}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("dti2", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                SEC Registration (Corporation & Partnership)
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("sec2")}>
                                {sec2.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {sec2.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={sec2}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("sec2", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                Fire Safety Clearance
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("fire2")}>
                                {fire2.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {fire2.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={fire2}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("fire2", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                Sanitary/Health Certificate
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("sanitary2")}>
                                {sanitary2.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {sanitary2.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={sanitary2}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("sanitary2", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                Police Clearance
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("police2")}>
                                {police2.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {police2.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={police2}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("police2", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                Picture 2x2 (1 piece)
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("picture2")}>
                                {picture2.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {picture2.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={picture2}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("picture2", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                Official Receipt for Mayor's Permit
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("mayorsPermit2")}>
                                {mayorsPermit2.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {mayorsPermit2.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={mayorsPermit2}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("mayorsPermit2", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                MPDC Certification
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("mpdc2")}>
                                {mpdc2.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {mpdc2.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={mpdc2}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("mpdc2", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>
                                MEO Certification
                            </Text>
                            <TouchableOpacity onPress={() => pickImage("meo2")}>
                                {meo2.length > 0 ? (
                                    <Animated.View></Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {meo2.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={meo2}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.uploadedImage}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("meo2", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.label}>Contact Number</Text>

                            <View style={styles.placeholder}>
                                <TextInput
                                    placeholder=""
                                    maxLength={11}
                                    value={contact2}
                                    keyboardType="phone-pad"
                                    onChangeText={(contact2) => setContact2(contact2)}
                                    style={{
                                        width: "100%",
                                    }}
                                ></TextInput>
                            </View>
                        </View>

                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.label}>Business Registration Number</Text>

                            <View style={styles.placeholder}>
                                <TextInput
                                    placeholder=""
                                    maxLength={20}
                                    value={businessNum2}
                                    keyboardType="phone-pad"
                                    onChangeText={(businessNum2) => setBusinessNum2(businessNum2)}
                                    style={{
                                        width: "100%",
                                    }}
                                ></TextInput>
                            </View>
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
                                    "Error Message",
                                    "Please choose an application type before submitting.",
                                    [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                                    { cancelable: false }
                                );
                            } else if (selectedApplicationType === "new") {
                                // Check if any information is typed
                                if (
                                    cedula1.length === 0 ||
                                    barangayClearance1.length === 0 ||
                                    dti1.length === 0 ||
                                    sec1.length === 0 ||
                                    fire1.length === 0 ||
                                    sanitary1.length === 0 ||
                                    police1.length === 0 ||
                                    picture1.length === 0 ||
                                    mayorsPermit1.length === 0 ||
                                    mpdc1.length === 0 ||
                                    meo1.length === 0 ||
                                    !contact1 ||
                                    !businessNum1
                                ) {
                                    // Show an alert if any of the required fields is empty
                                    console.log("Empty Fields:", {
                                        cedula1,
                                        barangayClearance1,
                                        dti1,
                                        sec1,
                                        fire1,
                                        sanitary1,
                                        police1,
                                        picture1,
                                        mayorsPermit1,
                                        mpdc1,
                                        meo1,
                                        contact1,
                                        businessNum1
                                    });
                                    Alert.alert(
                                        "Incomplete Document",
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
                                    cedula2.length === 0 ||
                                    barangayClearance2.length === 0 ||
                                    dti2.length === 0 ||
                                    sec2.length === 0 ||
                                    fire2.length === 0 ||
                                    sanitary2.length === 0 ||
                                    police2.length === 0 ||
                                    picture2.length === 0 ||
                                    mayorsPermit2.length === 0 ||
                                    mpdc2.length === 0 ||
                                    meo2.length === 0 ||
                                    !contact2 ||
                                    !businessNum2
                                ) {
                                    // Show an alert if any of the required fields is empty
                                    console.log("Empty Fields:", {
                                        cedula2,
                                        barangayClearance2,
                                        dti2,
                                        sec2,
                                        fire2,
                                        sanitary2,
                                        police2,
                                        picture2,
                                        mayorsPermit2,
                                        mpdc2,
                                        meo2,
                                        contact2,
                                        businessNum2
                                    });
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
        fontSize: 16,
        textAlign: "justify",
        marginTop: 5,
        marginBottom: 10,
        fontWeight: "500",
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
        marginBottom: 15,
        margin: 10,
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
    titleSteps: {
        fontWeight: "700",
        fontSize: 16
    },
    textSteps: {
        fontSize: 15,
        marginBottom: 10
    },
    stepsCon: {
        marginLeft: 50,
        marginBottom: 20,
    },
});
