import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function TelaPerfil({ navigation }) {
  const { user, onLogout } = useAuth();

  const handleLogout = async () => {
    await onLogout();
    navigation.replace('Login');
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Dados</Text>
      <Text style={styles.label}>Nome:</Text>
      <Text style={styles.value}>{user.nome}</Text>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{user.email}</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}><Text style={styles.buttonText}>Sair</Text></TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}><Text style={styles.buttonText}>Voltar</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  label: { fontWeight: 'bold', marginTop: 8 },
  value: { marginBottom: 8 },
  button: { backgroundColor: '#00bfff', borderRadius: 6, padding: 10, margin: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
}); 