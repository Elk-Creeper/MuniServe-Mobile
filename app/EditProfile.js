import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { firebase } from "../config";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { Link, useRouter } from "expo-router";


export default function EditProfile() {
  const router = useRouter();

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
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setName(snapshot.data());
          setEmail(snapshot.data());
        } else {
          console.log("User does not exist");
        }
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const userDoc = await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
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
    };

    fetchData();
  }, []);

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
        profileImage: result.uri,
      });

      setProfileImage({ uri: result.uri });
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
        <Text style={styles.userName}>Hi, {name.firstName}</Text>
        <Text style={styles.userEmail}>{email.email}</Text>
      </View>

      <TouchableOpacity onPress={handleImagePicker}>
        <Text style={styles.editable}>Edit Image</Text>
      </TouchableOpacity>

      <View style={styles.userInfo1}>
        <Text style={styles.text}>Name</Text>
        <Text style={styles.data}>{user.firstName} {user.lastName}</Text>
        <Text style={styles.text}>Email Address</Text>
        <Text style={styles.data}>{user.email}</Text>
        <Text style={styles.text}>Contact Number</Text>
        <Text style={styles.data}>{user.contact}</Text>
        <Text style={styles.text}>Address</Text>
        <Text style={styles.data}>{user.barangay}, Del Gallego, Camarines Sur</Text>
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
    marginBottom: 10,
  },
  editable1: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 3,
    color: "#0174BE",
  },
  forgotText: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: '700',
  },
});
