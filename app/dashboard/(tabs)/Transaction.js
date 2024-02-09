import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

export default function Transaction() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#93C49E" />

      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Image
            source={require("../../../assets/imported/Del_Gallego_Camarines_Sur.png")} style={styles.imageStyle}
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

        <Text style={styles.noteText}>My Transaction</Text>

        <View style={styles.choices}>
          <TouchableOpacity
            style={[
              styles.selection
            ]}
            onPress={() => {
              router.push("../../TrackLiveBirth");
            }}                    >
            <Image source={require("../../../assets/imported/form.png")} style={styles.form} />
            <Text style={styles.selectionText}>Live Birth Registration</Text>
          </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.selection
              ]}
              onPress={() => {
                router.push("../../TrackJobApp");
              }}                    >
              <Image source={require("../../../assets/imported/form.png")} style={styles.form} />
              <Text style={styles.selectionText}>Job Application</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.choices}>
          <TouchableOpacity
            style={[
              styles.selection
            ]}
            onPress={() => {
              router.push("../../TrackDeathCert");
            }}                    >
            <Image source={require("../../../assets/imported/form.png")} style={styles.form} />
            <Text style={styles.selectionText}>Death Certificate</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.selection
            ]}
            onPress={() => {
              router.push("../../TrackDeathReg");
            }}                    >
            <Image source={require("../../../assets/imported/form.png")} style={styles.form} />
            <Text style={styles.selectionText}>Death Registration</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.choices}>
          <TouchableOpacity
            style={[
              styles.selection
            ]}
            onPress={() => {
              router.push("../../TrackMarriageCert");
            }}                    >
            <Image source={require("../../../assets/imported/form.png")} style={styles.form} />
            <Text style={styles.selectionText}>Marriage Certificate</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.selection
            ]}
            onPress={() => {
              router.push("../../TrackMarriageReg");
            }}                    >
            <Image source={require("../../../assets/imported/form.png")} style={styles.form} />
            <Text style={styles.selectionText}>Marriage Registration</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
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
  noteText: {
    fontSize: 25,
    marginBottom: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  choices: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 30,
  },
  selection: {
    width: 100,
    height: 80,
    borderColor: "#307A59",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    padding: 10,
    margin: 5,
  },
  selectionText: {
    textAlign: "center",
    fontSize: 11,
  },
  form: {
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "contain",
    flex: 1,
    width: 30,
    height: 30,
  },
});