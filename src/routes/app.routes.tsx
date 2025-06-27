import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DespesasScreen from "../screens/DespesasScreen";
import HomeScreen from "../screens/HomeScreen";
import LimitesScreen from "../screens/LimiteScreen";
import ProfileScreen from "../screens/ProfileScreen";
  
  type AppRoutes = {
    home: undefined;
    perfil: undefined;
    despesas: {
      id?: string;
    };
    limites: {
      id?: string;
    };
  };
  
  export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;
  
  const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();
  
  export function AppRoutes() {
  
    return (
      <Navigator id={undefined}
        initialRouteName="home"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#ffffff',
          tabBarStyle: {
            backgroundColor: '#008000',
            borderTopWidth: 0,
            height: Platform.OS === "android" ? 96 : 96,
            paddingBottom: 12,
            paddingTop: 4,
            paddingHorizontal: 4,
          },
          tabBarLabelStyle: {
            marginTop: 4,
            fontSize: 14,
          },
        }}
      >
        <Screen
          name="perfil"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name="person" size={32} color="white">

              </Ionicons>
            ),
            tabBarLabel: "Perfil",
          }}
        />
  
        <Screen
          name="home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
                <MaterialIcons name="monetization-on" size={32} color="white">

              </MaterialIcons>
              
            ),
            tabBarLabel: "Início",
          }}
        />
  
        <Screen
          name="despesas"
          component={DespesasScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
                <MaterialCommunityIcons name="file-plus" size={32} color="white">

                </MaterialCommunityIcons>
            ),
            tabBarLabel: "Despesas",
          }}
        />
  
        <Screen
          name="limites"
          component={LimitesScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
                <Ionicons name="settings-sharp" size={32} color="white">

                </Ionicons>
            ),
            tabBarLabel: "Limites",
          }}
        />
      </Navigator>
    );
  }