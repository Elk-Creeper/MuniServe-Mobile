import React, { useState, useEffect } from "react";
import { firebase } from "../../../config";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  Button,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, FontAwesome } from "@expo/vector-icons"; // Import the Ionicons library for the bell icon
import { useNavigation } from "@react-navigation/native";
import { Link, useRouter } from "expo-router";

export default function Tab4() {
  const [showAppointments, setShowAppointments] = useState(false);
  const [showServiceRequests, setShowServiceRequests] = useState(false);

  const [appointmentData, setAppointmentData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const currentUser = firebase.auth().currentUser;
    const currentUserUid = currentUser ? currentUser.uid : null;

    if (!currentUserUid) {
      // Handle the case when the user is not authenticated
      return;
    }

    const appointmentPage = firebase.firestore().collection("appointments");
    const unsubscribeTransaction = appointmentPage
      .where("userUid", "==", currentUserUid)
      .onSnapshot((querySnapshot) => {
        const appointments = [];
        const currentTime = new Date();

        querySnapshot.forEach((doc) => {
          const {
            department,
            personnel,
            reason,
            status,
            time,
            date,
            name,
            createdAt,
          } = doc.data();

          if (
            date &&
            date.toDate &&
            time &&
            time.toDate &&
            createdAt &&
            createdAt.toDate
          ) {
            const appointmentDate = date.toDate();
            const formattedDate = appointmentDate.toLocaleDateString();
            const formattedTime = time.toDate().toLocaleTimeString();

            const timeDiffInMilliseconds = currentTime - createdAt.toDate();
            const timeDiffInMinutes = Math.floor(
              timeDiffInMilliseconds / (1000 * 60)
            );

            let formattedCreatedAt;
            if (timeDiffInMinutes < 1) {
              formattedCreatedAt = "Just now";
            } else if (timeDiffInMinutes < 60) {
              formattedCreatedAt = `${timeDiffInMinutes}m ago`;
            } else if (timeDiffInMinutes < 1440) {
              const hours = Math.floor(timeDiffInMinutes / 60);
              formattedCreatedAt = `${hours} ${hours === 1 ? "hour" : "hours"
                } ago`;
            } else {
              formattedCreatedAt = formattedDate;
            }

            appointments.push({
              id: doc.id,
              department,
              personnel,
              reason,
              status,
              date: formattedDate,
              time: formattedTime,
              name,
              createdAt: formattedCreatedAt,
            });
          } else {
            console.warn(
              "Skipping document with missing or invalid date/time/createdAt:",
              doc.id
            );
          }
        });

        setAppointmentData(appointments);
      });

    return () => {
      unsubscribeTransaction();
    };
  }, []);

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
      
      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={[
            styles.navigationButton,
            showAppointments && styles.activeButton,
          ]}
          onPress={() => {
            setShowAppointments(true);
            setShowServiceRequests(false);
          }}
        >
          <Text style={styles.buttonText}>Appointments</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navigationButton,
            showServiceRequests && styles.activeButton,
          ]}
          onPress={() => {
            setShowServiceRequests(true);
            setShowAppointments(false);
          }}
        >
          <Text style={styles.buttonText}>Service Requests</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      {showAppointments && (
        <View>
          {appointmentData.length === 0 ? (
            <View style={styles.emptyListContainer}>
              <Image
                source={require("../../../assets/imported/box.png")} // Replace with your empty image source
                style={styles.emptyBox}
              />
              <Text style={styles.emptyBoxText}>No appointments found.</Text>
            </View>
          ) : (
            <FlatList
              data={appointmentData}
              renderItem={({ item }) => (
                <View style={styles.container2}>
                  <View style={styles.container3}>
                    <View style={styles.container4}>
                      <Image
                        source={require("../../../assets/imported/Del_Gallego_Camarines_Sur.png")}
                        style={styles.boxIcon}
                      />
                      <Text style={styles.appText}>Appointment</Text>
                      <Text style={styles.itemCreatedAt}>
                        {item.createdAt}
                      </Text>
                    </View>
                    <Text style={styles.itemPersonnel}>
                      Dear {item.name}, your requested appointment for{" "}
                      {item.personnel} from {item.department} on {item.date} at{" "}
                      {item.time} is
                      <Text style={styles.itemStatus}> {item.status}.</Text>
                    </Text>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      )}

      {showServiceRequests && (
        <View>
          {transactionData.length === 0 ? (
            <View style={styles.emptyListContainer}>
              <Image
                source={require("../../../assets/imported/box.png")} // Replace with your empty image source
                style={styles.emptyBox}
              />
              <Text style={styles.emptyBoxText}>
                No service requests found.
              </Text>
            </View>
          ) : (
            <FlatList
              data={transactionData}
              renderItem={({ item }) => (
                <View style={styles.container2}>
                  <View style={styles.container3}>
                    <View style={styles.container4}>
                      <Image
                        source={require("../../../assets/imported/Del_Gallego_Camarines_Sur.png")}
                        style={styles.boxIcon}
                      />
                      <Text style={styles.appText}>Transaction</Text>
                      <Text style={styles.itemCreatedAt}>
                        {" "}
                        {item.createdAt}
                      </Text>
                    </View>
                    <Text style={styles.itemPersonnel}>
                      Dear user, your availed birth registration is
                      <Text style={styles.itemStatus}> {item.status}.</Text>
                    </Text>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      )}
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
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },

  navigationButton: {
    backgroundColor: "#307A59",
    padding: 10,
    borderRadius: 10,
    width: "49%",
    alignItems: "center",
  },

  activeButton: {
    backgroundColor: "#93C49E", // Change to your active button color
    color: "black",
  },

  buttonText: {
    color: "white",
    fontWeight: "500",
    textAlign: "center",
  },

  content: {
    flex: 1,
  },
  container2: {
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
    borderWidth: 1,
    backgroundColor: "#F6F3F3",
  },
  itemStatus: {
    color: "green",
    fontWeight: "500",
    textTransform: "uppercase",
  },
  itemPersonnel: {
    textAlign: "justify",
    lineHeight: 20,
  },
  appText: {
    fontSize: 18,
    marginLeft: 8,
    marginBottom: 10,
  },
  boxIcon: {
    width: 25,
    height: 25,
  },
  container4: {
    flexDirection: "row",
  },
  emptyBox: {
    width: 130,
    height: 130,
    marginLeft: 95,
    marginTop: 150,
  },
  emptyBoxText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 270,
  },
  itemCreatedAt: {
    marginLeft: 50,
    marginTop: 3,
    fontSize: 13,
    color: "#597ae8",
    fontWeight: "600",
  },
});
