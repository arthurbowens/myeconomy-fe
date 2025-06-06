import {
    BottomTabNavigationProp,
    createBottomTabNavigator,
  } from "@react-navigation/bottom-tabs";
  import { Platform } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesomeIcons from "@expo/vector-icons/FontAwesome6";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LimitesScreen from "../screens/LimiteScreen";
import DespesasScreen from "../screens/DespesasScreen";

  const MyTabs = createBottomTabNavigator({
      screens: {
          Home: HomeScreen,
          Perfil: ProfileScreen,
          Limites: LimitesScreen,
          Despesas: DespesasScreen,
      },
      id: undefined
  });
  
 
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
      <Navigator
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
              <Ionicons name="checkmark-circle" size={32} color="red">

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
                <Ionicons name="checkmark-circle" size={32} color="red">

              </Ionicons>
              
            ),
            tabBarLabel: "Início",
          }}
        />
  
        <Screen
          name="despesas"
          component={DespesasScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
                <Ionicons name="checkmark-circle" size={32} color="red">

                </Ionicons>
            ),
            tabBarLabel: "Despesas",
          }}
        />
  
        <Screen
          name="limites"
          component={LimitesScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
                <Ionicons name="checkmark-circle" size={32} color="red">

                </Ionicons>
            ),
            tabBarLabel: "Limites",
          }}
        />
      </Navigator>
    );
  }