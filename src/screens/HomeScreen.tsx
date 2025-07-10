import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { ProgressoDTO, ProgressoPorCategoriaDTO, Scenario } from '../resources/progressoResource';
import { AppNavigatorRoutesProps } from '../routes/app.routes';
import * as limitesService from '../services/limitesService';
import * as progressoService from '../services/progressoService';

export default function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const [meses, setMeses] = useState<string[]>([]);
  const [mesSelecionado, setMesSelecionado] = useState('');

  const [limiteValor, setLimiteValor] = useState<number | null>(null);
  const [totalDespesas, setTotalDespesas] = useState<number>(0);
  const [scenario, setScenario] = useState<Scenario | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [progressoPorCategoria, setProgressoPorCategoria] = useState<ProgressoPorCategoriaDTO | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const listaMeses = await limitesService.listarMesesSelecao();
        const formatada = listaMeses.map(monthYearToPick);
        
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
        
        if (!mesSelecionado && listaMesesOrdenada.length > 0) {
          const agora = new Date();
          const mesAtual = monthYearToPick(`${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}`);
          
          if (listaMesesOrdenada.includes(mesAtual)) {
            setMesSelecionado(mesAtual);
          } else {
            setMesSelecionado(listaMesesOrdenada[0]);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar meses', error);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (mesSelecionado) {
      carregarInfoMes(mesSelecionado);
    } else {
      setLimiteValor(null);
      setTotalDespesas(0);
      setScenario(null);
    }
  }, [mesSelecionado]);

  useFocusEffect(
    useCallback(() => {
      if (mesSelecionado) {
        carregarInfoMes(mesSelecionado);
      }
    }, [mesSelecionado])
  );

  async function carregarInfoMes(mesPick: string) {
    try {
      const progresso: ProgressoDTO = await progressoService.obterProgressoPorMesPick(mesPick);
      setLimiteValor(progresso.limite);
      setTotalDespesas(progresso.totalDespesas);
      setScenario(progresso.scenario);
    } catch (error) {
      console.error('Erro ao carregar progresso', error);
    }
  }

  async function carregarProgressoPorCategoria() {
    if (!mesSelecionado) return;
    
    try {
      const progresso = await progressoService.obterProgressoPorCategoriaPorMesPick(mesSelecionado);
      setProgressoPorCategoria(progresso);
      setModalVisible(true);
    } catch (error) {
      console.error('Erro ao carregar progresso por categoria', error);
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

  const uiScenario = (() => {
    if (!scenario) return 'continue';
    
    const isCurrentMonth = (() => {
      if (!mesSelecionado) return false;
      const agora = new Date();
      const mesAtual = monthYearToPick(`${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}`);
      return mesSelecionado === mesAtual;
    })();
    
    switch (scenario) {
      case 'ECONOMIZOU':
        return isCurrentMonth ? 'continue' : 'economizou';
      case 'NAO_ECONOMIZOU':
        return 'gasto';
      case 'SEM_LIMITE':
        return 'semLimite';
      case 'SEM_INFO':
      case 'SEM_DESPESA':
        return 'noInfo';
      case 'EM_ANDAMENTO':
      default:
        return 'continue';
    }
  })();

  const progressRatio = limiteValor ? Math.min(totalDespesas / (limiteValor || 1), 1) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.greet}>Olá {user?.nome ?? ''} 👋</Text>
      <Text style={styles.subtitle}>É bom te ver por aqui!</Text>

      <View style={{ marginTop: 32 }} />
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={mesSelecionado}
          onValueChange={setMesSelecionado}
          dropdownIconColor="#000"
          style={{ width: '100%' }}
        >
          <Picker.Item label="Selecione um mês" value="" />
          {meses.map((m) => (
            <Picker.Item label={m} value={m} key={m} />
          ))}
        </Picker>
      </View>

      {/* Card */}
      <LinearGradient colors={['#35b559', '#8cd58f']} style={styles.card}>
        {uiScenario === 'continue' && (
          <>
            <Text style={styles.emoji}>🙂</Text>
            <Text style={styles.cardText}>Continue assim!</Text>
          </>
        )}
        {uiScenario === 'economizou' && (
          <>
            <Text style={styles.emoji}>🤩</Text>
            <Text style={styles.cardText}>Parabéns você economizou</Text>
            <Text style={styles.cardValue}>{`R$${(limiteValor! - totalDespesas).toFixed(0)}`}</Text>
          </>
        )}
        {uiScenario === 'gasto' && (
          <>
            <Text style={styles.emoji}>😓</Text>
            <Text style={styles.cardText}>Objetivo não atingido</Text>
            <Text style={styles.cardValue}>{`-R$${(totalDespesas - limiteValor!).toFixed(0)}`}</Text>
          </>
        )}
        {uiScenario === 'semLimite' && (
          <>
            <Text style={styles.emoji}>📊</Text>
            <Text style={styles.cardText}>Defina um limite para acompanhar</Text>
            <Text style={styles.cardValue}>{`R$${totalDespesas.toFixed(0)} gastos`}</Text>
          </>
        )}
        {uiScenario === 'noInfo' && (
          <>
            <Text style={styles.emoji}>😴</Text>
            <Text style={styles.cardText}>Progresso não encontrado</Text>
          </>
        )}
      </LinearGradient>

      {/* Progress bar */}
      {uiScenario !== 'noInfo' && mesSelecionado && (
        <View style={{ width: '100%', marginTop: 24 }}>
          <View style={styles.progressHeader}>
            <Text style={{ color: '#000' }}>Progresso</Text>
            <Text style={{ color: '#000' }}>
              {uiScenario === 'semLimite' 
                ? `R$${totalDespesas}` 
                : `R$${totalDespesas}/${limiteValor}`}
            </Text>
          </View>
          <Pressable onPress={carregarProgressoPorCategoria}>
            <View style={styles.progressBackground}>
              <View style={[
                uiScenario === 'semLimite' ? styles.progressFillNoLimit : styles.progressFill, 
                { 
                  flex: uiScenario === 'semLimite' ? (totalDespesas > 0 ? 1 : 0) : progressRatio 
                }
              ]} />
              <View style={{ 
                flex: uiScenario === 'semLimite' ? (totalDespesas > 0 ? 0 : 1) : (1 - progressRatio) 
              }} />
            </View>
          </Pressable>
        </View>
      )}

      {uiScenario === 'noInfo' && (
        <Pressable style={styles.startButton} onPress={() => navigation.navigate('limites', {})}>
          <Text style={styles.startButtonText}>COMEÇAR</Text>
        </Pressable>
      )}

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Progresso por categoria</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </Pressable>
            </View>

            {progressoPorCategoria && (
              <FlatList
                data={[
                  {
                    nomeCategoria: 'Progresso',
                    totalCategoria: progressoPorCategoria.totalDespesas,
                    limite: progressoPorCategoria.limite || 0,
                    isTotal: true
                  },
                  ...progressoPorCategoria.categorias.map(cat => ({ ...cat, isTotal: false }))
                ]}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.categoryItem}>
                    <Text style={styles.categoryName}>{item.nomeCategoria}</Text>
                    <Text style={styles.categoryValue}>
                      R${item.totalCategoria.toFixed(0)}/R${item.limite?.toFixed(0)}
                    </Text>
                    <View style={styles.categoryProgressBackground}>
                      <View style={[
                        styles.categoryProgressFill,
                        { 
                          width: `${Math.min((item.totalCategoria / (item.limite || 1)) * 100, 100)}%`,
                          backgroundColor: item.totalCategoria > (item.limite || 0) ? '#ff4444' : '#35b559'
                        }
                      ]} />
                    </View>
                  </View>
                )}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  greet: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  subtitle: {
    marginTop: 4,
    color: '#000',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 6,
    marginTop: 24,
  },
  card: {
    marginTop: 24,
    width: '100%',
    borderRadius: 12,
    paddingVertical: 32,
    alignItems: 'center',
    overflow: 'hidden',
  },
  emoji: {
    fontSize: 48,
  },
  cardText: {
    marginTop: 16,
    fontSize: 18,
    color: '#000',
    fontWeight: '700',
  },
  cardValue: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  startButton: {
    marginTop: 24,
    backgroundColor: '#35b559',
    paddingVertical: 16,
    borderRadius: 6,
    alignItems: 'center',
    width: '100%',
  },
  startButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressBackground: {
    flexDirection: 'row',
    width: '100%',
    height: 20,
    backgroundColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#35b559',
  },
  progressFillNoLimit: {
    backgroundColor: '#ff9800', // Cor diferente para sem limite
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  modalCloseButton: {
    fontSize: 24,
    color: '#000',
  },
  categoryItem: {
    marginBottom: 15,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  categoryValue: {
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
  },
  categoryProgressBackground: {
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  categoryProgressFill: {
    height: '100%',
    backgroundColor: '#35b559',
    borderRadius: 5,
  },
});