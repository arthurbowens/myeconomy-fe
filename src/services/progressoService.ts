import * as progressoResource from '../resources/progressoResource';

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

export async function obterProgressoPorMesPick(mesPick: string) {
  const anoMes = pickToYearMonth(mesPick);
  return await progressoResource.getProgresso(anoMes);
} 