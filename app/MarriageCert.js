import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

export default function DeathCert() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#93C49E" />

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
                <TouchableOpacity
                    onPress={() => {
                        router.push("/notif");
                    }}
                >
                    <Ionicons name="notifications-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={styles.boxes1}>
                    <View style={styles.boxAcc}>
                        <Image
                            source={require("../assets/imported/Del_Gallego_Camarines_Sur.png")}
                            style={styles.boxIcon}
                        />
                        <Text style={styles.itemService_name}>
                            Marriage Certificate
                        </Text>
                    </View>
                </View>
                <View style={styles.innerContainer}>
                    <Text style={styles.itemService_desc}>
                        A Marriage Certificate is a document that shows social union or a legal contract between people that creates kinship. Such a union, often formalized via a wedding ceremony, may also be called matrimony. A general definition of marriage is that it is a social contract between two individuals that unites their lives legally, economically and emotionally.  It is an institution in which interpersonal relationships, usually intimate and sexual, are acknowledged in a variety of ways, depending on the culture or subculture in which it is found. The state of being united to a person of the opposite sex as husband or wife in a legal, consensual, and contractual relationship recognized and sanctioned by and dissolvable only by law.  A marriage certificate is a document containing the important details of marriage, signed by the couple and by all in attendance. Marriage occurs during the meeting for worship after approval is obtained from the meetings of which the two people are members. Approval is based on a statement of good character and clearness from any other engagements. The clerk usually records a copy of the marriage certificate in the meeting's records.
                    </Text>
                </View>

                <Text style={styles.noteText}>Please choose services you want to avail</Text>

                <View style={styles.choices}>
                    <TouchableOpacity
                        style={[
                            styles.selection
                        ]}
                        onPress={() => {
                            router.push("/MarriageCertReq");
                        }}                    >
                        <Image source={require("../assets/imported/form.png")} style={styles.form} />
                        <Text style={styles.selectionText}>Request Form</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.selection
                        ]}
                        onPress={() => {
                            router.push("/MarriageReg");
                        }}>
                        <Image source={require("../assets/imported/form.png")} style={styles.form} />
                        <Text style={styles.selectionText}>Registration Form</Text>
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
    boxes1: {
        width: "100%",
        height: 65,
        backgroundColor: "#307A59",
        borderRadius: 15,
        marginBottom: 30,
        marginTop: 15,
    },
    boxAcc: {
        flexDirection: "row",
    },
    boxIcon: {
        marginTop: 12,
        marginLeft: 15,
        width: 40,
        height: 40,
    },
    innerContainer: {
        alignContent: "center",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    itemService_name: {
        marginLeft: 20,
        color: "white",
        fontSize: 18,
        marginTop: 19,
    },
    itemService_desc: {
        fontWeight: "300",
        fontSize: 15,
        textAlign: "justify",
        lineHeight: 30,
    },
    noteText: {
        fontSize: 17,
        textAlign: "justify",
        marginTop: 20,
        marginBottom: 20,
        fontWeight: "500",
    },
    choices: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 30,
    },
    selection: {
        width: 120,
        height: 100,
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
        marginBottom: 10,
        fontSize: 11,
    },
    form: {
        justifyContent: "center",
        alignItems: "center",
        resizeMode: "contain",
        flex: 1,
        width: 50,
        height: 50,
    },
});