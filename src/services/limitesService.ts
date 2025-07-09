import * as limitesResource from '../resources/limitesResource';
import * as userService from './usuarioService';

export async function listarLimitesUsuario() {
  const limites = await limitesResource.getLimitesUsuario();
  return limites;
}

export async function cadastrarLimite(valor: number, mesReferenciaPick: string) {
  const [mesExtenso, anoStr] = mesReferenciaPick.split('/');
  const mesesMap: Record<string, string> = {
    Janeiro: '01',
    Fevereiro: '02',
    Março: '03',
    Abril: '04',
    Maio: '05',
    Junho: '06',
    Julho: '07',
    Agosto: '08',
    Setembro: '09',
    Outubro: '10',
    Novembro: '11',
    Dezembro: '12',
  };
  const mesNum = mesesMap[mesExtenso];
  const mesReferencia = `${anoStr}-${mesNum}`;

  const usuario = await userService.getAuthenticatedUserService();
  if (!usuario?.id) {
    throw new Error('Usuário não identificado');
  }

  const limite: limitesResource.LimiteDTO = {
    valor,
    mesReferencia,
    usuario: { id: usuario.id },
  };

  return await limitesResource.criarLimite(limite);
}

export async function atualizarLimite(id: string, valor: number, mesReferenciaPick: string) {
  const [mesExtenso, anoStr] = mesReferenciaPick.split('/');
  const mesesMap: Record<string, string> = {
    Janeiro: '01',
    Fevereiro: '02',
    Março: '03',
    Abril: '04',
    Maio: '05',
    Junho: '06',
    Julho: '07',
    Agosto: '08',
    Setembro: '09',
    Outubro: '10',
    Novembro: '11',
    Dezembro: '12',
  };
  const mesNum = mesesMap[mesExtenso];
  const mesReferencia = `${anoStr}-${mesNum}`;

  const usuario = await userService.getAuthenticatedUserService();
  if (!usuario?.id) {
    throw new Error('Usuário não identificado');
  }

  const limite: limitesResource.LimiteDTO = {
    valor,
    mesReferencia,
    usuario: { id: usuario.id },
  };

  return await limitesResource.atualizarLimite(id, limite);
}

export async function excluirLimite(id: string) {
  await limitesResource.excluirLimite(id);
}

export async function excluirTodosLimitesUsuario() {
  await limitesResource.excluirLimitesUsuario();
}

export async function listarMesesSelecao() {
  return await limitesResource.getMesesSelecao();
}
