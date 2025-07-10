import { api } from "../utils/api";

export type CategoriaDTO = {
  id: string;
  nome: string;
};

export async function listarCategorias() {
  const { data } = await api.get<CategoriaDTO[]>("/categoria");
  return data;
} 