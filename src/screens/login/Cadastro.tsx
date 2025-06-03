import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useAuth } from "../../hooks/useAuth";

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { onRegister } = useAuth();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    setError("");
    if (!isValidEmail(email)) {
      setError("Email inválido. Use um formato válido como exemplo@dominio.com");
      return;
    }
    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      await onRegister(nome, email, senha, confirmarSenha);
      navigation.replace("Login");
    } catch (e) {
      setError(e.message || "Erro ao registrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !nome || !email || !senha || !confirmarSenha || loading;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRIAR</Text>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        placeholderTextColor="#222"
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#222"
      />
      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        placeholderTextColor="#222"
      />
      <Text style={styles.label}>Confirmar senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirmar senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
        placeholderTextColor="#222"
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity
        style={[styles.button, isDisabled && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={isDisabled}
      >
        <Text style={styles.buttonText}>Criar</Text>
      </TouchableOpacity>
      <Text style={styles.link} onPress={() => navigation.goBack()}>Voltar</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0074d9",
    textAlign: "center",
    marginBottom: 32,
    marginTop: 16,
    letterSpacing: 1,
  },
  label: {
    color: "#222",
    fontWeight: "bold",
    marginBottom: 4,
    marginLeft: 2,
  },
  input: {
    backgroundColor: "#00bfff",
    color: "#222",
    borderRadius: 6,
    padding: 12,
    marginBottom: 18,
    fontSize: 16,
    borderWidth: 0,
  },
  button: {
    backgroundColor: "#bdbdbd",
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
    opacity: 1,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#444",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    textAlign: "center",
    color: "#222",
    fontSize: 12,
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  error: {
    color: "red",
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
});
