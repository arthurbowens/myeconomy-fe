import {
    createNativeStackNavigator,
    NativeStackNavigationProp,
  } from "@react-navigation/native-stack";
import Login from "../screens/login/Login";
import Cadastro from "../screens/login/Cadastro";

  type AuthRoutes = {
    login: undefined;
    cadastro: undefined;
  };
  
  export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>;
  
  const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();
  
  export function AuthRoutes() {
    return (
      <Navigator screenOptions={{ headerShown: false }}>
        <Screen name="login" component={Login} />
  
        <Screen name="cadastro" component={Cadastro} />
      </Navigator>
    );
  }