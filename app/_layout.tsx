import FontAwesome from "@expo/vector-icons";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { Tabs } from "expo-router/tabs";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View, useColorScheme } from "react-native";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {



 // Expo Router uses Error Boundaries to catch errors in the navigation tree.
 
 useEffect(() => {

     SplashScreen.hideAsync();
   
 }, []);



  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View className="flex-1 py-5">
      <Stack screenOptions={{ headerShown: false }} />
      </View>
      <StatusBar style="auto"/>
    </ThemeProvider>
  );
}