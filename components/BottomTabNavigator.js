import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'; // Import the Ionicons library for the bell icon
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from './HomeScreen'; // Replace with your actual HomeScreen component
import NewsScreen from './NewsScreen'; // Replace with your actual NewsScreen component
import AppointmentScreen from './AppointmentScreen'; // Replace with your actual AppointmentsScreen component
import AccountScreen from './AccountScreen'; // Replace with your actual AccountScreen component

const Tab = createBottomTabNavigator();

export default function App() {
    return (
<View >
{/* Bottom Navigation */ }
<Tab.Navigator
    initialRouteName="Home"
    tabBarOptions={{
        activeTintColor: "#307A59",
        inactiveTintColor: "#4A4A4A",
    }}
    style={styles.navigationBar}
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
</Tab.Navigator>
</View >
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
    // Sticky Navigation Bar
    navigationBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        backgroundColor: "#F7F6F6",
        borderTopWidth: 1,
        borderTopColor: "#DDDDDD",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
    },
});