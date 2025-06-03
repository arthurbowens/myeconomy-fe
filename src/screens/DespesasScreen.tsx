import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { saveExpense, getExpensesByMonth, updateExpense, deleteExpense } from '../services/DespesasService';
import { useAuth } from '../hooks/useAuth';
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function Despesas({ navigation }) {
  const { user } = useAuth();
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [mesCadastro, setMesCadastro] = useState(() => { // Picker para cadastro de despesa
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [mesHistorico, setMesHistorico] = useState(() => { // Picker para histórico de despesa
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [error, setError] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editDescricao, setEditDescricao] = useState('');
  const [editValor, setEditValor] = useState('');

  const getMonthName = (mes: string) => {
    const [year, month] = mes.split('-');
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const mesesOptions = () => {
    const now = new Date();
    const meses = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      meses.push(m);
    }
    return meses;
  };

  const carregarExpenses = async (mes) => {
    if (!user) return;
    try {
      const data = await getExpensesByMonth(mes, user.email);
      setFilteredExpenses(data);
    } catch (e) {
      setError(e.message);
      setFilteredExpenses([]);
    }
  };

  useEffect(() => { carregarExpenses(mesHistorico); }, [mesHistorico, user]);

  const handleSave = async () => {
    setError('');
    if (!descricao || !valor || !mesCadastro) { setError('Preencha todos os campos.'); return; }
    try {
      await saveExpense({ descricao, valor: Number(valor), mes: mesCadastro, email: user.email });
      setDescricao(''); setValor('');
      await carregarExpenses(mesHistorico); // Recarregar histórico após salvar
    } catch (e) { setError(e.message); }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setEditDescricao(item.descricao);
    setEditValor(String(item.valor));
  };

  const handleUpdate = async () => {
    setError('');
    try {
      await updateExpense(editId, { descricao: editDescricao, valor: Number(editValor) });
      setEditId(null); setEditDescricao(''); setEditValor('');
      await carregarExpenses(mesHistorico); // Recarregar histórico após atualizar
    } catch (e) { setError(e.message); }
  };

  const handleDelete = (id) => {
    Alert.alert('Excluir despesa', 'Tem certeza que deseja excluir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        try { await deleteExpense(id); await carregarExpenses(mesHistorico); } catch (e) { setError(e.message); }
      }}
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.expenseItem}>
      {editId === item.id ? (
        <View>
          <TextInput style={styles.input} value={editDescricao} onChangeText={setEditDescricao} placeholder="Descrição" />
          <TextInput style={styles.input} value={editValor} onChangeText={setEditValor} keyboardType="numeric" placeholder="Valor" />
          <View style={styles.editButtonsContainer}>
             <TouchableOpacity style={[styles.button, styles.updateButton]} onPress={handleUpdate}><Text style={styles.buttonText}>Atualizar</Text></TouchableOpacity>
             <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setEditId(null)}><Text style={styles.buttonText}>Cancelar</Text></TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.itemDetails}>
          <Text style={styles.itemText}>{item.descricao}</Text>
          <Text style={styles.itemText}>R$ {Number(item.valor).toFixed(2)}</Text>
           <View style={styles.itemActions}>
             <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}><FontAwesome name="pencil" size={20} color="green" /></TouchableOpacity>
             <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}><FontAwesome name="trash" size={20} color="red" /></TouchableOpacity>
           </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Despesas</Text>

      {/* Formulário de Cadastro */}
      <View style={styles.formContainer}>
        <TextInput style={styles.input} placeholder="Descrição" value={descricao} onChangeText={setDescricao} />
        <TextInput style={styles.input} placeholder="Valor" value={valor} onChangeText={setValor} keyboardType="numeric" />
        <View style={styles.pickerContainer}>
          <Picker selectedValue={mesCadastro} onValueChange={setMesCadastro} style={styles.picker}>
            {mesesOptions().map(m => <Picker.Item key={m} label={getMonthName(m)} value={m} />)}
          </Picker>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSave}><Text style={styles.buttonText}>SALVAR</Text></TouchableOpacity>
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}

      {/* Histórico */}
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Histórico</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={mesHistorico} onValueChange={setMesHistorico} style={styles.picker}>
            {mesesOptions().map(m => <Picker.Item key={m} label={getMonthName(m)} value={m} />)}
          </Picker>
        </View>
        {filteredExpenses.length > 0 ? (
           <FlatList
            data={filteredExpenses}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
           />
        ) : (
          <Text style={styles.noDataText}>Nenhuma despesa encontrada</Text>
        )}

      </View>

      {/* Menu Inferior */}
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
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#222',
  },
  formContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pickerContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
    marginBottom: 8,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#4CAF50', // Verde
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 8,
    textAlign: 'center',
  },
  historyContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    flex: 1, // Para ocupar o espaço restante
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#222',
  },
  listContent: {
    paddingBottom: 16, // Espaço no final da lista antes do menu
  },
  expenseItem: {
    backgroundColor: '#e0e0e0', // Cinza claro
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
   itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
   },
   itemText: {
    fontSize: 16,
    color: '#222',
   },
   itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
   },
   actionButton: {
    marginLeft: 10,
   },
   editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
   },
   updateButton: {
    backgroundColor: '#ffc107', // Amarelo
    flex: 1,
    marginRight: 4,
   },
   cancelButton: {
    backgroundColor: '#dc3545', // Vermelho
    flex: 1,
    marginLeft: 4,
   },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#4CAF50', // Fundo verde para o menu
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  menuButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  menuButtonText: {
    color: '#fff',
    fontWeight: 'normal',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
}); 