import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "../screens/home/Home";
import Login from "../screens/login/Login";
import Cadastro from "../screens/login/Cadastro.tsx";
import Limite from "../screens/LimiteScreen.tsx";
import Despesas from "../screens/DespesasScreen.tsx";
import TelaPerfil from "../screens/TelaPerfilScreen.tsx";
import { useAuth } from "../hooks/useAuth";  

const Stack = createNativeStackNavigator();

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
                component={Home}
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
                component={TelaPerfil}
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