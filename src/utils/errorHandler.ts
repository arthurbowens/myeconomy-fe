export function getErrorMessage(error: any): string {
  if (!error) return 'Erro desconhecido';

  // Axios error
  if (error.response) {
    const data = error.response.data;
    if (typeof data === 'string') return data;
    if (data?.message) return data.message;
  }

  // Error object
  if (error.message) return error.message;

  return 'Erro desconhecido';
} 