import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons"; // Import the Ionicons library for the bell icon
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Link, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import NewsScreen from "./NewsScreen"; // Replace with your actual NewsScreen component
import AppointmentScreen from "./AppointmentScreen"; // Replace with your actual AppointmentsScreen component
import AccountScreen from "./AccountScreen"; // Replace with your actual AccountScreen component

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView>
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
        <View style={styles.greenContainer}>
          <View style={styles.profileContainer}>
            <Image
              source={require("../assets/imported/raiza.jpg")} // Replace with the user's profile image
              style={styles.profileImage}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Hi, Raiza Jane</Text>
              <Text style={styles.userPhone}>+63094567890</Text>
            </View>
          </View>
        </View>

        <View style={styles.iconContainer}>
          <View style={styles.iconWithLabel}>
            <TouchableOpacity style={styles.circularIcon}>
              <Image
                source={require("../assets/icons/service.png")} // Replace with the user's profile image
                style={styles.icons}
              />
            </TouchableOpacity>
            <Text style={styles.iconLabel}>Services</Text>
          </View>

          <View style={styles.iconWithLabel}>
            <TouchableOpacity style={styles.circularIcon}>
              <Image
                source={require("../assets/icons/projects.png")} // Replace with the user's profile image
                style={styles.icons}
              />
            </TouchableOpacity>
            <Text style={styles.iconLabel}>Projects</Text>
          </View>

          <View style={styles.iconWithLabel}>
            <TouchableOpacity style={styles.circularIcon}>
              <Image
                source={require("../assets/icons/Map.png")} // Replace with the user's profile image
                style={styles.icons}
              />
            </TouchableOpacity>
            <Text style={styles.iconLabel}>Office Tours</Text>
          </View>
        </View>

        <View style={styles.iconContainer}>
          <View style={styles.iconWithLabel}>
            <TouchableOpacity style={styles.circularIcon}>
              <Image
                source={require("../assets/icons/Speech.png")} // Replace with the user's profile image
                style={styles.icons}
              />
            </TouchableOpacity>
            <Text style={styles.iconLabel}>Council</Text>
          </View>

          <View style={styles.iconWithLabel}>
            <TouchableOpacity style={styles.circularIcon}>
              <Image
                source={require("../assets/icons/History.png")} // Replace with the user's profile image
                style={styles.icons}
              />
            </TouchableOpacity>
            <Text style={styles.iconLabel}>History</Text>
          </View>

          <View style={styles.iconWithLabel}>
            <TouchableOpacity style={styles.circularIcon}>
              <Image
                source={require("../assets/icons/tour.png")} // Replace with the user's profile image
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
                router.push("/signup");
              }}
            >
              <View style={styles.serviceContainer}>
                <Text style={styles.text}>Philippine Statistics Authority</Text>
                <Image
                  source={require("../assets/imported/psa.png")} // Replace with the user's profile image
                  style={styles.logoImage}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.redContainer}
              onPress={() => {
                router.push("/signup");
              }}
            >
              <View style={styles.serviceContainer}>
                <Text style={styles.text}>Blood Test</Text>
                <Image
                  source={require("../assets/imported/doh.png")} // Replace with the user's profile image
                  style={styles.logoImage}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.yellowContainer}
              onPress={() => {
                router.push("/signup");
              }}
            >
              <View style={styles.serviceContainer}>
                <Text style={styles.texts}>Job {"\n"} Application</Text>
                <Image
                  source={require("../assets/imported/hr.jpg")} // Replace with the user's profile image
                  style={styles.logoImage}
                />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScrollView>
      {/* Bottom Navigation 
      <Tab.Navigator
        initialRouteName="Home"
        tabBarOptions={{
          activeTintColor: "#307A59",
          inactiveTintColor: "#4A4A4A",
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={30} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="News"
          component={NewsScreen}
          options={{
            tabBarLabel: 'News',
            tabBarIcon: ({ color }) => ( 
            <Ionicons name="newspaper" size={30} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Appointments"
          component={AppointmentScreen}
          options={{
            tabBarLabel: 'Appointment',
            tabBarIcon: ({ color }) => (
              <Ionicons name="calendar" size={30} color={color} />
        ),
          }}
        />
        <Tab.Screen
          name="Account"
          component={AccountScreen}
          options={{
            tabBarLabel: 'Account',
            tabBarIcon: ({ color }) => (
              <Ionicons name="person" size={30} color={color} />
        ),
          }}
        />
      </Tab.Navigator> */}
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
  greenContainer: {
    width: 350,
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
    fontSize: 20,
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
