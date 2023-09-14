import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Platform, } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons"; // Import the Ionicons library for the bell icon
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import { Link, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
    const router = useRouter();
    const navigation = useNavigation();

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

          <View style={styles.boxes1}>
            <TouchableOpacity>
              <View style={styles.boxAcc}>
                <Image
                  source={require("../assets/imported/Del_Gallego_Camarines_Sur.png")}
                  style={styles.boxIcon}
                />
                <Text style={styles.box}>Philippine Statistics Authority</Text>
              </View>
            </TouchableOpacity>
          </View>

          <ScrollView>
            <View style={styles.requirements}>
              <Text style={styles.requirementText}>
                To avail this service, you need the following requirements or
                documents:
                {"\n"}
                {"\n"}PRIMARY DOCUMENTS
                {"\n"}
                {"\n"}
                {"\t"}
                {"\t"}1. PSA-issued Certificate of Live Birth and one (1)
                government-issued identification document which bears a full
                name, front-facing photograph, and signature or thumb mark;
                {"\n"}
                {"\t"}
                {"\t"}2. Philippine Passport or ePassport issued by the
                Department of Foreign Affairs (DFA);
                {"\n"}
                {"\t"}
                {"\t"}3. Unified Multi-purpose ldentification (UMID) Card issued
                by the Government Service lnsurance System (GSIS) or Social
                Security Systen (SSS); or
                {"\n"}
                {"\t"}
                {"\t"}4. Student’s License Permit or Non-
                Professional/Professional Driver’s License issued by the LTO.
                {"\n"}(If there are discrepancies between the PSA-issued
                Certificate of Live Birth and the government-issued ID
                presented, the PSA-issued Certificate of Live Birth would be
                considered as a secondary supporting document)
              </Text>
            </View>

            <Text style={styles.serveText}>Book an Appointment Now!</Text>

            <View style={styles.container}>
              {/* Date Input */}
              <View style={styles.inputContainer}>
                <Icon
                  name="calendar"
                  size={30}
                  color="#999"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  value="date"
                  placeholder="Select a date" 
                />
              </View>

              {/* Time Input */}
              <View style={styles.inputContainer}>
                <Icon
                  name="clock-o"
                  size={30}
                  color="#999"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  value="time"
                  placeholder="Select a time"
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                router.push("/signup");
              }}
              className="bg-green-900 justify-center items-center  mx-10 rounded-lg py-3"
            >
              <Text className="text-xl text-white">Submit</Text>
            </TouchableOpacity>
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
    width: 50,
    height: 50,
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
    fontSize: 25,
  },
  greenText: {
    color: "green",
    fontWeight: "bold",
    fontSize: 25,
  },
  serveText: {
    fontSize: 22,
    textAlign: "center",
    marginTop: 30,
    marginBottom: 0,
  },
  boxes1: {
    width: 350,
    height: 65,
    backgroundColor: "#307A59",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 30,
  },
  box: {
    marginLeft: 20,
    color: "white",
    fontSize: 18,
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
  requirements: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  requirementText: {
    fontSize: 17,
    textAlign: "justify",
    margin: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#307A59",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 20,
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
});