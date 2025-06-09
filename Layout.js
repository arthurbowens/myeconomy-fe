import { StatusBar, SafeAreaView } from "react-native";
import { Routes } from "./src/routes";

export default function Layout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Routes />
    </SafeAreaView>
  );
}