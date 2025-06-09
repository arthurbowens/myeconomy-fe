import { useNavigation } from "@react-navigation/native";
import { Pressable, Text, View } from "react-native";
import { AuthNavigatorRoutesProps } from "../routes/auth.routes";

export function SignUp() {
    const { navigate } = useNavigation<AuthNavigatorRoutesProps>();
    
    return (
        <View>
            <Pressable onPress={() => navigate("signUp")}>
                <Text>Ir para SignUp</Text>
            </Pressable>
        </View>
    );

}