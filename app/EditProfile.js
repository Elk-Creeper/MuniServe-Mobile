import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { firebase } from "../config";
import React, { useState, useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';

export default function EditProfile() {
  const storage = firebase.storage();
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    barangay: "",
  });

  const [profileImage, setProfileImage] = useState(require("../assets/imported/DP.jpg"));
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          const userData = snapshot.data();
          setName(userData);
          setEmail(userData);

          setUser({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            contact: userData.contact || "",
            barangay: userData.barangay || "",
          });

          if (userData.profileImage) {
            setProfileImage({ uri: userData.profileImage });
          }
        } else {
          console.log("User does not exist");
        }
      });

    // Clean up listener on component unmount
    return () => unsubscribe();
  }, []);

  const handleImagePicker = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`profileImages/${firebase.auth().currentUser.uid}`);
        const response = await fetch(result.uri);
        const blob = await response.blob();

        await imageRef.put(blob);
        const downloadURL = await imageRef.getDownloadURL();

        await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
          profileImage: downloadURL,
        });

        setProfileImage({ uri: downloadURL });
      }
    } catch (error) {
      console.error("Error during image upload:", error);
    }
  };

  const handleEditProfile = () => {
    setModalVisible(true);
  };

  const handleSaveProfile = async () => {
    setLoadingModalVisible(true);
    setUploading(true);

    try {
      // Validation checks
      const nameRegex = /^[A-Za-z. ]+$/;
      if (!nameRegex.test(user.firstName) || !nameRegex.test(user.lastName)) {
        Alert.alert("Error", "First name and last name should contain only letters, space, and dot.");
        return;
      }

      const contactRegex = /^09[0-9]+$/;
      if (!contactRegex.test(user.contact)) {
        Alert.alert("Error", "Contact number should contain only numbers and start with 09.");
        return;
      }
      
      // Update the user's profile information in Firebase Firestore
      await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
        firstName: user.firstName,
        lastName: user.lastName,
        contact: user.contact,
        barangay: user.barangay,
      });

      setModalVisible(false);
      setUploading(false);
      Alert.alert("Success", "Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to save profile. Please try again.");
      setUploading(false);
    } finally {
      setUploading(false);
      setLoadingModalVisible(false); // Hide loading modal
    } 
  };


  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#93C49E"
      />

      <Text style={styles.header}>Personal Information</Text>

      <View style={styles.profileContainer}>
        <Image
          source={profileImage}
          style={styles.profileImage}
        />
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.userName}>{name.firstName}</Text>
        <Text style={styles.userEmail}>{email.email}</Text>
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
            <Text style={styles.editHeader}>Edit Profile</Text>

            <View style={styles.profileContainer}>
              <Image
                source={profileImage}
                style={styles.profileImage}
              />
            </View>

            <TouchableOpacity onPress={handleImagePicker}>
              <Text style={styles.editable}>Edit Image</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={user.firstName}
              onChangeText={(text) => setUser({ ...user, firstName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={user.lastName}
              onChangeText={(text) => setUser({ ...user, lastName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Contact Number"
              maxLength={11}
              keyboardType="number-pad"
              value={user.contact}
              onChangeText={(text) => setUser({ ...user, contact: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              maxLength={50}
              value={user.barangay}
              onChangeText={(text) => setUser({ ...user, barangay: text })}
            />

            <View style={styles.buttonDesign}>
              <TouchableOpacity onPress={handleSaveProfile} style={styles.button1}>
                <Text style={{ fontWeight: "500", fontSize: 15, color: "white" }}>Save</Text>
              </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.button}>
              <Text style={{ fontWeight: "500", fontSize: 15, color: "white" }}>Cancel</Text>
            </TouchableOpacity>
            </View>
        </View>
        {uploading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#307A59" />
          </View>
        )}
      </Modal>

      <TouchableOpacity onPress={handleEditProfile}>
        <Text style={styles.editable1}>Edit Profile</Text>
      </TouchableOpacity>

      <View style={styles.userInfo1}>
        <Text style={styles.text}>Name</Text>
        <Text style={styles.data}>{user.firstName} {user.lastName}</Text>
        <Text style={styles.text}>Email Address</Text>
        <Text style={styles.data}>{user.email}</Text>
        <Text style={styles.text}>Contact Number</Text>
        <Text style={styles.data}>{user.contact}</Text>
        <Text style={styles.text}>Address</Text>
        <Text style={styles.data}>{user.barangay}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
    flexGrow: 1,
    paddingRight: 15,
  },
  header: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    margin: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
  },
  profileContainer: {
    marginTop: 20,
    justifyContent: "center",
    flexDirection: "row",
  },
  userInfo1: {
    marginLeft: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 15,
    marginTop: 4,
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    marginTop: 20,
  },
  data: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 3,
  },
  editable: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: "#0174BE",
    marginBottom: 20,
    marginTop: 10,
  },
  editable1: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: "#0174BE",
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    padding: 50,
    backgroundColor: "white",
  },
  input: {
    height: 50,
    borderColor: "#307A59",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  editHeader: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
  button: {
    height: 40,
    width: 70,
    backgroundColor: "#307A59",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 3,
  },
  button1: {
    height: 40,
    width: 70,
    backgroundColor: "#307A59",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDesign: {
    flexDirection: "row",
    justifyContent: 'center',
    marginTop: 10,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
