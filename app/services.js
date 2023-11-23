import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";

export default function Service() {
  const router = useRouter();

  const servicesData = [
    { id: 1, name: "Registration of Live Birth" },
    { id: 2, name: "Business Permit" },
    { id: 3, name: "Death Certificate" },
    { id: 4, name: "Job Application" },
    { id: 5, name: "Marriage Certificate" },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredServices, setFilteredServices] = useState(servicesData);

  useEffect(() => {
    // Filter services based on the search query
    const filtered = servicesData.filter((service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleServiceItemClick = (itemId) => {
    // Use the router to navigate to different pages based on the itemId
    switch (itemId) {
      case 1:
        router.push("/BirthReg");
        break;
      case 2:
        router.push("/BusinessPermit");
        break;
      case 3:
        router.push("/DeathCertificate");
        break;
      case 4:
        router.push("/JobApplication");
        break;
      case 5:
        router.push("/MarriageCert");
        break;
      case 6:
        router.push("/PSA");
        break;
      default:
        break;
    }
  };

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

      <Text style={styles.serveText}>List of our Services</Text>

      <View style={styles.assembler}>
        <View style={styles.Main}>
          <TextInput
            placeholder="Search"
            style={styles.Input}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              handleServiceItemClick(item.id);
            }}
          >
            <View style={styles.boxes}>
              <View style={styles.boxAcc}>
                <Image
                  source={require("../assets/imported/Del_Gallego_Camarines_Sur.png")}
                  style={styles.boxIcon}
                />
                <Text style={styles.box}>{item.name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
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
  serveText: {
    fontSize: 25,
    textAlign: "center",
  },
  boxes: {
    width: "100%",
    height: 65,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    borderRadius: 15,
    marginTop: 5,
    textAlign: "center"
  },
  box: {
    marginLeft: 20,
    color: "black",
    fontSize: 15,
    marginTop: 18,
  },
  boxAcc: {
    flexDirection: "row",
  },
  boxIcon: {
    marginTop: 12,
    marginLeft: 8,
    width: 40,
    height: 40,
  },
  assembler: {
    flexDirection: "row",
    marginTop: 30,
    marginBottom: 30,
    justifyContent: "center",
  },
  Main: {
    backgroundColor: "#FFF",
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 50,
  },
  Input: {
    marginLeft: 10,
    marginTop: 5,
  },
});
