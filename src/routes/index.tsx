import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";
import { SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export function Routes() {
  const { authState, isLoading } = useAuth();

  const theme = DefaultTheme;
  theme.colors.background = '#ffffff';

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#008000" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer theme={theme}>
        {authState?.authenticated ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </SafeAreaView>
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