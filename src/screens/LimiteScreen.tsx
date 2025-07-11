import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
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
import Toast from 'react-native-toast-message';
import { LimiteDTO } from '../resources/limitesResource';
import * as limitesService from '../services/limitesService';
import { getErrorMessage } from '../utils/errorHandler';

export default function LimiteScreen() {
  const [valor, setValor] = useState('');
  const [meses, setMeses] = useState<string[]>([]);
  const [mesCadastro, setMesCadastro] = useState<string>('');
  const [mesConsulta, setMesConsulta] = useState<string>('');
  const [limiteEncontrado, setLimiteEncontrado] = useState<number | null>(null);
  const [limites, setLimites] = useState<LimiteDTO[]>([]);
  const [limiteConsultado, setLimiteConsultado] = useState<LimiteDTO | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    async function carregarInicial() {
      await listar();
      await carregarMesesDisponiveis();
    }
    carregarInicial();
  }, []);

  async function carregarMesesDisponiveis() {
    try {
      const lista = await limitesService.listarMesesSelecao();
      const listaFormatada = lista.map(monthYearToPick);
      
      const mesesAdicionais = ['Abril/2025', 'Maio/2025'];
      const listaMesesCompleta = [...listaFormatada, ...mesesAdicionais];
      
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
      if (listaMesesOrdenada.length && !mesCadastro) {
        setMesCadastro(listaMesesOrdenada[0]);
      }
    } catch (error) {
      console.error('Erro ao buscar meses', error);
    }
  }

  function handleSalvar() {
    if (!valor.trim()) {
      Alert.alert('Erro', 'Valor é obrigatório');
      return;
    }
    if (!mesCadastro) {
      Alert.alert('Erro', 'Mês é obrigatório');
      return;
    }
    const valorNumber = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNumber) || valorNumber <= 0) {
      Alert.alert('Erro', 'Valor deve ser um número maior que zero');
      return;
    }
    if (editingId) {
      atualizar();
    } else {
      cadastrar();
    }

    async function cadastrar() {
      try {
        await limitesService.cadastrarLimite(valorNumber, mesCadastro);
        resetForm();
        Toast.show({ type: 'success', text1: 'Limite salvo' });
      } catch (error: any) {
        console.error('Erro ao salvar limite', error);
        Alert.alert('Erro', getErrorMessage(error));
      }
    }

    async function atualizar() {
      try {
        await limitesService.atualizarLimite(editingId!, valorNumber, mesCadastro);
        resetForm();
        Toast.show({ type: 'success', text1: 'Limite atualizado' });
      } catch (error) {
        console.error('Erro ao atualizar limite', error);
        Alert.alert('Erro', getErrorMessage(error));
      }
    }
  }

  function resetForm() {
    setValor('');
    setEditingId(null);
    listar();
  }

  async function listar() {
    try {
      const data = await limitesService.listarLimitesUsuario();
      setLimites(data);
    } catch (error) {
      console.error('Erro ao carregar limites', error);
    }
  }

  function handleConsulta(consultaMes: string) {
    setMesConsulta(consultaMes);
    if (!consultaMes) {
      setLimiteEncontrado(null);
      return;
    }
    const found = limites.find((l) => monthYearToPick(l.mesReferencia) === consultaMes);
    setLimiteEncontrado(found ? found.valor : null);
    setLimiteConsultado(found ?? null);
  }

  function monthYearToPick(ym: string) {
    const [year, month] = ym.split('-');
    const mesesMap: Record<string, string> = {
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
    return `${mesesMap[month]}/${year}`;
  }

  const handleEditarPress = (limite: LimiteDTO) => {
    setValor(limite.valor.toString());
    setMesCadastro(monthYearToPick(limite.mesReferencia));
    setEditingId(limite.id || 'editing');
  };

  const handleExcluirPress = async (id?: string) => {
    if (!id) return;
    try {
      await limitesService.excluirLimite(id);
      listar();
      Toast.show({ type: 'success', text1: 'Limite excluído' });
    } catch (error) {
      console.error('Erro ao excluir limite', error);
      Toast.show({ type: 'error', text1: getErrorMessage(error) });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>Limite</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Valor</Text>
            <TextInput
              style={styles.input}
              value={valor}
              onChangeText={setValor}
              placeholder=""
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Mês</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={mesCadastro}
                onValueChange={setMesCadastro}
                dropdownIconColor="#000"
              >
                {meses.map((m) => (
                  <Picker.Item label={m} value={m} key={m} />
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

          <Text style={styles.consultaTitle}>Consulta</Text>

          <View style={styles.pickerConsultaWrapper}>
            <Picker
              selectedValue={mesConsulta}
              onValueChange={handleConsulta}
              dropdownIconColor="#000"
            >
              <Picker.Item label="Selecione um mês" value="" />
              {meses.map((m) => (
                <Picker.Item label={m} value={m} key={m} />
              ))}
            </Picker>
          </View>

          <ScrollView style={styles.listScroll} contentContainerStyle={{paddingBottom:32}}>
            {(mesConsulta === '' ? limites : limiteConsultado ? [limiteConsultado] : []).map((l) => (
              <View key={l.id} style={styles.limiteItem}>
                <Text style={styles.limiteTexto}>{`${monthYearToPick(l.mesReferencia)}   R$${l.valor.toFixed(2)}`}</Text>
                <View style={styles.limiteBotoes}>
                  <Pressable style={styles.smallButton} onPress={() => handleEditarPress(l)}>
                    <Text style={styles.smallButtonText}>EDITAR</Text>
                  </Pressable>
                  <Pressable style={styles.smallButton} onPress={() => handleExcluirPress(l.id)}>
                    <Text style={styles.smallButtonText}>EXCLUIR</Text>
                  </Pressable>
                </View>
              </View>
            ))}

            {mesConsulta && limiteEncontrado === null && (
              <Text style={styles.resultText}>Nenhum limite foi encontrado</Text>
            )}
          </ScrollView>
        </View>
        <Toast />
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
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  saveButton: {
    backgroundColor: '#35b559',
    borderRadius: 8,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  saveButtonFull: {
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
  cancelButton: {
    backgroundColor: '#ff4444',
    borderRadius: 8,
    paddingVertical: 16,
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
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  pickerConsultaWrapper: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 6,
  },
  resultText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#000000',
  },
  limiteItem: {
    backgroundColor: '#35b55933',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
  },
  limiteTexto: {
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  limiteBotoes: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  smallButton: {
    flex: 1,
    backgroundColor: '#35b559',
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
  },
  smallButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  listScroll:{
    flex:1,
    marginTop:8,
  },
});

