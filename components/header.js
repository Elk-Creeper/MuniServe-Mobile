import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import the Ionicons library for the bell icon

export default function App() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Image
                        source={require('../assets/imported/Del_Gallego_Camarines_Sur.png')}
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
            {/* Your content goes here */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageStyle: {
        width: 50,
        height: 50,
        marginRight: 8,
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        flexDirection: 'row',
        letterSpacing: 3,
    },
    blackText: {
        color: 'black',
    },
    greenText: {
        color: 'green',
    },
});