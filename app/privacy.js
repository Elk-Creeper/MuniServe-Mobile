import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { firebase } from "../config";
import { Link, useRouter } from "expo-router";

const Privacy = () => {
    const router = useRouter();
    const [privacy, setPrivacy] = useState([]);
    const MuniServe = firebase.firestore().collection("privacy");

    useEffect(() => {
      const fetchData = async () => {
        try {
          const querySnapshot = await MuniServe.get();
          const privacy = [];

          querySnapshot.forEach((doc) => {
            const { p1, p11, p2, p3, p4, p5, p6, p7 } = doc.data();
            privacy.push({
              id: doc.id,
              p1,
              p11,
              p2,
              p3,
              p4,
              p5,
              p6,
              p7,
            });
          });

          setPrivacy(privacy);
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      };

      fetchData();
    }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#93C49E" // Change the background color as needed
      />

      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Image
            source={require("../assets/imported/Del_Gallego_Camarines_Sur.png")}
            style={styles.logo}
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

      <Text style={styles.texts}>Privacy Policy</Text>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <FlatList
          data={privacy}
          numColumns={1}
          renderItem={({ item }) => (
            <View style={styles.paraText}>
              <Text style={styles.text}>Introduction</Text>
              <Text style={styles.itemPara}>{item.p1}</Text>
              <Text style={styles.itemPara}>{item.p11}</Text>

              <Text style={styles.text}>Information We Collect</Text>
              <Text style={styles.itemPara}>{item.p2}</Text>

              <Text style={styles.text}>
                Information Sharing and Disclosure
              </Text>
              <Text style={styles.itemPara}>{item.p3}</Text>

              <Text style={styles.text}>Security</Text>
              <Text style={styles.itemPara}>{item.p4}</Text>

              <Text style={styles.text}>Your Choices</Text>
              <Text style={styles.itemPara}>{item.p5}</Text>

              <Text style={styles.text}>
                Data Privacy Act of 2012 (Republic Act No. 10173)
              </Text>
              <Text style={styles.itemPara}>{item.p6}</Text>

              <Text style={styles.text}>Contact Us</Text>
              <Text style={styles.itemPara}>{item.p7}</Text>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
};

export default Privacy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "left",
    backgroundColor: "white",
    padding: 20,
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
  logo: {
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
  text: {
    fontSize: 18,
    marginLeft: 10,
    marginTop: 10,
    fontWeight: "600",
  },
  texts: {
    fontSize: 23 ,
    marginLeft: 10,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  itemPara: {
    textAlign: "justify",
    fontSize: 16,
    fontWeight: "300",
    lineHeight: 25,
    padding: 10
  },
});
