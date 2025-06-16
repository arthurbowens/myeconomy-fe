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
    View,
} from "react-native";
//import { AuthContext } from "../contexts/authContext";
import { useAuth } from "../hooks/useAuth";
import { AuthNavigatorRoutesProps } from "../routes/auth.routes";

export function SignUp() {
  const { navigate } = useNavigation<AuthNavigatorRoutesProps>();
  //const { onRegister } = useContext(AuthContext);
  const { onRegister } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateBirthDate = (date: string) => {
    // Formato esperado: DD/MM/YYYY
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(date)) return false;

    const [, day, month, year] = date.match(dateRegex) || [];
    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    return age >= 13 && age <= 120; // Idade mínima e máxima razoável
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      birthDate: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    // Validação do nome
    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Nome deve ter no mínimo 2 caracteres";
      isValid = false;
    }

    // Validação do email
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email inválido";
      isValid = false;
    }

    // Validação da data de nascimento
    if (!formData.birthDate.trim()) {
      newErrors.birthDate = "Data de nascimento é obrigatória";
      isValid = false;
    } else if (!validateBirthDate(formData.birthDate)) {
      newErrors.birthDate = "Data inválida (DD/MM/YYYY)";
      isValid = false;
    }

    // Validação da senha
    if (!formData.password.trim()) {
      newErrors.password = "Senha é obrigatória";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter no mínimo 6 caracteres";
      isValid = false;
    }

    // Validação da confirmação de senha
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirmação da senha é obrigatória";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const formatBirthDate = (text: string) => {
    // Remove tudo que não é número
    const numbers = text.replace(/\D/g, "");
    
    // Aplica máscara DD/MM/YYYY
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    if (field === "birthDate") {
      value = formatBirthDate(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onRegister(
        formData.name.trim(),
        formData.email.trim(),
        formData.birthDate.trim(),
        formData.password,
        formData.confirmPassword
      );
      Alert.alert("Sucesso", "Conta criada com sucesso!", [
        { text: "OK", onPress: () => navigate("signIn") }
      ]);
    } catch (error: any) {
      Alert.alert("Erro no Cadastro", error.message || "Erro desconhecido ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignIn = () => {
    navigate("signIn");
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
          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>CRIAR</Text>
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={[styles.input, errors.name ? styles.inputError : null]}
              value={formData.name}
              onChangeText={(text) => handleInputChange("name", text)}
              placeholder="Digite seu nome completo"
              autoCapitalize="words"
              autoComplete="name"
              editable={!loading}
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              placeholder="Digite seu email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!loading}
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Data de nascimento</Text>
            <TextInput
              style={[styles.input, errors.birthDate ? styles.inputError : null]}
              value={formData.birthDate}
              onChangeText={(text) => handleInputChange("birthDate", text)}
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
              editable={!loading}
            />
            {errors.birthDate ? <Text style={styles.errorText}>{errors.birthDate}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={[styles.input, errors.password ? styles.inputError : null]}
              value={formData.password}
              onChangeText={(text) => handleInputChange("password", text)}
              placeholder="Digite sua senha"
              secureTextEntry
              autoComplete="password-new"
              editable={!loading}
            />
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar senha</Text>
            <TextInput
              style={[styles.input, errors.confirmPassword ? styles.inputError : null]}
              value={formData.confirmPassword}
              onChangeText={(text) => handleInputChange("confirmPassword", text)}
              placeholder="Confirme sua senha"
              secureTextEntry
              autoComplete="password-new"
              editable={!loading}
            />
            {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
          </View>

          <Pressable
            style={[styles.createButton, loading ? styles.createButtonDisabled : null]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.createButtonText}>Criar</Text>
            )}
          </Pressable>

            <Pressable
              style={styles.backButton}
              onPress={navigateToSignIn}
              disabled={loading}
            >
              <Text style={styles.backButtonText}>Voltar</Text>
            </Pressable>
          </View>
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
    padding: 24,
    marginHorizontal: 8,
    //minHeight: "95%",
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
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 16,
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
  createButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
  },
  createButtonDisabled: {
    backgroundColor: "#A5A5A5",
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    alignItems: "center",
    padding: 8,
  },
  backButtonText: {
    color: "#666666",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});