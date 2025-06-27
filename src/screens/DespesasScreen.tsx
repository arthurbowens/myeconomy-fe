import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { DespesaDTO } from '../resources/despesasResource';
import * as despesasService from '../services/despesasService';

export default function DespesasScreen() {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [mesCadastro, setMesCadastro] = useState<string>('');
  const [meses, setMeses] = useState<string[]>([]);

  const [despesas, setDespesas] = useState<DespesaDTO[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [mesConsulta, setMesConsulta] = useState('');
  const [despesaConsultada, setDespesaConsultada] = useState<DespesaDTO | null>(null);

  useEffect(() => {
    async function init() {
      await carregarMeses();
      await listarDespesas();
    }
    init();
  }, []);

  async function carregarMeses() {
    try {
      const lista = await despesasService.listarMesesSelecao();
      const formatada = lista.map(monthYearToPick);
      setMeses(formatada);
      if (formatada.length && !mesCadastro) setMesCadastro(formatada[0]);
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

  function handleSalvar() {
    if (!descricao.trim() || !valor) return;
    const valorNumber = parseFloat(valor.replace(',', '.'));
    if (editingId) {
      atualizar(editingId, descricao.trim(), valorNumber, mesCadastro);
    } else {
      cadastrar(descricao.trim(), valorNumber, mesCadastro);
    }
  }

  async function cadastrar(desc: string, val: number, mes: string) {
    try {
      await despesasService.cadastrarDespesa(desc, val, mes);
      resetForm();
    } catch (error) {
      console.error('Erro ao cadastrar despesa', error);
    }
  }

  async function atualizar(id: string, desc: string, val: number, mes: string) {
    try {
      await despesasService.atualizarDespesa(id, desc, val, mes);
      resetForm();
    } catch (error) {
      console.error('Erro ao atualizar despesa', error);
    }
  }

  async function excluir(id?: string) {
    if (!id) return;
    try {
      await despesasService.excluirDespesa(id);
      listarDespesas();
    } catch (error) {
      console.error('Erro ao excluir despesa', error);
    }
  }

  function resetForm() {
    setDescricao('');
    setValor('');
    setEditingId(null);
    listarDespesas();
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
          onChangeText={setValor}
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

      <Pressable style={styles.saveButton} onPress={handleSalvar}>
        <Text style={styles.saveButtonText}>{editingId ? 'EDITAR' : 'SALVAR'}</Text>
      </Pressable>

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
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 32,
    color: '#000000',
  },
  formGroup: {
    marginBottom: 24,
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
  saveButton: {
    backgroundColor: '#35b559',
    borderRadius: 8,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  consultaTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
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
