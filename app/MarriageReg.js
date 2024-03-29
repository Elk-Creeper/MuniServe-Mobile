import React, { useState, useEffect } from "react";
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Alert,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { StatusBar } from "expo-status-bar";
import { firebase } from "../config";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";

export default function MarriageReg() {
    const router = useRouter();

    const [uploading, setUploading] = useState(false);
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const [loadingModalVisible, setLoadingModalVisible] = useState(false);
    const [selectedHDateBirthText, setSelectedHDateBirthText] = useState("");
    const [selectedWDateBirthText, setSelectedWDateBirthText] = useState("");
    const [selectedWDateMarriageText, setSelectedWDateMarriageText] = useState("");

    const [userUid, setUserUid] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userBarangay, setUserBarangay] = useState(null);
    const [userContact, setUserContact] = useState(null);
    const [userLastName, setUserLastName] = useState(null);

    // State for time input values
    const [selectedTime, setSelectedTime] = useState(null);

    // State to control time picker visibility
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showTimePickerOptions, setShowTimePickerOptions] = useState({
        minTime: new Date(),
        maxTime: new Date(),
    });

    // Function to show time picker
    const showTimepicker = () => {
        const now = new Date();
        const startHour = 8; // 8 am
        const endHour = 16; // 4 pm

        // Set minimum and maximum allowed time
        const minTime = new Date(now);
        minTime.setHours(startHour, 0, 0, 0);

        const maxTime = new Date(now);
        maxTime.setHours(endHour, 0, 0, 0);

        setShowTimePicker(true);

        // Set the minimum and maximum time for the time picker
        setShowTimePickerOptions({
            minTime: minTime,
            maxTime: maxTime,
        });

        // If the current selected time is 12, change it to the minimum time
        if (selectedTime && selectedTime.getHours() === 12) {
            setSelectedTime(minTime);
        } else {
            setSelectedTime(selectedTime || minTime); // Set default value to minimum time
        }
    };

    // Handle time change
    const handleTimeChange = (event, selectedTime) => {
        if (selectedTime) {
            setSelectedTime(selectedTime);
            setShowTimePicker(false);
        }
    };

    //to get user identity
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
                        setUserLastName(userDoc.data().lastName);

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

    // Data add
    const [regType, setRegType] = useState("");
    const [h_fname, setH_fname] = useState("");
    const [h_mname, setH_mname] = useState("");
    const [h_lname, setH_lname] = useState("");
    const [h_age, setH_age] = useState("");
    const [h_placeBirth, setH_placeBirth] = useState("");
    const [h_sex, setH_sex] = useState("");
    const [h_citizenship, setH_citizenship] = useState("");
    const [h_residence, setH_residence] = useState("");
    const [h_religion, setH_religion] = useState("");
    const [h_civilstat, setH_civilstat] = useState("");
    const [h_fatherName, setH_fatherName] = useState("");
    const [hf_citizenship, setHf_citizenship] = useState("");
    const [h_motherName, setH_motherName] = useState("");
    const [hm_citizenship, setHm_citizenship] = useState("");
    const [h_personName, setH_personName] = useState("");
    const [h_relationship, setH_relationship] = useState("");
    const [hp_residence, setHp_residence] = useState("");

    const [w_fname, setW_fname] = useState("");
    const [w_mname, setW_mname] = useState("");
    const [w_lname, setW_lname] = useState("");
    const [w_age, setW_age] = useState("");
    const [w_placeBirth, setW_placeBirth] = useState("");
    const [w_sex, setW_sex] = useState("");
    const [w_citizenship, setW_citizenship] = useState("");
    const [w_residence, setW_residence] = useState("");
    const [w_religion, setW_religion] = useState("");
    const [w_civilstat, setW_civilstat] = useState("");
    const [w_fatherName, setW_fatherName] = useState("");
    const [wf_citizenship, setWf_citizenship] = useState("");
    const [w_motherName, setW_motherName] = useState("");
    const [wm_citizenship, setWm_citizenship] = useState("");
    const [w_personName, setW_personName] = useState("");
    const [w_relationship, setW_relationship] = useState("");
    const [wp_residence, setWp_residence] = useState("");
    const [w_placeMarriage, setW_placeMarriage] = useState("");

    const [h_dateBirth, setH_dateBirth] = useState(new Date());
    const [w_dateBirth, setW_dateBirth] = useState(new Date());
    const [w_dateMarriage, setW_dateMarriage] = useState(new Date());

    // upload media files
    const uploadMedia = async () => {
        setLoadingModalVisible(true);
        setUploading(true);

        try {
            // Validation checks
            if (
                !regType ||
                !h_fname ||
                !h_mname ||
                !h_lname ||
                !h_dateBirth ||
                !h_age ||
                !h_placeBirth ||
                !h_sex ||
                !h_citizenship ||
                !h_residence ||
                !h_religion ||
                !h_civilstat ||
                !h_fatherName ||
                !hf_citizenship ||
                !h_motherName ||
                !hm_citizenship ||
                !h_personName ||
                !h_relationship ||
                !hp_residence ||
                !w_fname ||
                !w_mname ||
                !w_lname ||
                !w_dateBirth ||
                !w_age ||
                !w_placeBirth ||
                !w_sex ||
                !w_citizenship ||
                !w_residence ||
                !w_religion ||
                !w_civilstat ||
                !w_fatherName ||
                !wf_citizenship ||
                !w_motherName ||
                !wm_citizenship ||
                !w_personName ||
                !w_relationship ||
                !wp_residence ||
                !w_placeMarriage ||
                !w_dateMarriage
            ) {
                Alert.alert("Incomplete Form", "Please fill in all required fields.");
                return;
            }

            // Validate name
            if (!/^[a-zA-Z.\s]+$/.test(h_fname) || !/^[a-zA-Z.\s]+$/.test(h_mname) || !/^[a-zA-Z.\s]+$/.test(h_lname) || !/^[a-zA-Z.\s]+$/.test(h_fatherName) || !/^[a-zA-Z.\s]+$/.test(h_motherName) || !/^[a-zA-Z.\s]+$/.test(w_fname) ||
                !/^[a-zA-Z.\s]+$/.test(w_mname) || !/^[a-zA-Z.\s]+$/.test(w_lname) || !/^[a-zA-Z.\s]+$/.test(w_fatherName) || !/^[a-zA-Z.\s]+$/.test(w_motherName) || !/^[a-zA-Z.\s]+$/.test(h_personName) || !/^[a-zA-Z.\s]+$/.test(w_personName)) {
                Alert.alert(
                    "Invalid Name",
                    "Name should only contain letters, dots, and spaces."
                );
                return;
            }

            if (!/^\d+$/.test(h_age) || !/^\d+$/.test(w_age)) {
                Alert.alert("Invalid Input", "Age should only contain numbers.");
                return;
            }

            // Store the download URL in Firestore
            const MuniServe = firebase.firestore();
            const MarriageReg = MuniServe.collection("marriage_reg");

            await MarriageReg.add({
                userUid: userUid,
                userName: userName,
                userLastName: userLastName,
                userEmail: userEmail,
                userContact: userContact,
                userBarangay: userBarangay,
                regType: regType,
                h_fname: h_fname,
                h_mname: h_mname,
                h_lname: h_lname,
                h_dateBirth: h_dateBirth,
                h_age: h_age,
                h_placeBirth: h_placeBirth,
                h_sex: h_sex,
                h_citizenship: h_citizenship,
                h_residence: h_residence,
                h_religion: h_religion,
                h_civilstat: h_civilstat,
                h_fatherName: h_fatherName,
                hf_citizenship: hf_citizenship,
                h_motherName: h_motherName,
                hm_citizenship: hm_citizenship,
                h_personName: h_personName,
                h_relationship: h_relationship,
                hp_residence: hp_residence,
                w_fname: w_fname,
                w_mname: w_mname,
                w_lname: w_lname,
                w_dateBirth: w_dateBirth,
                w_age: w_age,
                w_placeBirth: w_placeBirth,
                w_sex: w_sex,
                w_citizenship: w_citizenship,
                w_residence: w_residence,
                w_religion: w_religion,
                w_civilstat: w_civilstat,
                w_fatherName: w_fatherName,
                wf_citizenship: wf_citizenship,
                w_motherName: w_motherName,
                wm_citizenship: wm_citizenship,
                w_personName: w_personName,
                w_relationship: w_relationship,
                wp_residence: wp_residence,
                w_placeMarriage: w_placeMarriage,
                w_dateMarriage: w_dateMarriage,
                timeMarriage : selectedTime,
                status: "Pending", // Set the initial status to "Pending"
                createdAt: timestamp,
                remarks: "",
            });

            setUploading(false);
            resetForm();

            setTimeout(() => {
                if (regType === "On Time") {
                    Alert.alert("Successfully Filled", "Please prepare P50 pesos to be paid at the Treasurer's Office, and ensure you have one valid ID for claiming your document at the Civil Registrar's Office.");
                } else if (regType === "Delayed") {
                    Alert.alert("Successfully Filled", "Please prepare the specified amount for payment at the Treasurer's Office, and ensure you have one valid ID for claiming your document at the Civil Registrar's Office.");
                }

                // Hide loading indicators
                setUploading(false);
                setLoadingModalVisible(false);
            }, 100);

        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Form filling failed.");
        } finally {
            setUploading(false);
            setLoadingModalVisible(false);
        }
    };

    const resetForm = () => {
        setRegType("");
        setH_fname("");
        setH_mname("");
        setH_lname("");
        setH_dateBirth(new Date());
        setH_age("");
        setH_placeBirth("");
        setH_sex("");
        setH_citizenship("");
        setH_residence("");
        setH_religion("");
        setH_civilstat("");
        setH_fatherName("");
        setHf_citizenship("");
        setH_motherName("");
        setHm_citizenship("");
        setH_personName("");
        setH_relationship("");
        setHp_residence("");

        setW_fname("");
        setW_mname("");
        setW_lname("");
        setW_dateBirth(new Date());
        setW_age("");
        setW_placeBirth("");
        setW_sex("");
        setW_citizenship("");
        setW_residence("");
        setW_religion("");
        setW_civilstat("");
        setW_fatherName("");
        setWf_citizenship("");
        setW_motherName("");
        setWm_citizenship("");
        setW_personName("");
        setW_relationship("");
        setWp_residence("");
        setW_placeMarriage("");
        setW_dateMarriage(new Date());
        setSelectedTime(null);

        setSelectedHDateBirthText("");
        setSelectedWDateBirthText("");
        setSelectedWDateMarriageText("");
    };

    const [maxDate, setMaxDate] = useState(new Date());

    const [showHDateBirthPicker, setShowHDateBirthPicker] = useState(false);
    const [showWDateBirthPicker, setShowWDateBirthPicker] = useState(false);
    const [showWDateMarriagePicker, setShowWDateMarriagePicker] = useState(false);

    const onHDateBirthChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();

        // Set maxDate only once when the component mounts
        if (!maxDate.getTime()) {
            setMaxDate(new Date());
        }

        setShowHDateBirthPicker(Platform.OS === 'ios');
        setH_dateBirth(currentDate);
        setSelectedHDateBirthText(formatDate(currentDate));
    };

    const onWDateBirthChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();

        // Set maxDate only once when the component mounts
        if (!maxDate.getTime()) {
            setMaxDate(new Date());
        }

        setShowWDateBirthPicker(Platform.OS === 'ios');
        setW_dateBirth(currentDate);
        setSelectedWDateBirthText(formatDate(currentDate));
    };

    const onWDateMarriageChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();

        // Set maxDate only once when the component mounts
        if (!maxDate.getTime()) {
            setMaxDate(new Date());
        }

        setShowWDateMarriagePicker(Platform.OS === 'ios');
        setW_dateMarriage(currentDate);
        setSelectedWDateMarriageText(formatDate(currentDate));
    };

    const formatDate = (date) => {
        // Format the date as needed (you can customize this based on your requirements)
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
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
                        <Text style={styles.itemService_name}>Certificate of Marriage</Text>
                    </View>
                </View>

                <View style={styles.innerContainer}>
                    <Text style={styles.itemService_desc}>
                        Note: Marriage Registration must be filed within 30 days after the death.
                        The day after 30th day is considered as Delayed registration, some documents
                        are required to be submitted and you need to fill out the affidavit personally.
                    </Text>
                </View>

                <Text style={styles.feesNote}>
                    LOCAL CIVIL REGISTRY FEES:
                </Text>

                <Text style={styles.feesDesc}>
                    P50.00 - For On Time Registration
                    {"\n"}{"\n"}
                    Additional P17.00 - For Delayed Registration of Document for every year of delay.
                </Text>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>Type of Registration</Text>

                    <View style={styles.placeholder}>
                        <Picker
                            selectedValue={regType}
                            onValueChange={(itemValue, itemIndex) => setRegType(itemValue)}
                            style={{ width: "100%" }}
                        >
                            <Picker.Item label="Select" value="" />
                            <Picker.Item label="On Time" value="On Time" />
                            <Picker.Item label="Delayed" value="Delayed" />
                        </Picker>
                    </View>
                </View>

                <Text style={styles.noteText}>
                    Please be ready to supply the following information. Fill the form
                    below:
                </Text>

                <Text style={styles.noteText1}>Husband</Text>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>FIRST NAME</Text>

                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={h_fname}
                            onChangeText={(h_fname) => setH_fname(h_fname)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>MIDDLE NAME</Text>

                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={h_mname}
                            onChangeText={(h_mname) => setH_mname(h_mname)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>LAST NAME</Text>

                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={h_lname}
                            onChangeText={(h_lname) => setH_lname(h_lname)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={styles.boxContainer}>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={styles.label}>DATE OF BIRTH</Text>

                        <TouchableOpacity
                            onPress={() => setShowHDateBirthPicker(true)} // for DATE OF BIRTH
                            style={styles.placeholder2}
                        >
                            <Text>{selectedHDateBirthText}</Text>
                        </TouchableOpacity>

                        {showHDateBirthPicker && (
                            <DateTimePicker
                                value={h_dateBirth}
                                mode="date"
                                display="default"
                                onChange={onHDateBirthChange}
                                maximumDate={maxDate}
                            />
                        )}
                    </View>

                    <View style={{ marginBottom: 10 }}>
                        <Text style={styles.label}>AGE</Text>

                        <View style={styles.placeholder2}>
                            <TextInput
                                placeholder=""
                                maxLength={3}
                                keyboardType="number-pad"
                                value={h_age}
                                onChangeText={(h_age) => setH_age(h_age)}
                                style={{
                                    width: "100%",
                                }}
                            ></TextInput>
                        </View>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>PLACE OF BIRTH</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={h_placeBirth}
                            onChangeText={(h_placeBirth) => setH_placeBirth(h_placeBirth)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>


                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>SEX</Text>

                    <View style={styles.placeholder}>
                        <Picker
                            selectedValue={h_sex}
                            onValueChange={(itemValue, itemIndex) => setH_sex(itemValue)}
                            style={{ width: "100%" }}
                        >
                            <Picker.Item label="Select" value="" />
                            <Picker.Item label="Male" value="Male" />
                            <Picker.Item label="Female" value="Female" />
                        </Picker>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>CITIZENSHIP</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={h_citizenship}
                            onChangeText={(h_citizenship) => setH_citizenship(h_citizenship)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>RESIDENCE (brgy, municipality, province, country)</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={100}
                            value={h_residence}
                            onChangeText={(h_residence) => setH_residence(h_residence)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={styles.boxContainer}>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={styles.label}>RELIGION</Text>

                        <View style={styles.placeholder2}>
                            <Picker
                                selectedValue={h_religion}
                                onValueChange={(itemValue, itemIndex) => setH_religion(itemValue)}
                                style={{ width: "100%" }}
                            >
                                <Picker.Item label="Select" value="" />
                                <Picker.Item label="Roman Catholic" value="Roman Catholic" />
                                <Picker.Item label="INC" value="INC" />
                                <Picker.Item label="Christian" value="Christian" />
                                <Picker.Item
                                    label="7th Day Adventist"
                                    value="7th Day Adventist"
                                />
                            </Picker>
                        </View>
                    </View>

                    <View style={{ marginBottom: 10 }}>
                        <Text style={styles.label}>CIVIL STATUS</Text>

                        <View style={styles.placeholder2}>
                            <Picker
                                selectedValue={h_civilstat}
                                onValueChange={(itemValue, itemIndex) =>
                                    setH_civilstat(itemValue)
                                }
                                style={{ width: "100%" }}
                            >
                                <Picker.Item label="Select" value="" />
                                <Picker.Item label="Single" value="Single" />
                                <Picker.Item label="Married" value="Married" />
                                <Picker.Item label="Divorced" value="Divorced" />
                                <Picker.Item label="Separated" value="Separated" />
                                <Picker.Item label="Widowed" value="Widowed" />
                            </Picker>
                        </View>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>NAME OF FATHER (first, middle, last)</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={h_fatherName}
                            onChangeText={(h_fatherName) => setH_fatherName(h_fatherName)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>CITIZENSHIP</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={hf_citizenship}
                            onChangeText={(hf_citizenship) => setHf_citizenship(hf_citizenship)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>MAIDEN NAME OF MOTHER (first, middle, last)</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={h_motherName}
                            onChangeText={(h_motherName) => setH_motherName(h_motherName)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>CITIZENSHIP</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={hm_citizenship}
                            onChangeText={(hm_citizenship) => setHm_citizenship(hm_citizenship)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>
                        NAME OF A PERSON/WHO GAVE CONSENT OR ADVISE (first, middle, last)
                    </Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={h_personName}
                            onChangeText={(h_personName) => setH_personName(h_personName)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>RELATIONSHIP</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={h_relationship}
                            onChangeText={(h_relationship) => setH_relationship(h_relationship)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>RESIDENCE (brgy, municipality, province, country)</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={hp_residence}
                            onChangeText={(hp_residence) => setHp_residence(hp_residence)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <Text style={styles.noteText1}>Wife</Text>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>FIRST NAME</Text>

                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={w_fname}
                            onChangeText={(w_fname) => setW_fname(w_fname)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>MIDDLE NAME</Text>

                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={w_mname}
                            onChangeText={(w_mname) => setW_mname(w_mname)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>LAST NAME</Text>

                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={w_lname}
                            onChangeText={(w_lname) => setW_lname(w_lname)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={styles.boxContainer}>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={styles.label}>DATE OF BIRTH</Text>

                        <TouchableOpacity
                            onPress={() => setShowWDateBirthPicker(true)} // for Date of Birth
                            style={styles.placeholder2}
                        >
                            <Text>{selectedWDateBirthText}</Text>
                        </TouchableOpacity>

                        {showWDateBirthPicker && (
                            <DateTimePicker
                                value={w_dateBirth}
                                mode="date"
                                display="default"
                                onChange={onWDateBirthChange}
                                maximumDate={maxDate}
                            />
                        )}
                    </View>

                    <View style={{ marginBottom: 10 }}>
                        <Text style={styles.label}>AGE</Text>

                        <View style={styles.placeholder2}>
                            <TextInput
                                placeholder=""
                                maxLength={3}
                                keyboardType="number-pad"
                                value={w_age}
                                onChangeText={(w_age) => setW_age(w_age)}
                                style={{
                                    width: "100%",
                                }}
                            ></TextInput>
                        </View>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>PLACE OF BIRTH</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={w_placeBirth}
                            onChangeText={(w_placeBirth) => setW_placeBirth(w_placeBirth)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>


                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>SEX</Text>

                    <View style={styles.placeholder}>
                        <Picker
                            selectedValue={w_sex}
                            onValueChange={(itemValue, itemIndex) => setW_sex(itemValue)}
                            style={{ width: "100%" }}
                        >
                            <Picker.Item label="Select" value="" />
                            <Picker.Item label="Male" value="Male" />
                            <Picker.Item label="Female" value="Female" />
                        </Picker>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>CITIZENSHIP</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={w_citizenship}
                            onChangeText={(w_citizenship) => setW_citizenship(w_citizenship)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>RESIDENCE (brgy, municipality, province, country)</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={w_residence}
                            onChangeText={(w_residence) => setW_residence(w_residence)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={styles.boxContainer}>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={styles.label}>RELIGION</Text>

                        <View style={styles.placeholder2}>
                            <Picker
                                selectedValue={w_religion}
                                onValueChange={(itemValue, itemIndex) => setW_religion(itemValue)}
                                style={{ width: "100%" }}
                            >
                                <Picker.Item label="Select" value="" />
                                <Picker.Item label="Roman Catholic" value="Roman Catholic" />
                                <Picker.Item label="INC" value="INC" />
                                <Picker.Item label="Christian" value="Christian" />
                                <Picker.Item
                                    label="7th Day Adventist"
                                    value="7th Day Adventist"
                                />
                            </Picker>
                        </View>
                    </View>

                    <View style={{ marginBottom: 10 }}>
                        <Text style={styles.label}>CIVIL STATUS</Text>

                        <View style={styles.placeholder2}>
                            <Picker
                                selectedValue={w_civilstat}
                                onValueChange={(itemValue, itemIndex) =>
                                    setW_civilstat(itemValue)
                                }
                                style={{ width: "100%" }}
                            >
                                <Picker.Item label="Select" value="" />
                                <Picker.Item label="Single" value="Single" />
                                <Picker.Item label="Married" value="Married" />
                                <Picker.Item label="Divorced" value="Divorced" />
                                <Picker.Item label="Separated" value="Separated" />
                                <Picker.Item label="Widowed" value="Widowed" />
                            </Picker>
                        </View>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>NAME OF FATHER (first, middle, last)</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={w_fatherName}
                            onChangeText={(w_fatherName) => setW_fatherName(w_fatherName)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>CITIZENSHIP</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={wf_citizenship}
                            onChangeText={(wf_citizenship) => setWf_citizenship(wf_citizenship)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>MAIDEN NAME OF MOTHER (first, middle, last)</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={w_motherName}
                            onChangeText={(w_motherName) => setW_motherName(w_motherName)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>CITIZENSHIP</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={wm_citizenship}
                            onChangeText={(wm_citizenship) => setWm_citizenship(wm_citizenship)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>
                        NAME OF A PERSON/WHO GAVE CONSENT OR ADVISE (first, middle, last)
                    </Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={w_personName}
                            onChangeText={(w_personName) => setW_personName(w_personName)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>RELATIONSHIP</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={w_relationship}
                            onChangeText={(w_relationship) => setW_relationship(w_relationship)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>RESIDENCE (brgy, municipality, province, country)</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={wp_residence}
                            onChangeText={(wp_residence) => setWp_residence(wp_residence)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>PLACE OF MARRIAGE</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={100}
                            value={w_placeMarriage}
                            onChangeText={(w_placeMarriage) => setW_placeMarriage(w_placeMarriage)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>DATE OF MARRIAGE</Text>

                    <TouchableOpacity
                        onPress={() => setShowWDateMarriagePicker(true)}
                        style={styles.placeholder}
                    >
                        <Text>{selectedWDateMarriageText}</Text>
                    </TouchableOpacity>

                    {showWDateMarriagePicker && (
                        <DateTimePicker
                            value={w_dateMarriage}
                            mode="date"
                            display="default"
                            onChange={onWDateMarriageChange}
                            maximumDate={maxDate}
                        />
                    )}
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>TIME OF MARRIAGE</Text>                
                <View style={styles.inputContainer}>
                    <FontAwesome
                        name="clock-o"
                        size={20}
                        color="#aaa"
                        style={styles.icon}
                    />
                    <TextInput
                        placeholder="Choose Time"
                        placeholderTextColor="black"
                        style={styles.input}
                        value={selectedTime ? selectedTime.toLocaleTimeString() : ""}
                        onFocus={showTimepicker}
                    />
                    {showTimePicker && (
                        <DateTimePicker
                            value={selectedTime}
                            mode="time"
                            is24Hour={true}
                            display="default"
                            onChange={handleTimeChange}
                        />
                    )}
                </View>
                </View>

                <View style={styles.imageContainer}>
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
        backgroundColor: "#FFFFFF",
        flexGrow: 1,
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
    boxes1: {
        width: "100%",
        height: 65,
        backgroundColor: "#307A59",
        borderRadius: 15,
        marginBottom: 15,
        marginTop: 15,
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
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 10,
        height: 50,
    },
    icon: {
        marginRight: 10,
        color: "#000", // Change the color to match your design
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
        fontSize: 16,
        textAlign: "justify",
        lineHeight: 30,
        fontWeight: '400',
        marginBottom: 30
    },
    imageContainer: {
        marginTop: 20,
        alignItems: "center",
    },
    noteText: {
        fontSize: 17,
        textAlign: "justify",
        marginTop: 5,
        marginBottom: 5,
        fontWeight: "500",
    },
    noteText1: {
        fontSize: 20,
        textAlign: "center",
        marginTop: 5,
        marginBottom: 5,
        fontWeight: "600",
    },
    boxContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
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
        justifyContent: "center",
        paddingLeft: 10,
    },
    placeholder2: {
        width: 150,
        height: 48,
        borderColor: "black",
        borderRadius: 8,
        borderWidth: 1,
        justifyContent: "center",
        paddingLeft: 10,
    },
    label: {
        fontSize: 15,
        fontWeight: "400",
        marginVertical: 8,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    feesNote: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
    },
    feesDesc: {
        fontSize: 16,
        marginBottom: 15,
    },
});