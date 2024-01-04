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
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons, FontAwesome } from "@expo/vector-icons"; // Import the Ionicons library for the bell icon
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import "firebase/firestore";
import { firebase } from "../../../config";
import { Link, useRouter } from "expo-router";

export default function tab1() {
  const [name, setName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPersonnel, setSelectedPersonnel] = useState("");
  const [showPersonnelDropdown, setShowPersonnelDropdown] = useState(false); 

  const router = useRouter();

  //for storing the user info
  const [userUid, setUserUid] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userBarangay, setUserBarangay] = useState(null);
  const [userContact, setUserContact] = useState(null);

  // State for date and time input values
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // State to control date and time picker visibility
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDatepickerOptions, setShowDatepickerOptions] = useState({
    minDate: new Date(),
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showTimePickerOptions, setShowTimePickerOptions] = useState({
    minTime: new Date(),
    maxTime: new Date(),
  });

  const [textMessage, setTextMessage] = useState(""); // State for text message
  const [wordCount, setWordCount] = useState(0);
  const timestamp = firebase.firestore.FieldValue.serverTimestamp();

  // Define your department and personnel data
  const departments = [
    "Select Department",
    "Municipal Mayor's Office",
    "Municipal Vice Mayor's Office",
    "Sangguniang Bayan Office",
    "Municipal Accountant's Office",
    "Municipal Agricultural Office",
    "Municipal Assessor's Office",
    "Municipal Civil Registrar Office",
    "Municipal Budget Office",
    "Municipal Disaster Risk Reduction and Management Office",
    "Municipal Engineering Office",
    "Municipal Environment and Natural Resources Office",
    "Municipal Health Office",
    "Municipal Human Resource and Management Office",
    "Municipal Planning and Development Office",
    "Municipal Social Welfare and Development Office",
    "Municipal Treasurer's Office",
  ];

  // Initialize personnelByDepartment with default values for all departments
  const personnelByDepartment = {
    "Select Department": ["Select Personnel"],
    "Municipal Mayor's Office": ["Select Personnel", "Hon. Melanie Abarientos-Garcia"],
    "Municipal Vice Mayor's Office": ["Select Personnel", "Hon. Florencia G. Bargo"],
    "Sangguniang Bayan Office": ["Select Personnel", "Mr. Allan Ronquillo"],
    "Municipal Accountant's Office": ["Select Personnel", "Ms. Deta P. Gaspar, CPA"],
    "Municipal Agricultural Office": ["Select Personnel", "Engr. Alex B. Idanan"],
    "Municipal Assessor's Office": ["Select Personnel", "Mr. Elberto R. Adulta"],
    "Municipal Civil Registrar Office": ["Select Personnel", "Mr. Ceasar P. Manalo"],
    "Municipal Budget Office": ["Select Personnel", "Mrs. Maria Elinar N. Ilagan"],
    "Municipal Disaster Risk Reduction and Management Office": ["Select Personnel", "Mr. Laurence V. Rojo"],
    "Municipal Engineering Office": ["Select Personnel", "Engr. Fernando P Lojo Jr."],
    "Municipal Environment and Natural Resources Office": ["Select Personnel", "Mrs. Gina Maiwat"],
    "Municipal Health Office": ["Select Personnel", "Dr. Jeffrey James B. Motos"],
    "Municipal Human Resource and Management Office": ["Select Personnel", "Ms. Ma. Glaiza C. Bermudo"],
    "Municipal Planning and Development Office": ["Select Personnel", "Eng. Paz C. Caguimbal"],
    "Municipal Social Welfare and Development Office": ["Select Personnel", "Ms.Ana C. Mangubat, RSW"],
    "Municipal Treasurer's Office": ["Select Personnel", "Mr. Dante A. Cadag"],
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

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };

  // Function to show date picker
  const showDatepicker = () => {
    const now = new Date();
    const minDate = new Date(now); // Current date
    minDate.setHours(0, 0, 0, 0);

    setShowDatePicker(true);
    setShowTimePicker(false);

    setShowDatepickerOptions({
      minDate: minDate,
      maxDate: null, // You can set a max date if needed
    });
  };

  // Function to show time picker
  const showTimepicker = () => {
    const now = new Date();
    const startHour = 8; // 8 am
    const endHour = 16; // 4 pm

    // Set minimum and maximum allowed time
    const minTime = new Date(now);
    minTime.setHours(startHour, 0, 0, 0);

    const maxTime = new Date(now);
    maxTime.setHours(endHour, 0, 0, 0);

    setShowTimePicker(true);
    setShowDatePicker(false);

    // Set the minimum and maximum time for the time picker
    setShowTimePickerOptions({
      minTime: minTime,
      maxTime: maxTime,
    });

    // If the current selected time is 12, change it to the minimum time
    if (selectedTime && selectedTime.getHours() === 12) {
      setSelectedTime(minTime);
    } else {
      setSelectedTime(selectedTime || minTime); // Set default value to minimum time
    }
  };

  // Handle date change
  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      const { minDate, maxDate } = showDatepickerOptions;

      if (
        selectedDate >= minDate &&
        (!maxDate || selectedDate <= maxDate) &&
        !isWeekend(selectedDate)
      ) {
        setSelectedDate(selectedDate);
      } else {
        Alert.alert(
          "Invalid Date",
          "We are not open on weekends. Please select a valid date from Monday to Friday. Thank you!",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      }

      setShowDatePicker(false);
    }
  };

  // Handle time change
  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      const { minTime, maxTime } = showTimePickerOptions;

      if (selectedTime >= minTime && selectedTime <= maxTime && selectedTime.getHours() !== 12) {
        setSelectedTime(selectedTime);
      } else {
        // Alert the user about the invalid time selection
        Alert.alert(
          "Invalid Time",
          "We're not available to set up an appointment at 12:00 PM. Please select a different time between 8 AM and 4 PM. Thank you!",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      }
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

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          setUserUid(user.uid);
          // Fetch user's name from Firestore using UID
          const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            setUserName(userDoc.data().firstName);
            setUserEmail(userDoc.data().email);
            setUserBarangay(userDoc.data().barangay);
            setUserContact(userDoc.data().contact);

          } else {
            console.log("User data not found in Firestore");
          }
        } else {
          console.log("User not authenticated");
        }
      } catch (error) {
        console.error("Error getting user info:", error);
      }
    };

    getUserInfo();
  }, []);

  const storeAppointmentData = async () => {
    try {
      // Validate required fields
      const requiredFields = [name, selectedDepartment, selectedPersonnel, selectedDate, selectedTime, textMessage];

      if (requiredFields.some(field => !field)) {
        Alert.alert("Incomplete Form", "Please fill in all required fields.");
        return;
      }

      // Validate name
      if (!/^[a-zA-Z.\s]+$/.test(name)) {
        Alert.alert(
          "Invalid Name",
          "Name should only contain letters, dots, and spaces."
        );
        return;
      }

      const MuniServe = firebase.firestore();
      const appointmentsRef = MuniServe.collection("appointments");

      await appointmentsRef.add({
        userUid: userUid,
        userName: userName,
        userEmail: userEmail,
        userContact: userContact,
        userBarangay: userBarangay,
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
        <TouchableOpacity
          onPress={() => {
            router.push("/notif");
          }}
        >
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
              minimumDate={showDatepickerOptions.minDate}
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
            style={[styles.textInput, { textAlignVertical: 'top' }]}
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
    top: 0,
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
