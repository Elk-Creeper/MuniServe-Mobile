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
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { firebase } from "../config";
import * as FileSystem from "expo-file-system";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Link, useRouter } from "expo-router";

export default function BirthReg() {
  const router = useRouter();

  const [image, setImage] = useState(null);
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, //All, Image, Videos
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
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

  // upload media files
  const uploadMedia = async () => {
    setLoadingModalVisible(true);
    setUploading(true);

    try { 
      // Validation checks
      if (!c_fname || !c_mname || !c_lname || !birthdate || !birthplace || !sex || !typeofbirth || !weight ||
        !m_name || !m_citizenship || !m_religion || !bornAlive || !childStillLiving ||
        !childAliveButNowDead || !m_occur || !m_age || !m_residence || !f_name ||
        !f_citizenship || !f_religion || !f_occur || !f_age || !f_residence || !mpDate ||
        !mpPlace || !attendant) {
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

      // Check if image is provided
      if (!image) {
        Alert.alert("Missing Image", "Please upload an image.");
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
      const birthreg = MuniServe.collection("birth_reg");

      await birthreg.add({
        userUid: userUid,
        userName: userName,
        userEmail: userEmail,
        userContact: userContact,
        userBarangay: userBarangay,
        attendant: attendant,
        birthdate: birthdate,
        birthorder: birthorder,
        birthplace: birthplace,
        sex: sex,
        typeofbirth: typeofbirth,
        c_multiple: multiple,
        c_weight: weight,
        c_fname : c_fname,
        c_mname : c_mname,
        c_lname : c_lname,
        f_age: f_age,
        f_citizenship: f_citizenship,
        f_name: f_name,
        f_occur: f_occur,
        f_religion: f_religion,
        f_residence: f_residence,
        m_age: m_age,
        m_citizenship: m_citizenship,
        m_name: m_name,
        bornAlive : bornAlive,
        childStillLiving: childStillLiving,
        childAliveButNowDead: childAliveButNowDead,
        m_occur: m_occur,
        m_religion: m_religion,
        m_residence: m_residence,
        mpDate : mpDate,
        mpPlace : mpPlace,
        payment: downloadURL, // Store the download URL here
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
  const [f_placemarried, setF_placemarried] = useState("");
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
  const [m_totchild, setM_totchild] = useState("");
  const [m_residence, setM_residence] = useState("");
  const [mpDate, setMpDate] = useState(new Date());
  const [mpPlace, setMpPlace] = useState("");
  const [payment, setPayment] = useState("");

  const resetForm = () => {
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
    setF_placemarried("");
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
    setM_totchild("");
    setM_residence("");
    setMpDate(new Date());
    setMpPlace("");

    setSelectedDateText("");
    setSelectedDatePlaceText("");
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
            Registration of live birth or birth certificate is a very important
            document needed by every citizen. This is usually a requirement for
            school, employment, marriage, passport and many other things. Its
            authenticity can only be verified through the civil registrar. They
            issue a certified true copy of this document, if your birth is
            indeed registered in this Municipality. The fee is 30 pesos per
            application and is processed and issued within the same day upon
            payment of the fee.
          </Text>
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

          {typeofbirth !== 'Single' && (
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
                  <Picker.Item label="Select" value="" />
                  <Picker.Item label="First" value="First" />
                  <Picker.Item label="Second" value="Second" />
                  <Picker.Item label="Third" value="Third" />
                </Picker>
              </View>
            </View>
            </View>
          )}

          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>WEIGHT AT BIRTH (grams)</Text>

            <View style={styles.placeholder}>
              <TextInput
                placeholder=""
                maxLength={6}
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
              maxLength={50}
              value={bornAlive}
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
              maxLength={50}
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
              maxLength={50}
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
                maxLength={6}
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
              maxLength={20}
              value={f_age}
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

        <Text style={styles.noteText}>MARRIAGE OF PARENTS</Text>
        <Text style={styles.label1}>
          (If not married, accomplish Affidavit of Acknowledgement/Admission
          of Paternity.)
        </Text>

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

        <Text style={styles.noteText}>
          Note: Upload first your proof of payment before submitting your
          application. Lack of needed information will cause delay or rejection.
        </Text>

        <Text style={styles.noteText2}>
          FEE FOR REGISTRATION: 50 PESOS
        </Text>

        <View style={styles.selectButton}>
          <Text style={styles.buttonText}>
            Proof of Payment(G-CASH RECEIPT)
          </Text>
          <TouchableOpacity onPress={pickImage}>
            {payment.length > 0 ? (
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
            {payment.length > 0 && (
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
              style={{ width: 300, height: 300 }}
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
    fontSize: 17,
    textAlign: "justify",
    marginTop: 5,
    marginBottom: 5,
    fontWeight: "500",
  },
  noteText2: {
    fontSize: 17,
    textAlign: "justify",
    marginTop: 5,
    marginBottom: 5,
    fontWeight: "500",
    color: "#945",
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
    borderColor: "#000",
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
  loadingModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loadingModalText: {
    marginTop: 10,
    color: "#fff",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
