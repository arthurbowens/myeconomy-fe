import { api } from "../utils/api";

export type DespesaDTO = {
  id?: string;
  descricao: string;
  valor: number;
  mesReferencia: string;
  usuario: {
    id: string;
  };
};

export async function getDespesasUsuario() {
  const { data } = await api.get<DespesaDTO[]>("/despesa/usuario");
  return data;
}

export async function criarDespesa(despesa: DespesaDTO) {
  const { data } = await api.post<DespesaDTO>("/despesa", despesa);
  return data;
}

export async function atualizarDespesa(id: string, despesa: DespesaDTO) {
  const { data } = await api.put<DespesaDTO>(`/despesa/${id}`, despesa);
  return data;
}

export async function excluirDespesa(id: string) {
  await api.delete(`/despesa/${id}`);
}

export async function getMesesSelecao() {
  const { data } = await api.get<string[]>("/despesa/meses");
  return data;
}

export async function getDespesasPorAnoMes(ano: number, mes: number) {
  const { data } = await api.get<DespesaDTO[]>(`/despesa/usuario/${ano}/${mes}`);
  return data;
}
