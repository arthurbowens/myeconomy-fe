import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";
import { View } from "react-native-reanimated/lib/typescript/Animated";
import { StyleSheet } from 'react-native';

export function Routes() {
  // const { authState, isLoading } = useAuth()

  const theme = DefaultTheme;
  theme.colors.background = '#ffffff';

  // if (isLoading) {
  //   return <Loading />
  // }

  return (
    <View>
      <NavigationContainer>
        {/* {authState?.authenticated ? <AppRoutes /> : <AuthRoutes />} */}
        <AppRoutes />
        {/* <AuthRoutes /> */}
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      paddingTop: 40,
      alignItems: 'center',
    },
  }); 