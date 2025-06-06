import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "./src/screens/home/Home";
import LimitesScreen from "./src/screens/LimiteScreen";
import DespesasScreen from "./src/screens/DespesasScreen";
import TelaPerfil from "./src/screens/TelaPerfilScreen";
import Login from "./src/screens/login/Login";
import Cadastro from "./src/screens/login/Cadastro";
import { useAuth } from "./src/hooks/useAuth";
import HomeScreen from "./src/screens/HomeScreen";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from "./src/screens/ProfileScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesomeIcons from "@expo/vector-icons/FontAwesome6"

const Stack = createNativeStackNavigator();

const MyTabs = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Perfil: ProfileScreen,
    Limites: LimitesScreen,
    Despesas: DespesasScreen,
  },
});

export default function Layout() {
  const { authState } = useAuth(); 

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          {authState?.authenticated ? (
            <>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerTitle: "Home" }}
              />
              <Stack.Screen
                name="Limite"
                component={Limite}
                options={{ headerTitle: "Limite Mensal" }}
              />
              <Stack.Screen
                name="Despesas"
                component={Despesas}
                options={{ headerTitle: "Despesas" }}
              />
              <Stack.Screen
                name="MeusDados"
                component={ProfileScreen}
                options={{ headerTitle: "Meus Dados" }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerTitle: "Login" }}
              />
              <Stack.Screen
                name="SignUp"
                component={Cadastro}
                options={{ headerTitle: "Nova conta" }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
} 