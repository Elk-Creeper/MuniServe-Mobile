import { Tabs } from "expo-router/tabs";
import { AntDesign, Ionicons, FontAwesome5 } from "@expo/vector-icons";

export default function AppLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#307A59", // Color when the tab is active
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#FFFFFF" },
        tabBarLabelStyle: { fontWeight: 500, fontSize: 9 },
      }}
    >
      <Tabs.Screen
        name="(tabs)/Home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          tabBarLabel: "Home", // You can set the label here if you want a custom label
        }}
      />

      <Tabs.Screen
        name="(tabs)/News"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper" size={size} color={color} />
          ),
          tabBarLabel: "News", // You can set the label here if you want a custom label
        }}
      />

      <Tabs.Screen
        name="(tabs)/Appointment"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
          tabBarLabel: "Appointment", // You can set the label here if you want a custom label
        }}
      />

      <Tabs.Screen
        name="(tabs)/Transaction"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt" size={size} color={color} />
          ),
          tabBarLabel: "Transaction", // You can set the label here if you want a custom label
        }}
      />

      <Tabs.Screen
        name="(tabs)/User"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          tabBarLabel: "Accounts", // You can set the label here if you want a custom label
        }}
      />
    </Tabs>
  );
}