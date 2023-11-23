import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Animated,ScrollView,FlatList,Pressable,Alert,TextInput, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { firebase } from "../config";
import * as FileSystem from "expo-file-system";

export default function tab4() {
    const [selectedBusinessType, setSelectedBusinessType] = useState(null);
    const [businessName, setBusinessName] = useState("");
    const [barangayImages, setBarangayImages] = useState([]);
    const [registrationImages, setRegistrationImages] = useState([]);
    const [contractImages, setContractImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loadingModalVisible, setLoadingModalVisible] = useState(false);

    const [selectedApplicationType, setSelectedApplicationType] = useState(null);
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    
    const fadeAnimation = useRef(new Animated.Value(1)).current;
    const colorAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // If an image is selected, start the fade-out animation
        if (barangayImages.length > 0 && registrationImages.length > 0 && contractImages.length > 0) {
            Animated.timing(fadeAnimation, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    }, [barangayImages, registrationImages, contractImages, fadeAnimation]);

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
                if (category === "barangay") {
                    setBarangayImages([...barangayImages, ...result.assets.map((asset) => asset.uri)]);
                } else if (category === "registration") {
                    setRegistrationImages([...registrationImages, ...result.assets.map((asset) => asset.uri)]);
                }
                else if (category === "contract") {
                    setContractImages([...contractImages, ...result.assets.map((asset) => asset.uri)]);
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

    const removeImage = (category, index) => {
        if (category === "barangay") {
            const newImages = [...barangayImages];
            newImages.splice(index, 1);
            setBarangayImages(newImages);
        } else if (category === "registration") {
            const newImages = [...registrationImages];
            newImages.splice(index, 1);
            setRegistrationImages(newImages);
        }
        else if (category === "contract") {
            const newImages = [...contractImages];
            newImages.splice(index, 1);
            setContractImages(newImages);
        }
    };

    const uploadMedia = async () => {
        setLoadingModalVisible(true); // Show loading modal
        setUploading(true);

        try {
            const imageURLs = {
                barangayImages: [],
                registrationImages: [],
                contractImages: [],
            };

            // Loop through the selected images and upload each one
            for (const uri of barangayImages) {
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
                imageURLs.barangayImages.push(downloadURL);
            }

            for (const uri of registrationImages) {
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
                imageURLs.registrationImages.push(downloadURL);
            }

            for (const uri of contractImages) {
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
                imageURLs.contractImages.push(downloadURL);
            }

            // Store the data in Firestore
            const docRef = await firebase.firestore().collection("businessPermit").add({
                typeOfApplication: selectedApplicationType,
                typeOfBusiness: selectedBusinessType,
                businessName: businessName,
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
            setSelectedBusinessType(null);
            setBusinessName("");
            setBarangayImages([]);
            setRegistrationImages([]);
            setContractImages([]);
            resetForm();
        } catch (error) {
            // Show an error alert
            Alert.alert(
                "Error",
                "There was an error uploading images. Please try again.",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
            );
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
                                    <Text style={styles.itemService_name}>
                                        Business Permit
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.innerContainer}>
                                <Text style={styles.itemService_desc}>
                        A legal document that offers proof of compliance with certain city or state laws regulating structural appearances and safety as well as the sale of products. Business permits regulate safety, structure and appearance of the business community. They act as proof that your business follows certain laws and ordinances. Requirements vary by jurisdiction, and failure to comply often results in fines or even having your business shut down. Research the permits you need before you start any work, setup or property purchase. That way, you can make sure compliance is in order and avoid the additional expenses and delays of fixing things later.  This annual BOSS gathers under one roof all the government agencies to set up desks for permits or clearances needed to renew and apply for a business permit.  
                                </Text>
                            </View>
                        

                <Text style={styles.noteText}>
                    Direction: Select the application type then fill up the information needed.
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
                        <Image
                            source={require("../assets/imported/form.png")}
                            style={styles.form}
                        />
                        <Text style={styles.selectionText}>
                            New Applications
                        </Text>
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
                        <Image
                            source={require("../assets/imported/form.png")}
                            style={styles.form}
                        />
                        <Text style={styles.selectionText}>
                            Renewal of Permit
                        </Text>
                    </TouchableOpacity>

                </View>

                {selectedApplicationType === 'new' && (
                    <>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.label}>
                                Type of Business
                            </Text>

                            <View style={styles.placeholder}>
                                <TextInput
                                    placeholder=""
                                    value={selectedBusinessType}
                                    onChangeText={(selectedBusinessType) => setSelectedBusinessType(selectedBusinessType)}
                                    maxLength={100}
                                    style={{
                                        width: "100%",
                                    }}
                                ></TextInput>
                            </View>
                        </View>

                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.label}>
                                Business Name
                            </Text>

                            <View style={styles.placeholder}>
                                <TextInput
                                    placeholder=""
                                    value={businessName}
                                    onChangeText={(businessName) => setBusinessName(businessName)}
                                    maxLength={100}
                                    style={{
                                        width: "100%",
                                    }}
                                ></TextInput>
                            </View>
                        </View>

                        <Text style={styles.noteText}>
                            Note: Upload the requirements needed before submitting your
                            application. Lack of needed information will cause delay or
                            rejection.
                        </Text>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>Barangay Business Clerance</Text>
                            <TouchableOpacity onPress={() => pickImage("barangay")}>
                                {barangayImages.length > 0 ? (
                                    <Animated.View
                                        style={{
                                            ...styles.plusCircle,
                                            opacity: fadeAnimation,
                                        }}
                                    >
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {barangayImages.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={barangayImages}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image source={{ uri: item }} style={styles.uploadedImage} />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("barangay", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>


                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>Proof of Registration</Text>
                            <TouchableOpacity onPress={() => pickImage("registration")}>
                                {registrationImages.length > 0 ? (
                                    <Animated.View
                                        style={{
                                            ...styles.plusCircle,
                                            opacity: fadeAnimation,
                                        }}
                                    >
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {registrationImages.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={registrationImages}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image source={{ uri: item }} style={styles.uploadedImage} />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("registration", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>Contract of lease</Text>
                            <TouchableOpacity onPress={() => pickImage("contract")}>
                                {contractImages.length > 0 ? (
                                    <Animated.View
                                        style={{
                                            ...styles.plusCircle,
                                            opacity: fadeAnimation,
                                        }}
                                    >
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {contractImages.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={contractImages}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image source={{ uri: item }} style={styles.uploadedImage} />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("contract", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                    </>
                )}

                {selectedApplicationType === 'renew' && (
                    <>

                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.label}>
                                Type of Business
                            </Text>

                            <View style={styles.placeholder}>
                                <TextInput
                                    placeholder=""
                                    value={selectedBusinessType}
                                    onChangeText={(selectedBusinessType) => setSelectedBusinessType(selectedBusinessType)}
                                    maxLength={100}
                                    style={{
                                        width: "100%",
                                    }}
                                ></TextInput>
                            </View>
                        </View>

                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.label}>
                                Business Name
                            </Text>

                            <View style={styles.placeholder}>
                                <TextInput
                                    placeholder=""
                                    value={businessName}
                                    onChangeText={(businessName) => setBusinessName(businessName)}
                                    maxLength={100}
                                    style={{
                                        width: "100%",
                                    }}
                                ></TextInput>
                            </View>
                        </View>

                        <Text style={styles.noteText}>
                            Note: Upload the requirements needed before submitting your
                            application. Lack of needed information will cause delay or
                            rejection.
                        </Text>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>Barangay Business Clerance</Text>
                            <TouchableOpacity onPress={() => pickImage("barangay")}>
                                {barangayImages.length > 0 ? (
                                    <Animated.View
                                        style={{
                                            ...styles.plusCircle,
                                            opacity: fadeAnimation,
                                        }}
                                    >
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {barangayImages.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={barangayImages}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image source={{ uri: item }} style={styles.uploadedImage} />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("barangay", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>Basis for computing Taxes</Text>
                            <TouchableOpacity onPress={() => pickImage("registration")}>
                                {registrationImages.length > 0 ? (
                                    <Animated.View
                                        style={{
                                            ...styles.plusCircle,
                                            opacity: fadeAnimation,
                                        }}
                                    >
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {registrationImages.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={registrationImages}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image source={{ uri: item }} style={styles.uploadedImage} />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("registration", index)}
                                        >
                                            <Ionicons name="ios-close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.selectButton}>
                            <Text style={styles.buttonText}>Contract of lease</Text>
                            <TouchableOpacity onPress={() => pickImage("contract")}>
                                {contractImages.length > 0 ? (
                                    <Animated.View
                                        style={{
                                            ...styles.plusCircle,
                                            opacity: fadeAnimation,
                                        }}
                                    >
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </Animated.View>
                                ) : (
                                    <View style={styles.plusCircle}>
                                        <Ionicons name="ios-add" size={24} color="white" />
                                    </View>
                                )}
                                {contractImages.length > 0 && (
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="ios-checkmark" size={24} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageContainer}>
                            <FlatList
                                horizontal
                                data={contractImages}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image source={{ uri: item }} style={styles.uploadedImage} />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage("contract", index)}
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
                                    'Error',
                                    'Please choose an application type before submitting.',
                                    [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                                    { cancelable: false }
                                );
                            } else if (selectedApplicationType === 'new') {
                                // Check if any information is typed
                                if (barangayImages.length === 0 || registrationImages.length === 0 || contractImages.length === 0) {
                                    // Show an alert if any of the required fields is empty
                                    Alert.alert(
                                        'Error',
                                        'Please upload all required documents before submitting.',
                                        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                                        { cancelable: false }
                                    );
                                } else {                              
                                    uploadMedia();
                                }
                            } else if (selectedApplicationType === 'renew') {
                                // Check if any information is typed
                                if (barangayImages.length === 0 || registrationImages.length === 0 || contractImages.length === 0) {
                                    // Show an alert if any of the required fields is empty
                                    Alert.alert(
                                        'Error',
                                        'Please upload all required documents before submitting.',
                                        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                                        { cancelable: false }
                                    );
                                }
                                    uploadMedia();
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
        height: 50,
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
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'contain',
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
});