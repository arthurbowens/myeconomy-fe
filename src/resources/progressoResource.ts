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

export type ProgressoPorCategoriaItem = {
  nomeCategoria: string;
  totalCategoria: number;
  limite: number;
};

export type ProgressoPorCategoriaDTO = {
  totalDespesas: number;
  limite: number | null;
  categorias: ProgressoPorCategoriaItem[];
};

export async function getProgresso(anoMes: string) {
  const { data } = await api.get<ProgressoDTO>("/api/progresso", {
    params: { mes: anoMes },
  });
  return data;
}

export async function getProgressoPorCategoria(ano: number, mes: number) {
  const { data } = await api.get<ProgressoPorCategoriaDTO>(`/api/progresso/categoria/${ano}/${mes}`);
  return data;
} 