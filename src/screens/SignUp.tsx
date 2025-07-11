import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
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
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    nome: "",
    dataNascimento: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    nome: "",
    dataNascimento: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateBirthDate = (date: string) => {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(date)) return false;

    const [, dia, mes, ano] = date.match(dateRegex) || [];
    const dataNascimento = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
    const hoje = new Date();
    const idade = hoje.getFullYear() - dataNascimento.getFullYear();
    
    return idade >= 13 && idade <= 120;
  };

  const validateForm = () => {
    const newErrors = {
      nome: "",
      dataNascimento: "",
      email: "",
      senha: "",
      confirmarSenha: "",
    };
    let isValid = true;

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
      isValid = false;
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = "Nome deve ter no mínimo 2 caracteres";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email inválido";
      isValid = false;
    }

    if (!formData.dataNascimento.trim()) {
      newErrors.dataNascimento = "Data de nascimento é obrigatória";
      isValid = false;
    } else if (!validateBirthDate(formData.dataNascimento)) {
      newErrors.dataNascimento = "Data inválida (DD/MM/YYYY)";
      isValid = false;
    }

    if (!formData.senha.trim()) {
      newErrors.senha = "Senha é obrigatória";
      isValid = false;
    } else if (formData.senha.length < 6) {
      newErrors.senha = "Senha deve ter no mínimo 6 caracteres";
      isValid = false;
    }

    if (!formData.confirmarSenha.trim()) {
      newErrors.confirmarSenha = "Confirmação da senha é obrigatória";
      isValid = false;
    } else if (formData.confirmarSenha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = "As senhas não coincidem";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const formatBirthDate = (text: string) => {
    const numbers = text.replace(/\D/g, "");
    
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    if (field === "dataNascimento") {
      value = formatBirthDate(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
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
      await signUp({
        nome: formData.nome.trim(),
        dataNascimento: formData.dataNascimento.trim(),
        email: formData.email.trim(),
        senha: formData.senha,
        confirmarSenha: formData.confirmarSenha
      });
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
              style={[styles.input, errors.nome ? styles.inputError : null]}
              value={formData.nome}
              onChangeText={(text) => handleInputChange("nome", text)}
              placeholder="Digite seu nome completo"
              autoCapitalize="words"
              autoComplete="name"
              editable={!loading}
            />
            {errors.nome ? <Text style={styles.errorText}>{errors.nome}</Text> : null}
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
              style={[styles.input, errors.dataNascimento ? styles.inputError : null]}
              value={formData.dataNascimento}
              onChangeText={(text) => handleInputChange("dataNascimento", text)}
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
              editable={!loading}
            />
            {errors.dataNascimento ? <Text style={styles.errorText}>{errors.dataNascimento}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={[styles.input, errors.senha ? styles.inputError : null]}
              value={formData.senha}
              onChangeText={(text) => handleInputChange("senha", text)}
              placeholder="Digite sua senha"
              secureTextEntry
              autoComplete="password-new"
              editable={!loading}
            />
            {errors.senha ? <Text style={styles.errorText}>{errors.senha}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar senha</Text>
            <TextInput
              style={[styles.input, errors.confirmarSenha ? styles.inputError : null]}
              value={formData.confirmarSenha}
              onChangeText={(text) => handleInputChange("confirmarSenha", text)}
              placeholder="Confirme sua senha"
              secureTextEntry
              autoComplete="password-new"
              editable={!loading}
            />
            {errors.confirmarSenha ? <Text style={styles.errorText}>{errors.confirmarSenha}</Text> : null}
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