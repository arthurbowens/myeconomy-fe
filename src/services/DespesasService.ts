import * as despesasResource from '../resources/despesasResource';
import * as userService from './usuarioService';

export async function listarDespesasUsuario() {
  return await despesasResource.getDespesasUsuario();
}

function pickToYearMonth(mesPick: string) {
  const [mesExtenso, anoStr] = mesPick.split('/');
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
  return `${anoStr}-${mesNum}`;
}

export async function cadastrarDespesa(descricao: string, valor: number, mesPick: string) {
  const mesReferencia = pickToYearMonth(mesPick);
  const usuario = await userService.getAuthenticatedUserService();
  if (!usuario?.id) throw new Error('Usuário não identificado');

  const despesa: despesasResource.DespesaDTO = {
    descricao,
    valor,
    mesReferencia,
    usuario: { id: usuario.id },
  };
  return await despesasResource.criarDespesa(despesa);
}

export async function atualizarDespesa(id: string, descricao: string, valor: number, mesPick: string) {
  const mesReferencia = pickToYearMonth(mesPick);
  const usuario = await userService.getAuthenticatedUserService();
  if (!usuario?.id) throw new Error('Usuário não identificado');

  const despesa: despesasResource.DespesaDTO = {
    descricao,
    valor,
    mesReferencia,
    usuario: { id: usuario.id },
  };
  return await despesasResource.atualizarDespesa(id, despesa);
}

export async function excluirDespesa(id: string) {
  await despesasResource.excluirDespesa(id);
}

export async function listarMesesSelecao() {
  return await despesasResource.getMesesSelecao();
}

export async function listarDespesasPorMesPick(mesPick: string) {
  const [mesExtenso, anoStr] = mesPick.split('/');
  const mesesMap: Record<string, number> = {
    Janeiro: 1,
    Fevereiro: 2,
    Março: 3,
    Abril: 4,
    Maio: 5,
    Junho: 6,
    Julho: 7,
    Agosto: 8,
    Setembro: 9,
    Outubro: 10,
    Novembro: 11,
    Dezembro: 12,
  };
  const mesNum = mesesMap[mesExtenso];
  const ano = parseInt(anoStr, 10);
  return await despesasResource.getDespesasPorAnoMes(ano, mesNum);
}
