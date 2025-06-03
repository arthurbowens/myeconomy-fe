import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { saveLimit, getLimitByMonth, updateLimit, deleteLimit } from '../services/LimiteService';
import { useAuth } from '../hooks/useAuth';
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function Limite({ navigation }) {
  const { user } = useAuth();
  const [valor, setValor] = useState('');
  const [mesCadastro, setMesCadastro] = useState(() => { // Picker para cadastro de limite
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [mesConsulta, setMesConsulta] = useState(() => { // Picker para consulta de limite
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [error, setError] = useState('');
  const [consultedLimit, setConsultedLimit] = useState(null);
  const [editMode, setEditMode] = useState(false);
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

  const carregarLimiteConsultado = async (mes) => {
    if (!user) return;
    try {
      const limit = await getLimitByMonth(mes, user.email);
      setConsultedLimit(limit);
      if (limit) setEditValor(String(limit.valor));
      else setEditValor('');
      setEditMode(false);
    } catch (e) {
      setError(e.message);
      setConsultedLimit(null);
      setEditValor('');
      setEditMode(false);
    }
  };

  useEffect(() => { carregarLimiteConsultado(mesConsulta); }, [mesConsulta, user]);

  const handleSave = async () => {
    setError('');
    if (!valor || !mesCadastro) { setError('Preencha todos os campos.'); return; }
    try {
      await saveLimit({ valor: Number(valor), mes: mesCadastro, email: user.email });
      setValor('');
      // Se o mês salvo for o mesmo do mês de consulta, atualiza a consulta
      if (mesCadastro === mesConsulta) {
        await carregarLimiteConsultado(mesConsulta);
      }
    } catch (e) { setError(e.message); }
  };

  const handleUpdate = async () => {
    setError('');
    if (!editValor) { setError('Preencha o valor para atualizar.'); return; }
    if (!consultedLimit) { setError('Nenhum limite selecionado para atualizar.'); return; }
    try {
      await updateLimit(consultedLimit.id, Number(editValor));
      setEditMode(false);
      await carregarLimiteConsultado(mesConsulta); // Recarrega o limite após atualizar
    } catch (e) { setError(e.message); }
  };

  const handleDelete = () => {
    setError('');
    if (!consultedLimit) { setError('Nenhum limite selecionado para excluir.'); return; }
    Alert.alert('Excluir limite', 'Tem certeza que deseja excluir o limite deste mês?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        try {
          await deleteLimit(consultedLimit.id);
          setConsultedLimit(null);
          setEditValor('');
          setEditMode(false);
        } catch (e) { setError(e.message); }
      }}
    ]);
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Limite</Text>

      {/* Formulário de Cadastro */}
      <View style={styles.formContainer}>
        <TextInput style={styles.input} placeholder="Valor" value={valor} onChangeText={setValor} keyboardType="numeric" />
        <View style={styles.pickerContainer}>
          <Picker selectedValue={mesCadastro} onValueChange={setMesCadastro} style={styles.picker}>
            {mesesOptions().map(m => <Picker.Item key={m} label={getMonthName(m)} value={m} />)}
          </Picker>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSave}><Text style={styles.buttonText}>SALVAR</Text></TouchableOpacity>
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}

      {/* Consulta */}
      <View style={styles.consultaContainer}>
        <Text style={styles.consultaTitle}>Consulta</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={mesConsulta} onValueChange={setMesConsulta} style={styles.picker}>
            {mesesOptions().map(m => <Picker.Item key={m} label={getMonthName(m)} value={m} />)}
          </Picker>
        </View>

        {consultedLimit ? (
          editMode ? (
            <View style={styles.editConsultedContainer}>
              <TextInput style={styles.input} value={editValor} onChangeText={setEditValor} keyboardType="numeric" placeholder="Novo Valor" />
              <View style={styles.editButtonsContainer}>
                <TouchableOpacity style={[styles.button, styles.updateButton]} onPress={handleUpdate}><Text style={styles.buttonText}>ATUALIZAR</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setEditMode(false)}><Text style={styles.buttonText}>CANCELAR</Text></TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.consultedLimitContainer}>
              <Text style={styles.consultedLimitText}>{getMonthName(consultedLimit.mes)} R$ {Number(consultedLimit.valor).toFixed(2)}</Text>
              <View style={styles.consultedButtonsContainer}>
                 <TouchableOpacity style={[styles.actionButton]} onPress={() => setEditMode(true)}><FontAwesome name="pencil" size={20} color="green" /></TouchableOpacity>
                 <TouchableOpacity style={[styles.actionButton]} onPress={handleDelete}><FontAwesome name="trash" size={20} color="red" /></TouchableOpacity>
              </View>
            </View>
          )
        ) : (
          <Text style={styles.noDataText}>Nenhum limite foi encontrado</Text>
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
  consultaContainer: {
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
  consultaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#222',
  },
  consultedLimitContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e0e0e0', // Cinza claro
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  consultedLimitText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  consultedButtonsContainer: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#ffc107', // Amarelo
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#dc3545', // Vermelho
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
   editConsultedContainer: {
    // Estilos para o modo de edição do limite consultado
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
  actionButton: {
    marginLeft: 10,
  },
}); 