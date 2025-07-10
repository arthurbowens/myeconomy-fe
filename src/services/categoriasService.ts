import * as categoriasResource from '../resources/categoriasResource';

export async function listarCategoriasService() {
  return await categoriasResource.listarCategorias();
} 