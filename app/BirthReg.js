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
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { StatusBar } from "expo-status-bar";
import { firebase } from "../config";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";

export default function BirthReg() {
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const timestamp = firebase.firestore.FieldValue.serverTimestamp();
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [selectedDateText, setSelectedDateText] = useState("");
  const [selectedDatePlaceText, setSelectedDatePlaceText] = useState("");

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
  const [attendant, setAttendant] = useState("");
  const [birthdate, setBirthdate] = useState(new Date());
  const [birthorder, setBirthorder] = useState("");
  const [birthplace, setBirthplace] = useState("");
  const [sex, setSex] = useState("");
  const [typeofbirth, setTypeofbirth] = useState("");
  const [multiple, setMultiple] = useState("");
  const [weight, setWeight] = useState("");
  const [c_fname, setC_fname] = useState("");
  const [c_mname, setC_mname] = useState("");
  const [c_lname, setC_lname] = useState("");
  const [f_age, setF_age] = useState("");
  const [f_citizenship, setF_citizenship] = useState("");
  const [f_name, setF_name] = useState("");
  const [f_occur, setF_occur] = useState("");
  const [f_residence, setF_residence] = useState("");
  const [f_religion, setF_religion] = useState("");
  const [m_age, setM_age] = useState("");
  const [m_citizenship, setM_citizenship] = useState("");
  const [m_name, setM_name] = useState("");
  const [bornAlive, setBornAlive] = useState("");
  const [childStillLiving, setChildStillLiving] = useState("");
  const [childAliveButNowDead, setChildAliveButNowDead] = useState("");
  const [m_occur, setM_occur] = useState("");
  const [m_religion, setM_religion] = useState("");
  const [m_residence, setM_residence] = useState("");
  const [marriedType, setMarriedType] = useState("");
  const [mpDate, setMpDate] = useState(new Date());
  const [mpPlace, setMpPlace] = useState("");

  // upload media files
  const uploadMedia = async () => {
    setLoadingModalVisible(true);
    setUploading(true);

    try {
      // Validation checks
      if (!regType || !c_fname || !c_mname || !c_lname || !birthdate || !birthplace || !sex || !typeofbirth || !weight ||
        !m_name || !m_citizenship || !m_religion || !bornAlive || !childStillLiving ||
        !childAliveButNowDead || !m_occur || !m_age || !m_residence || !f_name ||
        !f_citizenship || !f_religion || !f_occur || !f_age || !f_residence || !attendant) {
        Alert.alert("Incomplete Form", "Please fill in all required fields.");
        return;
      }

      // Validate child's name components
      if (!/^[a-zA-Z.\s]+$/.test(c_fname) || !/^[a-zA-Z.\s]+$/.test(c_mname) || !/^[a-zA-Z.\s]+$/.test(c_lname)) {
        Alert.alert(
          "Invalid Input",
          "Name of the newborn child should only contain letters, dots, and spaces."
        );
        return;
      }

      // Check forChild field
      if (typeofbirth !== "Single") {
        // Validation for child-related fields when forChild is "yes"
        if (!birthorder || !multiple) {
          Alert.alert("Incomplete Child Information", "Please fill in all required child-related fields.");
          return;
        }
      }

      // Validate weight field
      if (!/^\d+$/.test(weight)) {
        Alert.alert("Invalid Input", "Weight should only contain numbers.");
        return;
      }

      // Validate f_age and m_age fields
      if (!/^\d+$/.test(f_age) || !/^\d+$/.test(m_age)) {
        Alert.alert("Invalid Input", "Age should only contain numbers.");
        return;
      }

      if (!/^\d+$/.test(childAliveButNowDead) || !/^\d+$/.test(childStillLiving) || !/^\d+$/.test(bornAlive)) {
        Alert.alert("Invalid Input", "Number of Child should only contain numbers.");
        return;
      }

      // Check married field
      if (marriedType === "Yes") {
        if (!mpDate || !mpPlace) {
          Alert.alert("Incomplete Information", "Please fill in all required marriage-related fields.");
          return;
        }
      }

      // Store the download URL in Firestore
      const MuniServe = firebase.firestore();
      const birthreg = MuniServe.collection("birth_reg");

      await birthreg.add({
        userUid: userUid,
        userName: userName,
        userLastName: userLastName,
        userEmail: userEmail,
        userContact: userContact,
        userBarangay: userBarangay,
        regType: regType,
        attendant: attendant,
        birthdate: birthdate,
        birthorder: birthorder,
        birthplace: birthplace,
        sex: sex,
        typeofbirth: typeofbirth,
        c_multiple: multiple,
        c_weight: weight,
        c_fname: c_fname,
        c_mname: c_mname,
        c_lname: c_lname,
        f_age: f_age,
        f_citizenship: f_citizenship,
        f_name: f_name,
        f_occur: f_occur,
        f_religion: f_religion,
        f_residence: f_residence,
        m_age: m_age,
        m_citizenship: m_citizenship,
        m_name: m_name,
        bornAlive: bornAlive,
        childStillLiving: childStillLiving,
        childAliveButNowDead: childAliveButNowDead,
        m_occur: m_occur,
        m_religion: m_religion,
        m_residence: m_residence,
        mpDate: mpDate,
        mpPlace: mpPlace,
        status: "Pending", // Set the initial status to "Pending"
        createdAt: timestamp,
        remarks: ""
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
    setAttendant("");
    setBirthdate(new Date());
    setBirthorder("");
    setBirthplace("");
    setSex("");
    setTypeofbirth("");
    setMultiple("");
    setWeight("");
    setC_fname("");
    setC_mname("");
    setC_lname("");
    setF_age("");
    setF_citizenship("");
    setF_name("");
    setF_occur("");
    setF_religion("");
    setF_residence("");
    setM_age("");
    setM_citizenship("");
    setM_name("");
    setBornAlive("");
    setChildStillLiving("");
    setChildAliveButNowDead("");
    setM_occur("");
    setM_religion("");
    setM_residence("");
    setMarriedType("");
    setMpDate(new Date());
    setMpPlace("");

    setSelectedDateText("");
    setSelectedDatePlaceText("");
  };

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDatePlacePicker, setShowDatePlacePicker] = useState(false);

  const [maxDate, setMaxDate] = useState(new Date());

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();

    // Set maxDate only once when the component mounts
    if (!maxDate.getTime()) {
      setMaxDate(new Date());
    }

    setShowDatePicker(Platform.OS === 'ios');
    setBirthdate(currentDate);
    setSelectedDateText(formatDate(currentDate));
  };

  const onDatePlaceChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();

    // Set maxDate only once when the component mounts
    if (!maxDate.getTime()) {
      setMaxDate(new Date());
    }

    setShowDatePlacePicker(Platform.OS === 'ios');
    setMpDate(currentDate);
    setSelectedDatePlaceText(formatDate(currentDate));
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
            <Text style={styles.itemService_name}>Birth Registration</Text>
          </View>
        </View>
        <View style={styles.innerContainer}>
          <Text style={styles.itemService_desc}>
            Note: Birth Registration must be filed within 30 days after the birth.
            The day after 30th day is considered as late registration and parents who are not married, 
            are required to be submit some documents and you need to fill out the affidavit personally.
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

        <Text style={styles.noteText}>Child's Information</Text>

        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>FIRST NAME</Text>

          <View style={styles.placeholder}>
            <TextInput
              placeholder=""
              maxLength={100}
              value={c_fname}
              onChangeText={(c_fname) => setC_fname(c_fname)}
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
              maxLength={100}
              value={c_mname}
              onChangeText={(c_mname) => setC_mname(c_mname)}
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
              maxLength={100}
              value={c_lname}
              onChangeText={(c_lname) => setC_lname(c_lname)}
              style={{
                width: "100%",
              }}
            ></TextInput>
          </View>
        </View>

        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>
            DATE OF BIRTH
          </Text>

          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.placeholder}
          >
            <Text>{selectedDateText}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={birthdate}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={maxDate}
            />
          )}
        </View>

        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>PLACE OF BIRTH</Text>
          <View style={styles.placeholder}>
            <TextInput
              placeholder=""
              maxLength={200}
              value={birthplace}
              onChangeText={(birthplace) => setBirthplace(birthplace)}
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
            <Text style={styles.label}>TYPE OF BIRTH</Text>

            <View style={styles.placeholder2}>
              <Picker
                selectedValue={typeofbirth}
                onValueChange={(itemValue, itemIndex) => setTypeofbirth(itemValue)}
                style={{ width: "100%" }}
              >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="Single" value="Single" />
                <Picker.Item label="Twins" value="Twins" />
                <Picker.Item label="Triplets" value="Triplets" />
                <Picker.Item label="Quadruplets" value="Quadruplets" />
              </Picker>
            </View>
          </View>
        </View>

          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>IF MULTIPLE BIRTH, CHILD WAS</Text>

            <View style={styles.placeholder}>
              <Picker
                selectedValue={multiple}
                onValueChange={(itemValue, itemIndex) => setMultiple(itemValue)}
                style={{ width: "100%" }}
              >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="First" value="First" />
                <Picker.Item label="Second" value="Second" />
                <Picker.Item label="Third" value="Third" />
                <Picker.Item label="Fourth" value="Fourth" />
                <Picker.Item label="Fifth" value="Fifth" />
                <Picker.Item label="Not Applicable" value="Not Applicable" />
              </Picker>
            </View>

            <View style={{ marginBottom: 10 }}>
              <Text style={styles.label}>BIRTH ORDER</Text>

              <View style={styles.placeholder}>
                <Picker
                  selectedValue={birthorder}
                  onValueChange={(itemValue, itemIndex) => setBirthorder(itemValue)}
                  style={{ width: "100%" }}
                >
                  <Picker.Item label="Select" value=""/>
                  <Picker.Item label="First" value="First"/>
                  <Picker.Item label="Second" value="Second"/>
                  <Picker.Item label="Third" value="Third"/>
                  <Picker.Item label="Fourth" value="Fourth"/>
                  <Picker.Item label="Fifth" value="Fifth"/>
                </Picker>
              </View>
            </View>
          </View>

        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>WEIGHT AT BIRTH (grams)</Text>

          <View style={styles.placeholder}>
            <TextInput
              placeholder=""
              keyboardType="number-pad"
              maxLength={4}
              value={weight}
              onChangeText={(weight) => setWeight(weight)}
              style={{
                width: "100%",
              }}
            ></TextInput>
          </View>
        </View>

        <Text style={styles.noteText}>Mother's Information:</Text>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>MAIDEN NAME (first, middle, last)</Text>

          <View style={styles.placeholder}>
            <TextInput
              placeholder=""
              maxLength={50}
              value={m_name}
              onChangeText={(m_name) => setM_name(m_name)}
              style={{
                width: "100%",
              }}
            ></TextInput>
          </View>
        </View>
        <View style={styles.boxContainer}>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>CITIZENSHIP</Text>

            <View style={styles.placeholder2}>
              <TextInput
                placeholder=""
                maxLength={50}
                value={m_citizenship}
                onChangeText={(m_citizenship) =>
                  setM_citizenship(m_citizenship)
                }
                style={{
                  width: "100%",
                }}
              ></TextInput>
            </View>
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>RELIGION</Text>

            <View style={styles.placeholder2}>
              <Picker
                selectedValue={m_religion}
                onValueChange={(itemValue, itemIndex) =>
                  setM_religion(itemValue)
                }
                style={{ width: "100%" }}
              >
                <Picker.Item label="Select" value="" />
                <Picker.Item
                  label="Born Again Christian"
                  value="Born Again Christian"
                />
                <Picker.Item label="Buddhism" value="Buddhism" />
                <Picker.Item label="Hinduism" value="Hinduism" />
                <Picker.Item
                  label="Iglesia ni Cristo"
                  value="Iglesia ni Cristo"
                />
                <Picker.Item label="Islam" value="Islam" />
                <Picker.Item label="Jehovah Witness" value="Jehovah Witness" />
                <Picker.Item label="Roman Catholic" value="Roman Catholic" />
                <Picker.Item
                  label="Seventh-day Adventist"
                  value="Seventh-day Adventist"
                />
              </Picker>
            </View>
          </View>
        </View>

        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>TOTAL NUMBER OF CHILDREN BORN ALIVE</Text>

          <View style={styles.placeholder}>
            <TextInput
              placeholder=""
              maxLength={2}
              value={bornAlive}
              keyboardType="number-pad"
              onChangeText={(bornAlive) => setBornAlive(bornAlive)}
              style={{
                width: "100%",
              }}
            ></TextInput>
          </View>
        </View>

        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>NO. OF CHILDREN STILL LIVING INCLUDING THIS BIRTH</Text>

          <View style={styles.placeholder}>
            <TextInput
              placeholder=""
              maxLength={2}
              keyboardType="number-pad"
              value={childStillLiving}
              onChangeText={(childStillLiving) => setChildStillLiving(childStillLiving)}
              style={{
                width: "100%",
              }}
            ></TextInput>
          </View>
        </View>

        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>NO. OF CHILDREN BORN ALIVE BUT ARE NOW DEAD</Text>

          <View style={styles.placeholder}>
            <TextInput
              placeholder=""
              maxLength={2}
              keyboardType="number-pad"
              value={childAliveButNowDead}
              onChangeText={(childAliveButNowDead) => setChildAliveButNowDead(childAliveButNowDead)}
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
              value={m_occur}
              onChangeText={(m_occur) => setM_occur(m_occur)}
              style={{
                width: "100%",
              }}
            ></TextInput>
          </View>
        </View>

        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>AGE AT THE TIME OF THIS BIRTH</Text>

          <View style={styles.placeholder}>
            <TextInput
              placeholder=""
              maxLength={2}
              keyboardType="number-pad"
              value={m_age}
              onChangeText={(m_age) => setM_age(m_age)}
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
              value={m_residence}
              onChangeText={(m_residence) => setM_residence(m_residence)}
              style={{
                width: "100%",
              }}
            ></TextInput>
          </View>
        </View>

        <Text style={styles.noteText}>Father's Information:</Text>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>NAME (first, middle, last)</Text>

          <View style={styles.placeholder}>
            <TextInput
              placeholder=""
              maxLength={50}
              value={f_name}
              onChangeText={(f_name) => setF_name(f_name)}
              style={{
                width: "100%",
              }}
            ></TextInput>
          </View>
        </View>
        <View style={styles.boxContainer}>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>CITIZENSHIP</Text>

            <View style={styles.placeholder2}>
              <TextInput
                placeholder=""
                maxLength={20}
                value={f_citizenship}
                onChangeText={(f_citizenship) =>
                  setF_citizenship(f_citizenship)
                }
                style={{
                  width: "100%",
                }}
              ></TextInput>
            </View>
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>RELIGION</Text>

            <View style={styles.placeholder2}>
              <Picker
                selectedValue={f_religion}
                onValueChange={(itemValue, itemIndex) =>
                  setF_religion(itemValue)
                }
                style={{ width: "100%" }}
              >
                <Picker.Item label="Select" value="" />
                <Picker.Item
                  label="Born Again Christian"
                  value="Born Again Christian"
                />
                <Picker.Item label="Buddhism" value="Buddhism" />
                <Picker.Item label="Hinduism" value="Hinduism" />
                <Picker.Item
                  label="Iglesia ni Cristo"
                  value="Iglesia ni Cristo"
                />
                <Picker.Item label="Islam" value="Islam" />
                <Picker.Item label="Jehovah Witness" value="Jehovah Witness" />
                <Picker.Item label="Roman Catholic" value="Roman Catholic" />
                <Picker.Item
                  label="Seventh-day Adventist"
                  value="Seventh-day Adventist"
                />
                <Picker.Item
                  label="Not Applicable"
                  value="Not Applicable"
                />
              </Picker>
            </View>
          </View>
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>OCCUPATION</Text>

          <View style={styles.placeholder}>
            <TextInput
              placeholder=""
              maxLength={50}
              value={f_occur}
              onChangeText={(f_occur) => setF_occur(f_occur)}
              style={{
                width: "100%",
              }}
            ></TextInput>
          </View>
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>AGE AT THE TIME OF BIRTH</Text>

          <View style={styles.placeholder}>
            <TextInput
              placeholder=""
              maxLength={2}
              value={f_age}
              keyboardType="number-pad"
              onChangeText={(f_age) => setF_age(f_age)}
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
              value={f_residence}
              onChangeText={(f_residence) => setF_residence(f_residence)}
              style={{
                width: "100%",
              }}
            ></TextInput>
          </View>
        </View>

        <View style={{ marginBottom: 10 }}>
          <Text style={styles.noteText}>MARRIAGE OF PARENTS</Text>
          <Text style={styles.label1}>
            (If not married, accomplish Affidavit of Acknowledgement/Admission
            of Paternity.)
          </Text>
          <View style={styles.placeholder}>
            <Picker
              selectedValue={marriedType}
              onValueChange={(itemValue, itemIndex) => setMarriedType(itemValue)}
              style={{ width: "100%" }}
            >
              <Picker.Item label="Select" value="" />
              <Picker.Item label="Yes" value="Yes" />
              <Picker.Item label="No" value="No" />
            </Picker>
          </View>
        </View>

        {marriedType === 'Yes' && (
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.noteText}>IF PARENTS ARE MARRIED, FILL THIS PART</Text>

            <View style={{ marginBottom: 10 }}>
              <Text style={styles.label}>
                DATE
              </Text>

              <TouchableOpacity
                onPress={() => setShowDatePlacePicker(true)}
                style={styles.placeholder}
              >
                <Text>{selectedDatePlaceText}</Text>
              </TouchableOpacity>

              {showDatePlacePicker && (
                <DateTimePicker
                  value={mpDate}
                  mode="date"
                  display="default"
                  onChange={onDatePlaceChange}
                  maximumDate={maxDate}
                />
              )}
            </View>

            <View style={{ marginBottom: 10 }}>
              <Text style={styles.label}>
                PLACE (municipality, province, country)
              </Text>

              <View style={styles.placeholder}>
                <TextInput
                  placeholder=""
                  maxLength={50}
                  value={mpPlace}
                  onChangeText={(mpPlace) =>
                    setMpPlace(mpPlace)
                  }
                  style={{
                    width: "100%",
                  }}
                ></TextInput>
              </View>
            </View>

          </View>
        )}

        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>ATTENDANT</Text>
          <View style={styles.placeholder}>
            <Picker
              selectedValue={attendant}
              onValueChange={(itemValue, itemIndex) =>
                setAttendant(itemValue)
              }
              style={{ width: "100%" }}
            >
              <Picker.Item label="Select" value="" />
              <Picker.Item label="Physician" value="Physician" />
              <Picker.Item label="Nurse" value="Nurse" />
              <Picker.Item label="Midwife" value="Midwife" />
              <Picker.Item label=" Hilot (traditional Midwife)" value=" Hilot (traditional Midwife)" />
            </Picker>
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
    textAlign: "justify",
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
    justifyContent: "center",
    paddingLeft: 10,
    display: "grid",

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
  label: {
    fontSize: 15,
    fontWeight: "400",
    marginVertical: 8,
    textAlign: "justify",
  },
  label1: {
    fontSize: 13,
    textAlign: 'justify',
    marginBottom: 10,

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
    marginTop: 25,
  },
  feesDesc: {
    fontSize: 16,
    marginBottom: 15,
  },
});
