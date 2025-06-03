import * as localStorage from '../utils/localStorage';

const EXPENSES_KEY = 'expenses';

export const saveExpense = async (expense) => {
  // expense: { descricao: string, valor: number, mes: 'YYYY-MM', email: string }
  const now = new Date();
  const [ano, mes] = expense.mes.split('-').map(Number);
  if (ano < now.getFullYear() || (ano === now.getFullYear() && mes < now.getMonth() + 1)) {
    throw new Error('Não é permitido cadastrar despesa de mês passado.');
  }
  const raw = await localStorage.getStorageItem(EXPENSES_KEY);
  const expenses = raw ? JSON.parse(raw) : [];
  expenses.push({...expense, id: Date.now()});
  await localStorage.setStorageItem(EXPENSES_KEY, JSON.stringify(expenses));
};

export const getExpensesByMonth = async (mes, email) => {
  const raw = await localStorage.getStorageItem(EXPENSES_KEY);
  const expenses = raw ? JSON.parse(raw) : [];
  return expenses.filter(e => e.mes === mes && e.email === email);
};

export const getAllExpenses = async (email) => {
  const raw = await localStorage.getStorageItem(EXPENSES_KEY);
  const expenses = raw ? JSON.parse(raw) : [];
  return expenses.filter(e => e.email === email);
};

export const updateExpense = async (id, fields) => {
  const raw = await localStorage.getStorageItem(EXPENSES_KEY);
  let expenses = raw ? JSON.parse(raw) : [];
  const idx = expenses.findIndex(e => e.id === id);
  if (idx === -1) throw new Error('Despesa não encontrada.');
  const now = new Date();
  const [ano, mes] = expenses[idx].mes.split('-').map(Number);
  if (ano < now.getFullYear() || (ano === now.getFullYear() && mes < now.getMonth() + 1)) {
    throw new Error('Não é permitido editar despesa de mês passado.');
  }
  expenses[idx] = { ...expenses[idx], ...fields };
  await localStorage.setStorageItem(EXPENSES_KEY, JSON.stringify(expenses));
};

export const deleteExpense = async (id) => {
  const raw = await localStorage.getStorageItem(EXPENSES_KEY);
  let expenses = raw ? JSON.parse(raw) : [];
  const idx = expenses.findIndex(e => e.id === id);
  if (idx === -1) throw new Error('Despesa não encontrada.');
  const now = new Date();
  const [ano, mes] = expenses[idx].mes.split('-').map(Number);
  if (ano < now.getFullYear() || (ano === now.getFullYear() && mes < now.getMonth() + 1)) {
    throw new Error('Não é permitido excluir despesa de mês passado.');
  }
  expenses = expenses.filter(e => e.id !== id);
  await localStorage.setStorageItem(EXPENSES_KEY, JSON.stringify(expenses));
}; 