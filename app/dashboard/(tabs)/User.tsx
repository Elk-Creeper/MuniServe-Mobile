import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons"; // Import the Ionicons library for the bell icon


export default function tab4() {
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#93C49E" // Change the background color as needed
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
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.greenContainer}>
          <View style={styles.profileContainer}>
            <Image
              source={require("../../../assets/imported/raiza.jpg")} // Replace with the user's profile image
              style={styles.profileImage}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Hi, Raiza Jane</Text>
              <Text style={styles.userPhone}>+63094567890</Text>
            </View>
          </View>
        </View>

        <View style={styles.boxes1}>
          <TouchableOpacity>
            <View style={styles.boxAcc}>
              <Image
                source={require("../../../assets/icons/Help.png")}
                style={styles.boxIcon}
              />
              <Text style={styles.box}>FAQs</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.boxes2}>
          <TouchableOpacity>
            <View style={styles.boxAcc}>
              <Image
                source={require("../../../assets/icons/Info.png")}
                style={styles.boxIcon}
              />
              <Text style={styles.box}>About Us</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.boxes3}>
          <TouchableOpacity>
            <View style={styles.boxAcc}>
              <Image
                source={require("../../../assets/icons/contact.png")}
                style={styles.boxIcon}
              />
              <Text style={styles.box}>Contact Us</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.boxes4}>
          <TouchableOpacity>
            <View style={styles.boxAcc}>
              <Image
                source={require("../../../assets/icons/Settings.png")}
                style={styles.boxIcon}
              />
              <Text style={styles.box}>Settings</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.boxes5}>
          <TouchableOpacity>
            <View style={styles.boxAcc}>
              <Image
                source={require("../../../assets/icons/rate.png")}
                style={styles.boxIcon}
              />
              <Text style={styles.box}>Rate our app</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.boxes6}>
          <TouchableOpacity>
            <View style={styles.boxAcc}>
              <Image
                source={require("../../../assets/icons/Logout.png")}
                style={styles.boxIcon}
              />
              <Text style={styles.box}>Log out</Text>
            </View>
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
  greenContainer: {
    width: "100%",
    height: 120,
    backgroundColor: "#307A59",
    borderRadius: 25,
    flexDirection: "row", // Row direction for circular icons
    alignItems: "center", // Center vertically
    marginBottom: 20,
    marginTop: 10,
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
    fontSize: 20,
    color: "white",
    marginTop: 4,
  },
  boxes1: {
    width: "100%",
    height: 65,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  boxes2: {
    width: "100%",
    height: 65,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    marginTop: 10,
  },
  boxes3: {
    width: "100%",
    height: 65,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    marginTop: 10,
  },
  boxes4: {
    width: "100%",
    height: 65,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    marginTop: 10,
  },
  boxes5: {
    width: "100%",
    height: 65,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    marginTop: 10,
  },
  boxes6: {
    width: "100%",
    height: 65,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    marginTop: 10,
    marginBottom: 15,
  },
  box: {
    marginLeft: 20,
    color: "black",
    fontSize: 17,
    marginTop: 13,
  },
  boxAcc: {
    flexDirection: "row",
  },
  boxIcon: {
    marginTop: 8,
    marginLeft: 5,
    width: 40,
    height: 40,
  },
});