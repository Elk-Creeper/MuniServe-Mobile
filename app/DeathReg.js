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
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { StatusBar } from "expo-status-bar";
import { firebase } from "../config";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";

export default function DeathReg() {
    const router = useRouter();

    const [uploading, setUploading] = useState(false);
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const [loadingModalVisible, setLoadingModalVisible] = useState(false);
    const [selectedDateDeathText, setSelectedDateDeathText] = useState("");
    const [selectedDateBirthText, setSelectedDateBirthText] = useState("");

    const [userUid, setUserUid] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userBarangay, setUserBarangay] = useState(null);
    const [userContact, setUserContact] = useState(null);
    const [userLastName, setUserLastName] = useState(null);

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
    const [name, setName] = useState("");
    const [sex, setSex] = useState("");
    const [dateDeath, setDateDeath] = useState(new Date());
    const [dateBirth, setDateBirth] = useState(new Date());
    const [age, setAge] = useState("");
    const [place, setPlace] = useState("");
    const [civilstat, setCivilstat] = useState("");
    const [religion, setReligion] = useState("");
    const [citizenship, setCitizenship] = useState("");
    const [residence, setResidence] = useState("");
    const [occupation, setOccupation] = useState("");
    const [fatherName, setFatherName] = useState("");
    const [motherName, setMotherName] = useState("");
    const [ageOfMom, setAgeOfMom] = useState("");
    const [metOfDelivery, setMetOfDelivery] = useState("");
    const [lenOfPreg, setLenOfPreg] = useState("");
    const [typeOfBirth, setTypeOfBirth] = useState("");
    const [orderChild, setOrderChild] = useState("");
    const [causeOfDeath, setCauseOfDeath] = useState("");
    const [maternalCondi, setMaternalCondi] = useState("");
    const [mannerDeath, setMannerDeath] = useState("");
    const [externalCause, setExternalCause] = useState("");
    const [autopsy, setAutopsy] = useState("");
    const [attendant, setAttendant] = useState("");
    const [corpseDis, setCorpseDis] = useState("");
    const [addOfCemetery, setAddOfCemetery] = useState("");
    const [forChild, setForChild] = useState("");

    // upload media files
    const uploadMedia = async () => {
        setLoadingModalVisible(true);
        setUploading(true);

        try {
            // Validation checks
            if (
                !regType ||
                !name ||
                !sex ||
                !dateDeath ||
                !dateBirth ||
                !age ||
                !place ||
                !civilstat ||
                !religion ||
                !citizenship ||
                !forChild ||
                !residence ||
                !occupation ||
                !fatherName ||
                !motherName ||
                !causeOfDeath ||
                !maternalCondi ||
                !mannerDeath ||
                !externalCause ||
                !autopsy ||
                !attendant ||
                !corpseDis ||
                !addOfCemetery
            ) {
                Alert.alert("Incomplete Form", "Please fill in all required fields.");
                return;
            }

            // Check forChild field
            if (forChild === "yes") {
                // Validation for child-reDelayedd fields when forChild is "yes"
                if (!ageOfMom || !lenOfPreg || !metOfDelivery || !orderChild || !typeOfBirth) {
                    Alert.alert("Incomplete Child Information", "Please fill in all required child-reDelayedd fields.");
                    return;
                }
            }

            // Validate name
            if (!/^[a-zA-Z.\s]+$/.test(name) || !/^[a-zA-Z.\s]+$/.test(motherName) || !/^[a-zA-Z.\s]+$/.test(fatherName)) {
                Alert.alert(
                    "Invalid Name",
                    "Name should only contain letters, dots, and spaces."
                );
                return;
            }

            if (!/^\d+$/.test(age)) {
                Alert.alert("Invalid Input", "Age should only contain numbers.");
                return;
            }

            // Store the download URL in Firestore
            const MuniServe = firebase.firestore();
            const deathreg = MuniServe.collection("death_reg");

            await deathreg.add({
                userUid: userUid,
                userName: userName,
                userLastName: userLastName,
                userEmail: userEmail,
                userContact: userContact,
                userBarangay: userBarangay,
                regType: regType,
                name: name,
                sex: sex,
                dateDeath: dateDeath,
                dateBirth: dateBirth,
                age: age,
                place: place,
                civilstat: civilstat,
                religion: religion,
                citizenship: citizenship,
                residence: residence,
                occupation: occupation,
                fatherName: fatherName,
                motherName: motherName,
                ageOfMom: ageOfMom,
                metOfDelivery: metOfDelivery,
                lenOfPreg: lenOfPreg,
                typeOfBirth: typeOfBirth,
                orderChild: orderChild,
                causeOfDeath: causeOfDeath,
                maternalCondi: maternalCondi,
                mannerDeath: mannerDeath,
                externalCause: externalCause,
                autopsy: autopsy,
                attendant: attendant,
                corpseDis: corpseDis,
                addOfCemetery: addOfCemetery,
                forChild: forChild,
                status: "Pending",
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
        setName("");
        setSex("");
        setDateDeath(new Date());
        setDateBirth(new Date());
        setAge("");
        setPlace("");
        setCivilstat("");
        setReligion("");
        setCitizenship("");
        setResidence("");
        setOccupation("");
        setFatherName("");
        setMotherName("");
        setAgeOfMom("");
        setMetOfDelivery("");
        setLenOfPreg("");
        setTypeOfBirth("");
        setOrderChild("");
        setCauseOfDeath("");
        setMaternalCondi("");
        setMannerDeath("");
        setExternalCause("");
        setCorpseDis("");
        setAddOfCemetery("");
        setAutopsy("");
        setAttendant("");
        setForChild("");

        // Reset date reDelayedd states
        setSelectedDateBirthText("");
        setSelectedDateDeathText("");

    };

    const [maxDate, setMaxDate] = useState(new Date());

    const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
    const [showDeathDatePicker, setShowDeathDatePicker] = useState(false);

    const onBirthDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();

        // Set maxDate only once when the component mounts
        if (!maxDate.getTime()) {
            setMaxDate(new Date());
        }

        setShowBirthDatePicker(Platform.OS === 'ios');
        setDateBirth(currentDate);
        setSelectedDateBirthText(formatDate(currentDate));
    };

    const onDeathDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();

        // Set maxDate only once when the component mounts
        if (!maxDate.getTime()) {
            setMaxDate(new Date());
        }

        setShowDeathDatePicker(Platform.OS === 'ios');
        setDateDeath(currentDate);
        setSelectedDateDeathText(formatDate(currentDate));
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
                        <Text style={styles.itemService_name}>Death Registration</Text>
                    </View>
                </View>
                <View style={styles.innerContainer}>
                    <Text style={styles.itemService_desc}>
                        Note: Death Registration must be filed within 30 days after the death.
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
                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>NAME</Text>

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

                <View style={styles.boxContainer}>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={styles.label}>SEX</Text>

                        <View style={styles.placeholder2}>
                            <Picker
                                selectedValue={sex}
                                onValueChange={(itemValue, itemIndex) => setSex(itemValue)}
                                style={{ width: "100%" }}
                            >
                                <Picker.Item label="Select" value="" />
                                <Picker.Item label="Male" value="Male" />
                                <Picker.Item label="Female" value="Female" />
                            </Picker>
                        </View>
                    </View>

                    <View style={{ marginBottom: 10 }}>
                        <Text style={styles.label}>DATE OF DEATH</Text>

                        <TouchableOpacity
                            onPress={() => setShowDeathDatePicker(true)}
                            style={styles.placeholder2}
                        >
                            <Text>{selectedDateDeathText}</Text>
                        </TouchableOpacity>

                        {showDeathDatePicker && (
                            <DateTimePicker
                                value={dateDeath}
                                mode="date"
                                display="default"
                                onChange={onDeathDateChange}
                                maximumDate={maxDate}
                            />
                        )}
                    </View>
                </View>

                <View style={styles.boxContainer}>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={styles.label}>
                            DATE OF BIRTH
                        </Text>

                        <TouchableOpacity
                            onPress={() => setShowBirthDatePicker(true)}
                            style={styles.placeholder2}
                        >
                            <Text>{selectedDateBirthText}</Text>
                        </TouchableOpacity>

                        {showBirthDatePicker && (
                            <DateTimePicker
                                value={dateBirth}
                                mode="date"
                                display="default"
                                onChange={onBirthDateChange}
                                maximumDate={maxDate}
                            />
                        )}
                    </View>

                    <View style={{ marginBottom: 10 }}>
                        <Text style={styles.label}>AGE AT DEATH</Text>

                        <View style={styles.placeholder2}>
                            <TextInput
                                placeholder=""
                                maxLength={3}
                                value={age}
                                onChangeText={(age) => setAge(age)}
                                keyboardType="number-pad"
                                style={{
                                    width: "100%",
                                }}
                            ></TextInput>
                        </View>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>PLACE OF DEATH</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={place}
                            onChangeText={(place) => setPlace(place)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={styles.boxContainer}>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={styles.label}>CIVIL STATUS</Text>

                        <View style={styles.placeholder2}>
                            <Picker
                                selectedValue={civilstat}
                                onValueChange={(itemValue, itemIndex) =>
                                    setCivilstat(itemValue)
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

                    <View style={{ marginBottom: 10 }}>
                        <Text style={styles.label}>RELIGION</Text>

                        <View style={styles.placeholder2}>
                            <Picker
                                selectedValue={religion}
                                onValueChange={(itemValue, itemIndex) => setReligion(itemValue)}
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
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>CITIZENSHIP</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={citizenship}
                            onChangeText={(citizenship) => setCitizenship(citizenship)}
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
                            value={residence}
                            onChangeText={(residence) => setResidence(residence)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>OCCUPATION</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={occupation}
                            onChangeText={(occupation) => setOccupation(occupation)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>NAME OF FATHER (first, middle, last)</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={fatherName}
                            onChangeText={(fatherName) => setFatherName(fatherName)}
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
                            value={motherName}
                            onChangeText={(motherName) => setMotherName(motherName)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <Text style={styles.noteText}>MEDICAL CERTIFICATE</Text>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>Does the deceased aged 0 to 7</Text>

                    <View style={styles.placeholder}>
                        <Picker
                            selectedValue={forChild}
                            onValueChange={(itemValue, itemIndex) => setForChild(itemValue)}
                            style={{ width: "100%" }}
                        >
                            <Picker.Item label="Select" value="" />
                            <Picker.Item label="Yes" value="Yes" />
                            <Picker.Item label="No" value="No" />
                        </Picker>
                    </View>
                </View>

                {forChild !== 'No' && (
                    <View style={{ marginBottom: 10 }}>
                        <Text style={styles.noteText}>FOR CHILDREN AGED 0 TO 7 DAYS</Text>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.label}>AGE OF MOTHER</Text>
                            <View style={styles.placeholder}>
                                <TextInput
                                    placeholder=""
                                    maxLength={2}
                                    value={ageOfMom}
                                    keyboardType="number-pad"
                                    onChangeText={(ageOfMom) => setAgeOfMom(ageOfMom)}
                                    style={{
                                        width: "100%",
                                    }}
                                ></TextInput>
                            </View>
                        </View>

                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.label}>METHOD OF BIRTH</Text>

                            <View style={styles.placeholder}>
                                <Picker
                                    selectedValue={metOfDelivery}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setMetOfDelivery(itemValue)
                                    }
                                    style={{ width: "100%" }}
                                >
                                    <Picker.Item label="Select" value="" />
                                    <Picker.Item label="Vaginal Delivery" value="Vaginal Delivery" />
                                    <Picker.Item label="Caesarean Section" value="Caesarean Section" />
                                    <Picker.Item label="Assisted Vaginal Delivery" value="Assisted Vaginal Delivery" />
                                </Picker>
                            </View>
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.label}>LENGTH OF PREGNANCY</Text>
                            <View style={styles.placeholder}>
                                <TextInput
                                    placeholder=""
                                    maxLength={50}
                                    value={lenOfPreg}
                                    onChangeText={(lenOfPreg) => setLenOfPreg(lenOfPreg)}
                                    style={{
                                        width: "100%",
                                    }}
                                ></TextInput>
                            </View>
                        </View>

                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.label}>TYPE OF BIRTH</Text>

                            <View style={styles.placeholder}>
                                <Picker
                                    selectedValue={typeOfBirth}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setTypeOfBirth(itemValue)
                                    }
                                    style={{ width: "100%" }}
                                >
                                    <Picker.Item label="Select" value="" />
                                    <Picker.Item label="Single" value="Single" />
                                    <Picker.Item label="Twin" value="Twin" />
                                    <Picker.Item label="Triplet" value="Triplet" />
                                </Picker>
                            </View>
                        </View>

                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.label}>IF MULTIPLE BIRTH, CHILD WAS</Text>
                            <View style={styles.placeholder}>
                                <Picker
                                    selectedValue={orderChild}
                                    onValueChange={(itemValue, itemIndex) => setOrderChild(itemValue)}
                                    style={{ width: "100%" }}
                                >
                                    <Picker.Item label="Select" value="" />
                                    <Picker.Item label="1st" value="1st" />
                                    <Picker.Item label="2nd" value="2nd" />
                                    <Picker.Item label="3rd" value="3rd" />
                                    <Picker.Item label="4th" value="4th" />
                                    <Picker.Item label="5th" value="5th" />
                                    <Picker.Item label="6th" value="6th" />
                                    <Picker.Item label="7th" value="7th" />
                                    <Picker.Item label="8th" value="8th" />
                                    <Picker.Item label="9th" value="9th" />
                                    <Picker.Item label="10th" value="10th" />
                                </Picker>
                            </View>
                        </View>
                    </View>
                )}

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>CAUSE OF DEATH</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={causeOfDeath}
                            onChangeText={(causeOfDeath) => setCauseOfDeath(causeOfDeath)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>
                        MATERNAL CONDITION (if the deceased is female aged 15-49 years old)
                    </Text>
                    <View style={styles.placeholder}>
                        <Picker
                            selectedValue={maternalCondi}
                            onValueChange={(itemValue, itemIndex) =>
                                setMaternalCondi(itemValue)
                            }
                            style={{ width: "100%" }}
                        >
                            <Picker.Item label="Select" value="" />
                            <Picker.Item
                                label="Pregnant, not in labour"
                                value="Pregnant, not in labour"
                            />
                            <Picker.Item
                                label="Pregnant, in labour"
                                value="Pregnant, in labour"
                            />
                            <Picker.Item
                                label="Less than 42 days after delivery"
                                value="Less than 42 days after delivery"
                            />
                            <Picker.Item
                                label="42 days to 1 year after delivery"
                                value="42 days to 1 year after delivery"
                            />
                            <Picker.Item
                                label="None of the choices"
                                value="None of the choices"
                            />
                        </Picker>
                    </View>
                </View>

                <Text style={styles.noteText}>DEATH BY EXTERNAL CAUSES</Text>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>A: MANNER OF DEATH (homicide, suicide, accident, etc)</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={mannerDeath}
                            onChangeText={(mannerDeath) => setMannerDeath(mannerDeath)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>B: PLACE OF OCCURRENCE OF EXTERNAL CAUSE (e.g. home, farm, street, sea, etc)</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={externalCause}
                            onChangeText={(externalCause) => setExternalCause(externalCause)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>AUTOPSY</Text>

                    <View style={styles.placeholder}>
                        <Picker
                            selectedValue={autopsy}
                            onValueChange={(itemValue, itemIndex) =>
                                setAutopsy(itemValue)
                            }
                            style={{ width: "100%" }}
                        >
                            <Picker.Item label="Select" value="" />
                            <Picker.Item label="Yes" value="Yes" />
                            <Picker.Item label="No" value="No" />
                        </Picker>
                    </View>
                </View>


                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>ATTENDANT</Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={50}
                            value={attendant}
                            onChangeText={(attendant) => setAttendant(attendant)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>CORPSE DISPOSAL</Text>

                    <View style={styles.placeholder}>
                        <Picker
                            selectedValue={corpseDis}
                            onValueChange={(itemValue, itemIndex) => setCorpseDis(itemValue)}
                            style={{ width: "100%" }}
                        >
                            <Picker.Item label="Select" value="" />
                            <Picker.Item label="Burial" value="Burial" />
                            <Picker.Item label="Cremation" value="Cremation" />
                        </Picker>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>
                        NAME AND ADDRESS OF CEMETARY OR CREMATORY
                    </Text>
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder=""
                            maxLength={100}
                            value={addOfCemetery}
                            onChangeText={(addOfCemetery) => setAddOfCemetery(addOfCemetery)}
                            style={{
                                width: "100%",
                            }}
                        ></TextInput>
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
        fontWeight: '400'
    },
    imageContainer: {
        marginTop: 20,
        alignItems: "center",
    },
    noteText: {
        fontSize: 17,
        textAlign: "center",
        marginTop: 5,
        marginBottom: 5,
        fontWeight: "500",
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
        alignItems: "center",
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
