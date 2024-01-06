import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  handleSearch,
} from "react-native";
import { firebase } from "../../../config";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons"; // Import the Ionicons library for the bell icon
import { Link, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";


export default function tab4() {
  const router = useRouter();

  const [news, setNews] = useState([]);
  const MuniServe = firebase.firestore().collection("news");

  const calculateElapsedTime = (createdAt) => {
    const now = new Date();
    const createdDate = createdAt.toDate();
    const timeDifference = now - createdDate;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (seconds < 60) {
      return `${seconds} ${seconds === 1 ? "s" : "s"} ago`;
    } else if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? "minute" : "mins"} ago`;
    } else if (hours < 24) {
      return `${hours} ${hours === 1 ? "hour" : "hrs"} ago`;
    } else if (days < 30) {
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    } else if (months < 12) {
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    } else {
      return `${years} ${years === 1 ? "year" : "years"} ago`;
    }
  };

  useEffect(() => {
    const unsubscribe = MuniServe.onSnapshot((querySnapshot) => {
      const newsData = [];

      querySnapshot.forEach((doc) => {
        const { imageUrls, content, createdAt, title } = doc.data();

        if (createdAt && createdAt.toDate) {
          const formattedCreatedAt = calculateElapsedTime(createdAt);

          newsData.push({
            id: doc.id,
            imageUrls,
            content,
            createdAt: formattedCreatedAt,
            title,
          });
        } else {
          console.warn(
            "Skipping document with missing or invalid createdAt:",
            doc.id
          );
        }
      });

      // Sort the newsData array by createdAt in descending order
      newsData.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

      setNews(newsData);
    });

    return () => unsubscribe(); // Cleanup function to unsubscribe from the snapshot listener
  }, []); // Empty dependency array means this effect runs once on mount


  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#93C49E" // Change the background color as needed
      />
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Image
            source={require("../../../assets/imported/Del_Gallego_Camarines_Sur.png")}
            style={styles.logoStyle}
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

      <Text style={styles.newsText}>News and Announcements</Text>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <FlatList
          style={{ height: "100%" }}
          data={news}
          numColumns={1}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <View style={styles.container2}>
                <View style={styles.container3}>
                  <View style={styles.container4}>
                    <Image
                      source={require("../../../assets/imported/Del_Gallego_Camarines_Sur.png")}
                      style={styles.boxIcon}
                    />
                    <Text style={styles.appText}>Admin</Text>
                    <Text style={styles.itemCreatedAt}> {item.createdAt}</Text>
                  </View>
                </View>

                <View style={styles.subContainer3}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <View style={styles.imageStyle}>
                    {item.imageUrls &&
                      item.imageUrls.length > 0 &&
                      item.imageUrls.map((imageUrl, index) => (
                        <Image
                          key={index}
                          source={{ uri: imageUrl }}
                          style={styles.cImage}
                        />
                      ))}
                  </View>
                </View>

              </View>
            </TouchableOpacity>
          )}
        />
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
  logoStyle: {
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
  assembler: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
    justifyContent: "center",
  },
  Main: {
    backgroundColor: "#FFF",
    width: "92%",
    height: 40,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 50,
  },
  Input: {
    marginLeft: 10,
    marginTop: 5,
  },
  newsText: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 20,
  },
  newsImage: {
    marginLeft: 10,
    alignItems: "center",
    marginTop: 10,
  },
  cImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 5,
  },
  imageStyle: {
    marginTop: 20,
    alignItems: "center",
  },
  container2: {
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
    borderWidth: 1,
    marginTop: 10,
  },
  itemContent: {
    textAlign: "justify",
    lineHeight: 20,
    marginTop: 10,
  },
  itemTitle: {
    textAlign: "justify",
    lineHeight: 15,
    fontWeight: "700",
    textAlign: "left",
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
  itemCreatedAt: {
    marginLeft: 110,
    marginTop: 3,
    fontSize: 13,
    color: "#597ae8",
    fontWeight: "600",
  },
  subContainer3: {
  flexDirection: "row",
  display: "grid",
  },
});
