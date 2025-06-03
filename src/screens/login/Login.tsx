import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Button from "../../components/Button";
import { TextInput } from "react-native-gesture-handler";
import { useAuth } from "../../hooks/useAuth";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { onLogin } = useAuth();

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await onLogin(email, senha);
      navigation.replace("Home");
    } catch (e) {
      setError(e.message || "Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !email || !senha || loading;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ENTRAR</Text>
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
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        placeholderTextColor="#222"
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity
        style={[styles.button, isDisabled && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isDisabled}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <Text style={styles.link} onPress={() => navigation.navigate("SignUp")}>Criar nova conta</Text>
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
  },
  error: {
    color: "red",
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
});
