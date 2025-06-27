import { api } from "../utils/api";

export type Scenario =
  | "ECONOMIZOU"
  | "NAO_ECONOMIZOU"
  | "EM_ANDAMENTO"
  | "SEM_LIMITE"
  | "SEM_DESPESA"
  | "SEM_INFO";

export type ProgressoDTO = {
  totalDespesas: number;
  limite: number | null;
  diferenca: number | null;
  porcentagemUtilizada: number;
  scenario: Scenario;
};

export async function getProgresso(anoMes: string) {
  const { data } = await api.get<ProgressoDTO>("/api/progresso", {
    params: { mes: anoMes },
  });
  return data;
} 