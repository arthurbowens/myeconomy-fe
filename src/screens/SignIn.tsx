import { Pressable, Text, View } from "react-native";
import { AuthNavigatorRoutesProps } from "../routes/auth.routes";
import { useNavigation } from "@react-navigation/native";

export function SignIn() {
    const { navigate } = useNavigation<AuthNavigatorRoutesProps>();
    
    return (
        <View>
            <Pressable  onPress={() => navigate("signIn")}>
                <Text>Ir para SignIn</Text>
            </Pressable>
        </View>
    );

}