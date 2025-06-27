import { api } from "../utils/api";

export type LimiteDTO = {
  id?: string;
  valor: number;
  mesReferencia: string; // formato YYYY-MM
  usuario: {
    id: string;
  };
};

export async function getLimitesUsuario() {
  const { data } = await api.get<LimiteDTO[]>("/limite-mensal/usuario");
  return data;
}

export async function criarLimite(limite: LimiteDTO) {
  const { data } = await api.post<LimiteDTO>("/limite-mensal", limite);
  return data;
}

export async function atualizarLimite(id: string, limite: LimiteDTO) {
  const { data } = await api.put<LimiteDTO>(`/limite-mensal/${id}`, limite);
  return data;
}

export async function excluirLimite(id: string) {
  await api.delete(`/limite-mensal/${id}`);
}

export async function excluirLimitesUsuario() {
  await api.delete('/limite-mensal');
}

export async function getMesesSelecao() {
  const { data } = await api.get<string[]>("/limite-mensal/meses");
  return data;
}
