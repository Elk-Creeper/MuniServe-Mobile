import React, { useState, useEffect } from "react";
import { Pressable, FlatList, View, TextInput, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Platform, SafeAreaView, Button, Alert} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import {firebase} from '../config';
import * as FileSystem from 'expo-file-system';

export default function BirthReg() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const timestamp = firebase.firestore.FieldValue.serverTimestamp();

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

  // upload media files
const uploadMedia = async () => {
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
    const birthreg = MuniServe.collection("birth_reg");

    await birthreg.add({
      attendant: attendant,
      c_birthdate: birthdate,
      c_birthorder: birthorder,
      c_birthplace: birthplace,
      c_sex: sex,
      c_typeofbirth: typeofbirth,
      c_weight: weight,
      childname: childname,
      f_age: f_age,
      f_citizenship: f_citizenship,
      f_name: f_name,
      f_occur: f_occur,
      f_placemarried: f_placemarried,
      f_religion: f_religion,
      m_age: m_age,
      m_citizenship: m_citizenship,
      m_name: m_name,
      m_occur: m_occur,
      m_religion: m_religion,
      m_totchild: m_totchild,
      payment: downloadURL, // Store the download URL here
      status: "Pending", // Set the initial status to "Pending"
      createdAt: timestamp,
    });

    setUploading(false);
    setImage(null);
    Alert.alert("Success", "Form filled successfully.");
  } catch (error) {
    console.error(error);
    setUploading(false);
    Alert.alert("Error", "Form filling failed.");
  }
};

  // Data add
  const [attendant, setAttendant] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [birthorder, setBirthorder] = useState("");
  const [birthplace, setBirthplace] = useState("");
  const [sex, setSex] = useState("");
  const [typeofbirth, setTypeofbirth] = useState("");
  const [weight, setWeight] = useState("");
  const [childname, setChildname] = useState("");
  const [f_age, setF_age] = useState("");
  const [f_citizenship, setF_citizenship] = useState("");
  const [f_name, setF_name] = useState("");
  const [f_occur, setF_occur] = useState("");
  const [f_placemarried, setF_placemarried] = useState("");
  const [f_religion, setF_religion] = useState("");
  const [m_age, setM_age] = useState("");
  const [m_citizenship, setM_citizenship] = useState("");
  const [m_name, setM_name] = useState("");
  const [m_occur, setM_occur] = useState("");
  const [m_religion, setM_religion] = useState("");
  const [m_totchild, setM_totchild] = useState("");
  const [payment, setPayment] = useState("");

  const resetForm = () => {
    setAttendant("");
    setBirthdate("");
    setBirthorder("");
    setBirthplace("");
    setSex("");
    setTypeofbirth("");
    setWeight("");
    setChildname("");
    setF_age("");
    setF_citizenship("");
    setF_name("");
    setF_occur("");
    setF_placemarried("");
    setF_religion("");
    setM_age("");
    setM_citizenship("");
    setM_name("");
    setM_occur("");
    setM_religion("");
    setM_totchild("");
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

  return (
    <View style={styles.container}>
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
      
        <ScrollView style={{ flex: 1 }}>
          <FlatList
            data={serve}
            numColumns={1}
            renderItem={({ item }) => (
              <Pressable>
                <View style={styles.boxes1}>
                  <View style={styles.boxAcc}>
                    <Image
                      source={require("../assets/imported/Del_Gallego_Camarines_Sur.png")}
                      style={styles.boxIcon}
                    />
                    <Text style={styles.itemService_name}>
                      {item.service_name}
                    </Text>
                  </View>
                </View>
                <View style={styles.innerContainer}>
                  <Text style={styles.itemService_desc}>
                    {item.service_desc}
                  </Text>
                </View>
              </Pressable>
            )}
          />

        <Text style={styles.noteText}>
          Please be ready to supply the following information. Fill the form below:</Text>
        <Text style={styles.noteText}>Child's Information</Text>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>
            Name of newborn child
          </Text>

          <View style={styles.placeholder}>
            <TextInput
              placeholder=""
              maxLength={50}
              value={childname}
              onChangeText={(childname) => setChildname(childname)}
              style={{
                width: "100%",
              }}
            ></TextInput>
          </View>
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>
            Birth Date
          </Text>

          <View style={styles.placeholder}>
            <TextInput
              placeholder=""
              maxLength={50}
              value={birthdate}
              onChangeText={(birthdate) => setBirthdate(birthdate)}
              style={{
                width: "100%",
              }}
            ></TextInput>
          </View>
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>
            Birth Place
          </Text>

          <View style={styles.placeholder}>
            <TextInput
              placeholder=""
              maxLength={50}
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
            <Text style={styles.label}>
              Sex
            </Text>

            <View style={styles.placeholder2}>
              <Picker
                selectedValue={sex}
                onValueChange={(itemValue, itemIndex) => setSex(itemValue)}
                style={{ width: "100%" }}
              >
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              </Picker>
            </View>
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>
              Type of birth
            </Text>

            <View style={styles.placeholder2}>
              <TextInput
                placeholder=""
                maxLength={20}
                value={typeofbirth}
                onChangeText={(typeofbirth) => setTypeofbirth(typeofbirth)}
                style={{
                  width: "100%",
                }}
              ></TextInput>
            </View>
          </View>
        </View>

        <View style={styles.boxContainer}>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>
              Weight
            </Text>

            <View style={styles.placeholder2}>
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
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>
              Birth Order
            </Text>

            <View style={styles.placeholder2}>
              <TextInput
                placeholder=""
                maxLength={20}
                value={birthorder}
                onChangeText={(birthorder) => setBirthorder(birthorder)}
                style={{
                  width: "100%",
                }}
              ></TextInput>
            </View>
          </View>
        </View>

        <Text style={styles.noteText}>Mother's Information:</Text>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>
            Mother's Maiden Name
          </Text>

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
            <Text style={styles.label}>
              Citizenship
            </Text>

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
            <Text style={styles.label}>
              Religion
            </Text>

            <View style={styles.placeholder2}>
              <Picker
                selectedValue={m_religion}
                onValueChange={(itemValue, itemIndex) => setM_religion(itemValue)}
                style={{ width: "100%" }}
              >
                <Picker.Item label="Christianity" value="Christianity" />
                <Picker.Item label="Islam" value="Islam" />
                <Picker.Item label="Hinduism" value="Hinduism" />
                {/* Add more religion options as needed */}
              </Picker>
            </View>
          </View>
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>
            Occupation
          </Text>

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
        <View style={styles.boxContainer}>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>
              Age at the time of birth
            </Text>

            <View style={styles.placeholder2}>
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
            <Text style={styles.label}>
              Total of children
            </Text>

            <View style={styles.placeholder2}>
              <TextInput
                placeholder=""
                maxLength={20}
                value={m_totchild}
                onChangeText={(m_totchild) => setM_totchild(m_totchild)}
                style={{
                  width: "100%",
                }}
              ></TextInput>
            </View>
          </View>
        </View>
        <Text style={styles.noteText}>Father's Information:</Text>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>
            Father's Name
          </Text>

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
            <Text style={styles.label}>
              Citizenship
            </Text>

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
            <Text style={styles.label}>
              Religion
            </Text>

            <View style={styles.placeholder2}>
              <Picker
                selectedValue={f_religion}
                onValueChange={(itemValue, itemIndex) => setM_religion(itemValue)}
                style={{ width: "100%" }}
              >
                <Picker.Item label="Christianity" value="Christianity" />
                <Picker.Item label="Islam" value="Islam" />
                <Picker.Item label="Hinduism" value="Hinduism" />
                {/* Add more religion options as needed */}
              </Picker>
            </View>
          </View>
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>
            Occupation
          </Text>

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
          <Text style={styles.label}>
              Age at the time of birth
            </Text>

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

          <Text style={styles.noteText}>Additional Information:</Text>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>
              Place of marriage
            </Text>

          <View style={styles.placeholder}>
              <TextInput
                placeholder=""
                maxLength={20}
                value={f_placemarried}
                onChangeText={(f_placemarried) =>
                  setF_placemarried(f_placemarried)
                }
                style={{
                  width: "100%",
                }}
              ></TextInput>
            </View>
          </View>
        
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>
            Attendant of birth
          </Text>

          <View style={styles.placeholder}>
            <TextInput
              placeholder=""
              value={attendant}
              onChangeText={(attendant) => setAttendant(attendant)}
              maxLength={50}
              style={{
                width: "100%",
              }}
            ></TextInput>
          </View>
        </View>

        <Text style={styles.noteText}>Note: Upload first your proof of payment before submitting your application. Lack of needed information will cause delay or rejection.</Text>
        <TouchableOpacity style={styles.selectButton} onPress={pickImage}>
          <Text style={styles.buttonText}>
            Proof of Payment(G-CASH RECEIPT)
          </Text>
        </TouchableOpacity>

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
              storeFormData();
            }}
          >
            <Text style={styles.buttonText}>Submit</Text>
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
    marginTop: 10,
    width: 165,
    marginLeft: 15,
    marginBottom: 40,
  },
  selectButton: {
    borderRadius: 10,
    width: "100%",
    height: 50,
    backgroundColor: "#307A59",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
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
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: "400",
    marginVertical: 8,
  },
});