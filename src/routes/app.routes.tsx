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
          tabBarInactiveTintColor: '#c9e1c9',
          tabBarActiveBackgroundColor: '#006400',
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
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={focused ? 36 : 28}
                color={color}
              />
            ),
            tabBarLabel: "Perfil",
          }}
        />
  
        <Screen
          name="home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons
                name="monetization-on"
                size={focused ? 36 : 28}
                color={color}
              />
            ),
            tabBarLabel: "Início",
          }}
        />
  
        <Screen
          name="despesas"
          component={DespesasScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? 'file-plus' : 'file-plus-outline'}
                size={focused ? 36 : 28}
                color={color}
              />
            ),
            tabBarLabel: "Despesas",
          }}
        />
  
        <Screen
          name="limites"
          component={LimitesScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'settings-sharp' : 'settings-outline'}
                size={focused ? 36 : 28}
                color={color}
              />
            ),
            tabBarLabel: "Limites",
          }}
        />
      </Navigator>
    );
  }