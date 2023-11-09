import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView,
  Button,
  Alert
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, FontAwesome } from "@expo/vector-icons"; // Import the Ionicons library for the bell icon
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import "firebase/firestore";
import { firebase } from "../../../config";

export default function tab1() {
  const [name, setName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPersonnel, setSelectedPersonnel] = useState("");
  const [showPersonnelDropdown, setShowPersonnelDropdown] = useState(false);

  // State for date and time input values
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // State to control date and time picker visibility
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [textMessage, setTextMessage] = useState(""); // State for text message
  const [wordCount, setWordCount] = useState(0);
  const timestamp = firebase.firestore.FieldValue.serverTimestamp();

  // Define your department and personnel data
  const departments = [
    "Select Department",
    "Civil Registrar",
    "Mayor's Office",
    "HR Office",
  ];

  // Initialize personnelByDepartment with default values for all departments
  const personnelByDepartment = {
    "Select Department": ["Select Personnel"],
    "Civil Registrar": ["Select Personnel", "Cesar Manalo", "Gina Maiwat", "Person 3"],
    "Mayor's Office": ["Select Personnel","Melanie Abarientos", "Person 5"],
    "HR Office": ["Select Personnel","Glaiza De Castro", "Joverlyn Barcenas", "Person 8"],
  };

  const handleDepartmentChange = (value) => {
    setSelectedDepartment(value);
    // Clear the selected personnel when the department changes
    setSelectedPersonnel("");
    // Show/hide personnel dropdown based on selection
    setShowPersonnelDropdown(value !== "Select Department");
  };

  // Function to handle personnel change
  const handlePersonnelChange = (value) => {
    setSelectedPersonnel(value);
  };

  // Function to show date picker
  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  // Function to show time picker
  const showTimepicker = () => {
    setShowTimePicker(true);
  };

  // Handle date change
  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setSelectedDate(selectedDate);
      setShowDatePicker(false);
    }
  };

  // Handle time change
  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      setSelectedTime(selectedTime);
      setShowTimePicker(false);
    }
  };

  const handleTextChange = (text) => {
    // Limit text to 300 characters
    if (text.length <= 300) {
      setTextMessage(text);
      setWordCount(text.length);
    }
  };

  const resetForm = () => {
    setName("");
    setSelectedDepartment("");
    setSelectedPersonnel("");
    setSelectedDate(null);
    setSelectedTime(null);
    setTextMessage("");
    setWordCount(0);
  };

  const storeAppointmentData = async () => {
    try {
      const MuniServe = firebase.firestore();
      const appointmentsRef = MuniServe.collection("appointments");

      await appointmentsRef.add({
        name: name,
        department: selectedDepartment,
        personnel: selectedPersonnel,
        date: selectedDate,
        time: selectedTime,
        reason: textMessage,
        status: "Pending", // Set the initial status to "Pending"
        createdAt: timestamp,
      });

      // Data is stored in Firestore
      resetForm(); // Reset the form after successful booking
      Alert.alert("Success", "Appointment booked successfully.");
    } catch (error) {
      console.error("Error storing appointment data:", error);
      Alert.alert("Error", "Appointment booking failed.");
    }
  };


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
        <Text style={styles.serveText}>BOOK AN APPOINTMENT</Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="people"
            size={20}
            color="#aaa"
            style={styles.icons}
          />
          <TextInput
            placeholder="Input Name"
            maxLength={50}
            value={name}
            onChangeText={(name) => setName(name)}
            style={{
              width: "100%",
            }}
          ></TextInput>
        </View>

        {/* Department Dropdown */}
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={selectedDepartment}
            onValueChange={(itemValue) => handleDepartmentChange(itemValue)}
          >
            {departments.map((department, index) => (
              <Picker.Item key={index} label={department} value={department} />
            ))}
          </Picker>
        </View>

        {/* Personnel Dropdown */}
        {showPersonnelDropdown &&
          selectedDepartment in personnelByDepartment && (
            <View style={styles.dropdownContainer}>
              <Picker
                selectedValue={selectedPersonnel}
                onValueChange={(itemValue) => handlePersonnelChange(itemValue)} // Add this line
              >
                {personnelByDepartment[selectedDepartment].map(
                  (person, index) => (
                    <Picker.Item key={index} label={person} value={person} />
                  )
                )}
              </Picker>
            </View>
          )}

        {/* Date Input */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="calendar"
            size={20}
            color="#aaa"
            style={styles.icon}
          />
          <TextInput
            placeholder="Choose Date"
            placeholderTextColor="black"
            style={styles.input}
            value={selectedDate ? selectedDate.toLocaleDateString() : ""}
            onFocus={showDatepicker}
          />
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        {/* Time Input */}
        <View style={styles.inputContainer}>
          <FontAwesome
            name="clock-o"
            size={20}
            color="#aaa"
            style={styles.icon}
          />
          <TextInput
            placeholder="Choose Time"
            placeholderTextColor="black"
            style={styles.input}
            value={selectedTime ? selectedTime.toLocaleTimeString() : ""}
            onFocus={showTimepicker}
          />
          {showTimePicker && (
            <DateTimePicker
              value={selectedTime || new Date()}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </View>

        {/* Text Input for Messages */}
        <View style={styles.textInputContainer}>
          <TextInput
            placeholder="Type your message or reason for booking"
            multiline={true}
            numberOfLines={5}
            value={textMessage}
            onChangeText={handleTextChange}
            maxLength={300}
            style={styles.textInput}
          />
          <Text style={styles.wordCount}>{wordCount}/300</Text>
        </View>

        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={storeAppointmentData}>
            <View style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Book</Text>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
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
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    flexDirection: "row",
    letterSpacing: 3,
  },
  imageStyle: {
    width: 40,
    height: 40,
    marginRight: 8,
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
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  dropdownContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 15,
  },
  dropdownLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 15,
  },
  dropdownLabel: {
    fontSize: 15,
  },
  dropdownOptions: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  optionItem: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selectedValue: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "bold",
  },
  button: {
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 18,
    color: "black",
    textDecorationLine: "none",
    marginTop: 10,
  },
  textInputContainer: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
  },
  textInput: {
    fontSize: 15,
    color: "black",
    maxHeight: 120, // Adjust the height as needed
    textAlign: "justify",
  },
  loginButton: {
    backgroundColor: "#307A59",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    paddingVertical: 10,
    marginTop: 10,
    marginBottom: 30,
    width: 140,
  },
  loginButtonText: {
    color: "white",
    fontSize: 15,
  },
  wordCount: {
    color: "gray",
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 15,
    marginBottom: 20,
    padding: 3,
  },
  icon: {
    padding: 10,
    color: "black",
  },
  icons: {
    padding: 10,
    color: "black",
    marginLeft: 40,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    fontSize: 16,
    color: "#000",
  },
  errorMessage: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
  successMessage: {
    color: "green",
    fontSize: 16,
    marginBottom: 10,
  },
});
