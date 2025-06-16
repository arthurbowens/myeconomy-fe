import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { AuthContext } from "../contexts/authContext";
import { AuthNavigatorRoutesProps } from "../routes/auth.routes";

export function SignIn() {
  const { navigate } = useNavigation<AuthNavigatorRoutesProps>();
  const { onLogin } = useContext(AuthContext);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = "Email é obrigatório";
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Email inválido";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Senha é obrigatória";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter no mínimo 6 caracteres";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignIn = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onLogin(email.trim(), password);
      // A navegação será feita automaticamente pelo contexto de rota principal
    } catch (error: any) {
      Alert.alert("Erro no Login", error.message || "Erro desconhecido ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignUp = () => {
    navigate("signUp");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>ENTRAR</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: "" }));
                }
              }}
              placeholder="Digite seu email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!loading}
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={[styles.input, errors.password ? styles.inputError : null]}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors(prev => ({ ...prev, password: "" }));
                }
              }}
              placeholder="Digite sua senha"
              secureTextEntry
              autoComplete="password"
              editable={!loading}
            />
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          </View>

          <Pressable
            style={[styles.loginButton, loading ? styles.loginButtonDisabled : null]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Entrar</Text>
            )}
          </Pressable>

          <Pressable
            style={styles.signUpButton}
            onPress={navigateToSignUp}
            disabled={loading}
          >
            <Text style={styles.signUpButtonText}>
              Não possui conta? Crie aqui
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 32,
    marginHorizontal: 8,
    //minHeight: "85%",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
  },
  inputError: {
    borderColor: "#FF4444",
    backgroundColor: "#FFF5F5",
  },
  errorText: {
    color: "#FF4444",
    fontSize: 14,
    marginTop: 4,
  },
  loginButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
  },
  loginButtonDisabled: {
    backgroundColor: "#A5A5A5",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  signUpButton: {
    alignItems: "center",
    padding: 8,
  },
  signUpButtonText: {
    color: "#666666",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});