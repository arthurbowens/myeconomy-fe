import React from "react";
import { SafeAreaView, View, Text, StyleSheet, Pressable } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { UserDTO } from "../resources/usuarioResource";
import * as userService from '../services/usuarioService';

export default function ProfileScreen() {
  const { user: contextUser, signOut } = useAuth();

  const [user, setUser] = useState<UserDTO | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const fetchedUser = await userService.getAuthenticatedUserService();
        setUser(fetchedUser);
      } catch (error) {
        // fallback to context user if fetch fails
        setUser(contextUser);
        console.error('Erro ao buscar usuário autenticado', error);
      }
    }

    loadUser();
  }, []);

  function handleSignOut() {
    signOut();
  }

  function formatDate(date?: string) {
    if (!date) return "";
    const d = new Date(date);
    const day = `${d.getDate()}`.padStart(2, "0");
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Meus Dados</Text>

      <View style={styles.infoSection}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>{user?.nome ?? "-"}</Text>

        <Text style={[styles.label, styles.spacingTop]}>Email</Text>
        <Text style={styles.value}>{user?.email ?? "-"}</Text>

        <Text style={[styles.label, styles.spacingTop]}>Data de nascimento</Text>
        <Text style={styles.value}>{formatDate(user?.dataNascimento)}</Text>
      </View>

      <Pressable style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>SAIR</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
    paddingTop: 48,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
    marginTop: 0,
    color: "#000000",
  },
  infoSection: {
    flexDirection: "column",
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
  value: {
    fontSize: 16,
    color: "#000000",
  },
  spacingTop: {
    marginTop: 24,
  },
  signOutButton: {
    marginTop: 40,
    alignSelf: "center",
    width: "100%",
    backgroundColor: "#35b559",
    borderRadius: 8,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  signOutText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
});