import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons"; 
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { firebase } from "../../../config";

export default function tab1() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Fetch updated user data or perform any other refreshing logic here
    // For example, you can re-fetch data from Firebase
    await fetchDataFromFirebase();
    setRefreshing(false);
  };

  const fetchDataFromFirebase = () => {
    const currentUser = firebase.auth().currentUser;

    if (currentUser) {
      const userId = currentUser.uid;

      const userRef = firebase.firestore().collection("users").doc(userId);

      const unsubscribe = userRef.onSnapshot((snapshot) => {
        if (snapshot.exists) {
          const userData = snapshot.data();
          console.log("User Data:", userData);
          setName(userData.firstName || "");
          setContact(userData.contact || "");
          setProfileImage(userData.profileImage || "");
        } else {
          console.log("User does not exist");
        }
      });

      return () => unsubscribe();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#93C49E"
      />
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Image
            source={require("../../../assets/imported/Del_Gallego_Camarines_Sur.png")}
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

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        <View style={styles.greenContainer}>
          <View style={styles.profileContainer}>
            <Image
              source={profileImage ? { uri: profileImage } : require("../../../assets/imported/DP.jpg")}
              style={styles.profileImage}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Hi, {name}</Text>
              <Text style={styles.userPhone}>{contact}</Text>
            </View>
          </View>
        </View>

        <View style={styles.iconContainer}>
          <View style={styles.iconWithLabel}>
            <TouchableOpacity
              style={styles.circularIcon}
              onPress={() => {
                router.push("/services");
              }}
            >
              <Image
                source={require("../../../assets/icons/service.png")} // Replace with the user's profile image
                style={styles.icons}
              />
            </TouchableOpacity>
            <Text style={styles.iconLabel}>Services</Text>
          </View>

          <View style={styles.iconWithLabel}>
            <TouchableOpacity
              style={styles.circularIcon}
              onPress={() => {
                router.push("/projects");
              }}
            >
              <Image
                source={require("../../../assets/icons/projects.png")} // Replace with the user's profile image
                style={styles.icons}
              />
            </TouchableOpacity>
            <Text style={styles.iconLabel}>Projects</Text>
          </View>

          <View style={styles.iconWithLabel}>
            <TouchableOpacity
              style={styles.circularIcon}
              onPress={() => {
                router.push("/projects");
              }}
            >
              <Image
                source={require("../../../assets/icons/Map.png")} // Replace with the user's profile image
                style={styles.icons}
              />
            </TouchableOpacity>
            <Text style={styles.iconLabel}>Office Tours</Text>
          </View>
        </View>

        <View style={styles.iconContainer}>
          <View style={styles.iconWithLabel}>
            <TouchableOpacity
              style={styles.circularIcon}
              onPress={() => {
                router.push("/council");
              }}
            >
              <Image
                source={require("../../../assets/icons/Speech.png")} // Replace with the user's profile image
                style={styles.icons}
              />
            </TouchableOpacity>
            <Text style={styles.iconLabel}>Council</Text>
          </View>

          <View style={styles.iconWithLabel}>
            <TouchableOpacity
              style={styles.circularIcon}
              onPress={() => {
                router.push("/history");
              }}
            >
              <Image
                source={require("../../../assets/icons/History.png")} // Replace with the user's profile image
                style={styles.icons}
              />
            </TouchableOpacity>
            <Text style={styles.iconLabel}>History</Text>
          </View>

          <View style={styles.iconWithLabel}>
            <TouchableOpacity
              style={styles.circularIcon}
              onPress={() => {
                router.push("../../Tourist");
              }}
            >
              <Image
                source={require("../../../assets/icons/tour.png")} // Replace with the user's profile image
                style={styles.icons}
              />
            </TouchableOpacity>
            <Text style={styles.iconLabel}>Tourism</Text>
          </View>
        </View>

        <Text style={styles.serviceText}>Suggested E-Services</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.services}>
            <TouchableOpacity
              style={styles.blueContainer}
              onPress={() => {
                router.push("/BirthReg");
              }}
            >
              <View style={styles.serviceContainer}>
                <Text style={styles.text}>Birth {"\n"}Registration</Text>
                <Image
                  source={require("../../../assets/imported/psa.png")} // Replace with the user's profile image
                  style={styles.logoImage}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.redContainer}
              onPress={() => {
                router.push("/DeathCertificate");
              }}
            >
              <View style={styles.serviceContainer}>
                <Text style={styles.text}>Death {"\n"}Registration</Text>
                <Image
                  source={require("../../../assets/imported/death.jpg")} // Replace with the user's profile image
                  style={styles.logoImage}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.yellowContainer}
              onPress={() => {
                router.push("/JobApplication");
              }}
            >
              <View style={styles.serviceContainer}>
                <Text style={styles.texts}>Job {"\n"}Application</Text>
                <Image
                  source={require("../../../assets/imported/hr.jpg")} // Replace with the user's profile image
                  style={styles.logoImage}
                />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  greenContainer: {
    width: "100%",
    height: 120,
    backgroundColor: "#307A59",
    borderRadius: 25,
    flexDirection: "row", // Row direction for circular icons
    alignItems: "center", // Center vertically
  },
  profileContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    marginLeft: 30,
    flexDirection: "row",
  },
  profileImage: {
    width: 75,
    height: 75,
    borderRadius: 50,
    justifyContent: "center",
  },
  userInfo: {
    marginLeft: 20,
  },
  userName: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    marginTop: 8,
  },
  userPhone: {
    fontSize: 15,
    color: "white",
    marginTop: 4,
  },
  iconContainer: {
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
    alignContent: "center",
    justifyContent: "space-evenly",
  },
  iconWithLabel: {
    alignItems: "center",
    justifyContent: "center",
  },
  circularIcon: {
    width: 75,
    height: 75,
    borderRadius: 50,
    backgroundColor: "#D3F6DD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  iconLabel: {
    marginTop: 10,
    fontSize: 14,
    color: "black",
    textAlign: "center",
    alignContent: "center",
  },
  icons: {
    width: 35,
    height: 35,
  },
  serviceText: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: "bold",
  },
  services: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginHorizontal: 5,
    alignContent: "center",
    marginBottom: 10,
  },
  blueContainer: {
    width: 160,
    height: 140,
    backgroundColor: "#2256C0",
    borderRadius: 25,
    alignItems: "center", // Center vertically
    marginTop: 15,
  },
  redContainer: {
    width: 160,
    height: 140,
    backgroundColor: "#B92853",
    borderRadius: 25,
    alignItems: "center", // Center vertically
    marginTop: 15,
    marginLeft: 10,
  },
  yellowContainer: {
    width: 160,
    height: 140,
    backgroundColor: "#D9BE45",
    borderRadius: 25,
    alignItems: "center", // Center vertically
    marginTop: 15,
    marginLeft: 10,
  },
  serviceContainer: {
    alignItems: "flex-start",
    marginLeft: 26,
    flexDirection: "row",
    marginTop: 7,
  },
  text: {
    fontSize: 17,
    marginTop: 10,
    fontWeight: "400",
    color: "white",
    textAlign: "justify",
  },
  texts: {
    fontSize: 17,
    marginTop: 10,
    fontWeight: "400",
    color: "black",
    textAlign: "justify",
  },
  logoImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginTop: 55,
    marginRight: 25,
  },
});
