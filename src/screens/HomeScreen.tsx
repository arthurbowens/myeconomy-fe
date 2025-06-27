import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { ProgressoDTO, Scenario } from '../resources/progressoResource';
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

  useEffect(() => {
    async function init() {
      try {
        const listaMeses = await limitesService.listarMesesSelecao();
        const formatada = listaMeses.map(monthYearToPick);
        setMeses(formatada);
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
    switch (scenario) {
      case 'ECONOMIZOU':
        return 'economizou';
      case 'NAO_ECONOMIZOU':
        return 'gasto';
      case 'SEM_INFO':
      case 'SEM_LIMITE':
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
        {uiScenario === 'noInfo' && (
          <>
            <Text style={styles.emoji}>😴</Text>
            <Text style={styles.cardText}>Progresso não encontrado</Text>
          </>
        )}
      </LinearGradient>

      {/* Progress bar */}
      {uiScenario !== 'noInfo' && (
        <View style={{ width: '100%', marginTop: 24 }}>
          <View style={styles.progressHeader}>
            <Text style={{ color: '#000' }}>Progresso</Text>
            <Text style={{ color: '#000' }}>{`R$${totalDespesas}/${limiteValor}`}</Text>
          </View>
          <View style={styles.progressBackground}>
            <View style={[styles.progressFill, { flex: progressRatio }]} />
            <View style={{ flex: 1 - progressRatio }} />
          </View>
        </View>
      )}

      {uiScenario === 'noInfo' && (
        <Pressable style={styles.startButton} onPress={() => navigation.navigate('limites', {})}>
          <Text style={styles.startButtonText}>COMEÇAR</Text>
        </Pressable>
      )}
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
});