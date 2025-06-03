import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { StatusBar } from "expo-status-bar";
import { getLimitByMonth } from "../../services/LimiteService";
import { getExpensesByMonth } from "../../services/DespesasService";
import { useAuth } from "../../hooks/useAuth";
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

console.log("Home.tsx carregado!");

export default function Home({ navigation }) {
  const { user, onLogout } = useAuth();
  const [mes, setMes] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [limit, setLimit] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [feedback, setFeedback] = useState({ tipo: 'sem-info', valor: 0 });

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const l = await getLimitByMonth(mes, user.email);
      setLimit(l);
      const e = await getExpensesByMonth(mes, user.email);
      setExpenses(e);
      let total = e.reduce((sum, d) => sum + Number(d.valor), 0);
      if (!l && e.length === 0) setFeedback({ tipo: 'sem-info', valor: 0 });
      else if (!l && e.length > 0) setFeedback({ tipo: 'sem-limite', valor: total });
      else if (l && total <= l.valor) setFeedback({ tipo: 'economizou', valor: l.valor - total });
      else if (l && total > l.valor) setFeedback({ tipo: 'nao-economizou', valor: total - l.valor });
    };
    fetchData();
  }, [mes, user]);

  const handleLogout = async () => {
    try {
      await onLogout();
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível fazer logout.");
    }
  };

  const getMonthName = (mes: string) => {
    const [year, month] = mes.split('-');
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  };

  // UI de feedback
  const renderFeedback = () => {
    if (feedback.tipo === 'sem-info') {
      return (
        <View style={[styles.card, styles.cardSemInfo]}>
          <Text style={styles.cardTitle}>Olá {user?.nome} 👋</Text>
          <Text style={styles.feedbackText}>É bom te ver por aqui</Text>
          <MaterialCommunityIcons name="emoticon-neutral-outline" size={60} color="#ffc107" style={styles.feedbackIcon} />
          <Text style={styles.progressText}>Progresso não encontrado</Text>
          <TouchableOpacity style={styles.cardButton} onPress={() => navigation.navigate('Limite')}>
            <Text style={styles.cardButtonText}>COMEÇAR</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (feedback.tipo === 'sem-limite') {
      const totalExpenses = expenses.reduce((sum, d) => sum + Number(d.valor), 0);
      return (
        <View style={[styles.card, styles.cardSemLimite]}>
          <Text style={styles.cardTitle}>Olá {user?.nome} 👋</Text>
          <Text style={styles.feedbackText}>É bom te ver por aqui</Text>
           {renderBarra(totalExpenses, null)}
          <TouchableOpacity style={styles.cardButton} onPress={() => navigation.navigate('Limite')}>
            <Text style={styles.cardButtonText}>Cadastrar Limite</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (feedback.tipo === 'economizou') {
      const totalExpenses = expenses.reduce((sum, d) => sum + Number(d.valor), 0);
      return (
        <View style={[styles.card, styles.cardEconomizou]}>
          <Text style={styles.cardTitle}>Olá {user?.nome} 👋</Text>
          <Text style={styles.feedbackText}>É bom te ver por aqui</Text>
          <FontAwesome name="trophy" size={60} color="gold" style={styles.feedbackIcon} />
          <Text style={styles.progressText}>Parabéns, você economizou!</Text>
          <Text style={styles.valueText}>R$ {feedback.valor.toFixed(2)}</Text>
           {renderBarra(totalExpenses, limit?.valor)}
        </View>
      );
    }
    if (feedback.tipo === 'nao-economizou') {
      const totalExpenses = expenses.reduce((sum, d) => sum + Number(d.valor), 0);
      return (
        <View style={[styles.card, styles.cardNaoEconomizou]}>
          <Text style={styles.cardTitle}>Olá {user?.nome} 👋</Text>
          <Text style={styles.feedbackText}>É bom te ver por aqui</Text>
          <FontAwesome name="frown-o" size={60} color="orange" style={styles.feedbackIcon} />
          <Text style={styles.progressText}>Objetivo não atingido</Text>
          <Text style={styles.valueText}>-R$ {feedback.valor.toFixed(2)}</Text>
           {renderBarra(totalExpenses, limit?.valor)}
        </View>
      );
    }
    return null;
  };

  // Barra de progresso
  const renderBarra = (total, max) => {
    const percent = max ? Math.min(1, total / max) : 1;
    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${percent * 100}%`, backgroundColor: percent > 1 || max === null ? '#ff4444' : '#90ee90' }]} />
        <Text style={styles.progressLabel}>Progresso</Text>
        <Text style={styles.progressValue}>R$ {total.toFixed(2)}/{max !== null ? `R$${max.toFixed(2)}` : '0.00'}</Text>
      </View>
    );
  };

  // Filtro de mês
  const renderMesPicker = () => {
    const now = new Date();
    const meses = [];
    // Gerar opções para os últimos 12 meses
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      meses.push(m);
    }
    return (
      <View style={styles.pickerContainer}>
        <Picker selectedValue={mes} onValueChange={setMes} style={styles.picker}>
          {meses.map(m => <Picker.Item key={m} label={getMonthName(m)} value={m} />)}
        </Picker>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
       <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>Olá {user?.nome} 👋</Text>
       </View>
      {renderMesPicker()}
      {renderFeedback()}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('MeusDados')}>
           <FontAwesome name="user" size={24} color="black" />
          <Text style={styles.menuButtonText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Home')}>
           <Ionicons name="home" size={24} color="black" />
          <Text style={styles.menuButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Despesas')}>
           <MaterialCommunityIcons name="currency-usd" size={24} color="black" />
          <Text style={styles.menuButtonText}>Despesas</Text>
        </TouchableOpacity>
        {/* O quarto ícone da imagem não tem função clara no documento, vou adicionar um de engrenagem para Configurações se houver necessidade futura */}
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Limite')}>
           <Ionicons name="settings" size={24} color="black" />
          <Text style={styles.menuButtonText}>Config</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: 'center',
    paddingTop: 40,
  },
   greetingContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 8,
   },
   greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
   },
  pickerContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
    marginBottom: 16,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  card: {
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: '90%',
    marginBottom: 16,
  },
  cardSemInfo: {
    backgroundColor: "#fff",
  },
  cardSemLimite: {
    backgroundColor: "#fff",
  },
  cardEconomizou: {
    backgroundColor: '#90ee90', // verde claro
  },
  cardNaoEconomizou: {
    backgroundColor: '#ffcccb', // vermelho claro
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
    textAlign: 'center',
  },
  feedbackText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
    textAlign: 'center',
  },
  emojiImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  cardButton: {
    backgroundColor: '#00bfff',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 12,
  },
  cardButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  progressBarContainer: {
    width: '100%',
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginTop: 12,
    overflow: 'hidden', // Para garantir que a barra interna respeite o borderRadius
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#90ee90', // Cor da barra de progresso padrão (verde)
    borderRadius: 10,
  },
   progressLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#222',
    position: 'absolute',
    top: 2,
    left: 10,
   },
   progressValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#222',
    position: 'absolute',
    top: 2,
    right: 10,
   },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#4CAF50',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  menuButton: {
    alignItems: 'center',
    flex: 1,
  },
  menuButtonText: {
    color: '#222',
    fontWeight: 'normal',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
   progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0074d9',
    marginBottom: 8,
    textAlign: 'center',
   },
    valueText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
    textAlign: 'center',
   },
   feedbackIcon: {
    marginBottom: 12,
   },
});
