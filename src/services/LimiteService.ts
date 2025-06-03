import * as localStorage from '../utils/localStorage';

const LIMITS_KEY = 'limits';

export const saveLimit = async (limit) => {
  // limit: { valor: number, mes: 'YYYY-MM', email: string }
  const now = new Date();
  const [ano, mes] = limit.mes.split('-').map(Number);
  if (ano < now.getFullYear() || (ano === now.getFullYear() && mes < now.getMonth() + 1)) {
    throw new Error('Não é permitido cadastrar limite de mês passado.');
  }
  const raw = await localStorage.getStorageItem(LIMITS_KEY);
  const limits = raw ? JSON.parse(raw) : [];
  if (limits.find(l => l.mes === limit.mes && l.email === limit.email)) {
    throw new Error('Já existe um limite para este mês.');
  }
  limits.push({...limit, id: Date.now()});
  await localStorage.setStorageItem(LIMITS_KEY, JSON.stringify(limits));
};

export const getLimitByMonth = async (mes, email) => {
  const raw = await localStorage.getStorageItem(LIMITS_KEY);
  const limits = raw ? JSON.parse(raw) : [];
  return limits.find(l => l.mes === mes && l.email === email) || null;
};

export const getAllLimits = async (email) => {
  const raw = await localStorage.getStorageItem(LIMITS_KEY);
  const limits = raw ? JSON.parse(raw) : [];
  return limits.filter(l => l.email === email);
};

export const updateLimit = async (id, valor) => {
  const raw = await localStorage.getStorageItem(LIMITS_KEY);
  let limits = raw ? JSON.parse(raw) : [];
  const idx = limits.findIndex(l => l.id === id);
  if (idx === -1) throw new Error('Limite não encontrado.');
  const now = new Date();
  const [ano, mes] = limits[idx].mes.split('-').map(Number);
  if (ano < now.getFullYear() || (ano === now.getFullYear() && mes < now.getMonth() + 1)) {
    throw new Error('Não é permitido editar limite de mês passado.');
  }
  limits[idx].valor = valor;
  await localStorage.setStorageItem(LIMITS_KEY, JSON.stringify(limits));
};

export const deleteLimit = async (id) => {
  const raw = await localStorage.getStorageItem(LIMITS_KEY);
  let limits = raw ? JSON.parse(raw) : [];
  const idx = limits.findIndex(l => l.id === id);
  if (idx === -1) throw new Error('Limite não encontrado.');
  const now = new Date();
  const [ano, mes] = limits[idx].mes.split('-').map(Number);
  if (ano < now.getFullYear() || (ano === now.getFullYear() && mes < now.getMonth() + 1)) {
    throw new Error('Não é permitido excluir limite de mês passado.');
  }
  limits = limits.filter(l => l.id !== id);
  await localStorage.setStorageItem(LIMITS_KEY, JSON.stringify(limits));
}; 