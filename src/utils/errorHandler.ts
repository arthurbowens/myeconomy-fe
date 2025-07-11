export function getErrorMessage(error: any): string {
  if (!error) return 'Erro desconhecido';

  if (error.response) {
    const data = error.response.data;
    if (typeof data === 'string') return data;
    if (data?.message) return data.message;
  }

  if (error.message) return error.message;

  return 'Erro desconhecido';
} 