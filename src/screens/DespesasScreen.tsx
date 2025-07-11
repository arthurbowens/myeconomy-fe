import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
  Alert, KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { CategoriaDTO } from '../resources/categoriasResource';
import { DespesaDTO } from '../resources/despesasResource';
import * as categoriasService from '../services/categoriasService';
import * as despesasService from '../services/despesasService';
import { getErrorMessage } from '../utils/errorHandler';

export default function DespesasScreen() {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [mesCadastro, setMesCadastro] = useState<string>('');
  const [meses, setMeses] = useState<string[]>([]);
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [categoriaId, setCategoriaId] = useState<string>('');

  const [despesas, setDespesas] = useState<DespesaDTO[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [mesConsulta, setMesConsulta] = useState('');
  const [despesaConsultada, setDespesaConsultada] = useState<DespesaDTO | null>(null);

  useEffect(() => {
    async function init() {
      await carregarMeses();
      await carregarCategorias();
      await listarDespesas();
    }
    init();
  }, []);

  async function carregarMeses() {
    try {
      const lista = await despesasService.listarMesesSelecao();
      const formatada = lista.map(monthYearToPick);
      
      const mesesAdicionais = ['Abril/2025', 'Maio/2025'];
      const listaMesesCompleta = [...formatada, ...mesesAdicionais];
      
      const listaMesesOrdenada = listaMesesCompleta.sort((a, b) => {
        const [mesA, anoA] = a.split('/');
        const [mesB, anoB] = b.split('/');
        
        const mesesMap: Record<string, number> = {
          Janeiro: 1, Fevereiro: 2, Março: 3, Abril: 4, Maio: 5, Junho: 6,
          Julho: 7, Agosto: 8, Setembro: 9, Outubro: 10, Novembro: 11, Dezembro: 12
        };
        
        const dataA = parseInt(anoA) * 100 + mesesMap[mesA];
        const dataB = parseInt(anoB) * 100 + mesesMap[mesB];
        
        return dataA - dataB;
      });
      
      setMeses(listaMesesOrdenada);
      if (listaMesesOrdenada.length && !mesCadastro) setMesCadastro(listaMesesOrdenada[0]);
    } catch (error) {
      console.error('Erro ao buscar meses', error);
    }
  }

  async function listarDespesas() {
    try {
      const lista = await despesasService.listarDespesasUsuario();
      setDespesas(lista);
    } catch (error) {
      console.error('Erro ao listar despesas', error);
    }
  }

  async function refreshDespesas() {
    if (mesConsulta) {
      await handleConsulta(mesConsulta);
    } else {
      await listarDespesas();
    }
  }

  async function carregarCategorias() {
    try {
      const lista = await categoriasService.listarCategoriasService();
      setCategorias(lista);
      if (lista.length && !categoriaId) setCategoriaId(lista[0].id);
    } catch (error) {
      console.error('Erro ao buscar categorias', error);
    }
  }

  function handleSalvar() {
    if (!descricao.trim()) {
      Alert.alert('Erro', 'Descrição é obrigatória');
      return;
    }
    if (!valor.trim()) {
      Alert.alert('Erro', 'Valor é obrigatório');
      return;
    }
    if (!mesCadastro) {
      Alert.alert('Erro', 'Mês é obrigatório');
      return;
    }
    if (!categoriaId) {
      Alert.alert('Erro', 'Categoria é obrigatória');
      return;
    }
    const valorNumber = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNumber) || valorNumber <= 0) {
      Alert.alert('Erro', 'Valor deve ser um número maior que zero');
      return;
    }
    if (editingId) {
      atualizar(editingId, descricao.trim(), valorNumber, mesCadastro, categoriaId);
    } else {
      cadastrar(descricao.trim(), valorNumber, mesCadastro, categoriaId);
    }
  }

  async function cadastrar(desc: string, val: number, mes: string, catId: string) {
    try {
      await despesasService.cadastrarDespesa(desc, val, mes, catId);
      resetForm();
      Toast.show({ type: 'success', text1: 'Despesa salva com sucesso' });
    } catch (error: any) {
      console.error('Erro ao cadastrar despesa', error);
      Alert.alert('Erro', getErrorMessage(error));
    }
  }

  async function atualizar(id: string, desc: string, val: number, mes: string, catId: string) {
    try {
      await despesasService.atualizarDespesa(id, desc, val, mes, catId);
      resetForm();
      Toast.show({ type: 'success', text1: 'Despesa atualizada' });
    } catch (error) {
      console.error('Erro ao atualizar despesa', error);
      Alert.alert('Erro', getErrorMessage(error));
    }
  }

  async function excluir(id?: string) {
    if (!id) return;
    try {
      await despesasService.excluirDespesa(id);
      refreshDespesas();
      Toast.show({ type: 'success', text1: 'Despesa excluída' });
    } catch (error) {
      console.error('Erro ao excluir despesa', error);
      Toast.show({ type: 'error', text1: getErrorMessage(error) });
    }
  }

  function resetForm() {
    setDescricao('');
    setValor('');
    setEditingId(null);
    refreshDespesas();
  }

  async function handleConsulta(mes: string) {
    setMesConsulta(mes);
    if (mes === '') {
      setDespesaConsultada(null);
      await listarDespesas();
      return;
    }
    try {
      const lista = await despesasService.listarDespesasPorMesPick(mes);
      if (lista.length > 0) {
        setDespesaConsultada(null);
        setDespesas(lista);
      } else {
        setDespesas([]);
      }
    } catch (error) {
      console.error('Erro ao consultar despesas por mês', error);
      Toast.show({ type: 'error', text1: getErrorMessage(error) });
      setDespesas([]);
    }
  }

  function monthYearToPick(ym: string) {
    const [year, month] = ym.split('-');
    const map: Record<string, string> = {
      '01': 'Janeiro',
      '02': 'Fevereiro',
      '03': 'Março',
      '04': 'Abril',
      '05': 'Maio',
      '06': 'Junho',
      '07': 'Julho',
      '08': 'Agosto',
      '09': 'Setembro',
      '10': 'Outubro',
      '11': 'Novembro',
      '12': 'Dezembro',
    };
    return `${map[month]}/${year}`;
  }

  const listaParaMostrar = despesas;

  const formatValue = (text: string) => {
    const numbers = text.replace(/[^\d,.]/g, "");
    
    const parts = numbers.split(/[,.]/);
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
    return numbers;
  };

  const handleValueChange = (text: string) => {
    const formatted = formatValue(text);
    setValor(formatted);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.contentWrapper}>
      <Text style={styles.title}>Despesa</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.input}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Digite a descrição"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Valor</Text>
        <TextInput
          style={styles.input}
          value={valor}
          onChangeText={handleValueChange}
          placeholder="0.00"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Mês</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={mesCadastro} onValueChange={setMesCadastro} dropdownIconColor="#000">
            {meses.map((m) => (
              <Picker.Item label={m} value={m} key={m} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={categoriaId} onValueChange={setCategoriaId} dropdownIconColor="#000">
            {categorias.map((c) => (
              <Picker.Item label={c.nome} value={c.id} key={c.id} />
            ))}
          </Picker>
        </View>
      </View>

                {editingId ? (
            <View style={styles.buttonRow}>
              <Pressable style={styles.cancelButton} onPress={resetForm}>
                <Text style={styles.cancelButtonText}>CANCELAR</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={handleSalvar}>
                <Text style={styles.saveButtonText}>EDITAR</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.saveButtonFull} onPress={handleSalvar}>
              <Text style={styles.saveButtonText}>SALVAR</Text>
            </Pressable>
          )}

      <Text style={styles.consultaTitle}>Histórico</Text>

      <View style={styles.pickerConsultaWrapper}>
        <Picker selectedValue={mesConsulta} onValueChange={handleConsulta} dropdownIconColor="#000">
          <Picker.Item label="Selecione um mês" value="" />
          {meses.map((m) => (
            <Picker.Item label={m} value={m} key={m} />
          ))}
        </Picker>
      </View>

      <ScrollView style={styles.listScroll} contentContainerStyle={{paddingBottom:32}}>
        {listaParaMostrar.map((d) => (
          <View key={d.id} style={styles.despesaItem}>
            <View style={{ flexDirection: 'column', gap: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={styles.despesaNome}>{d.descricao}</Text>
                <Text style={styles.despesaValor}>{`R$${d.valor.toFixed(2)}`}</Text>
              </View>
              <Text style={styles.despesaMes}>{monthYearToPick(d.mesReferencia)}</Text>
            </View>
            <View style={styles.despesaBotoes}>
              <Pressable style={styles.iconButton} onPress={() => {
                setDescricao(d.descricao);
                setValor(d.valor.toString());
                setMesCadastro(monthYearToPick(d.mesReferencia));
                setCategoriaId(d.categoria?.id ?? '');
                setEditingId(d.id ?? null);
              }}>
                <Ionicons name="pencil" size={18} color="#fff" />
              </Pressable>
              <Pressable style={styles.iconButton} onPress={() => excluir(d.id)}>
                <MaterialIcons name="delete" size={18} color="#fff" />
              </Pressable>
            </View>
          </View>
        ))}

        {mesConsulta && listaParaMostrar.length === 0 && (
          <Text style={styles.resultText}>Nenhuma despesa encontrada</Text>
        )}
      </ScrollView>
      </View>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentWrapper: {
    flex:1,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  listScroll:{
    flex:1,
    marginTop:8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: '#000000',
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 48,
    width: '100%',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#35b559',
    borderRadius: 8,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  saveButtonFull: {
    backgroundColor: '#35b559',
    borderRadius: 8,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: '#ff4444',
    borderRadius: 8,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  consultaTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  pickerConsultaWrapper: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 6,
    marginBottom: 8,
  },
  despesaItem: {
    backgroundColor: '#35b55933',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  despesaNome: {
    color: '#000',
    fontWeight: '700',
  },
  despesaValor: {
    color: '#000',
    fontWeight: '700',
  },
  despesaMes: {
    color: '#666',
    fontSize: 12,
  },
  despesaBotoes: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    backgroundColor: '#35b559',
    borderRadius: 4,
    padding: 6,
  },
  resultText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#000000',
  },
});
