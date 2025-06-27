import { getItem } from 'expo-secure-store';
import { api } from '../../utils/api';
import { removeItem } from '../../utils/localStorage';
import { AUTH_TOKEN_STORAGE } from '../../utils/storageConfig';

type SignUpDTO = {
    nome: string;
    dataNascimento: string;
    email: string;
    senha: string;
    confirmarSenha: string;
}



  async function signIn(email: string, senha: string) {
    return api.post('/auth/signin', { 
        email, 
        senha,
    });
};
  
  async function signUp({
    nome,
    dataNascimento,
    email,
    senha,
    confirmarSenha
  }: SignUpDTO) {
    try {
      const [dia, mes, ano] = dataNascimento.split('/');
      const dataFormatada = `${ano}-${mes}-${dia}`;

      await api.post('/auth/signup', {
        nome,
        dataNascimento: dataFormatada,
        email,
        senha,
        confirmarSenha,
      })
    } catch (error) {
      if (error.response?.data) {
        throw new Error(error.response.data);
      }
      throw error;
    }
  }
  
  async function signOut() {
    try {
      await removeItem(AUTH_TOKEN_STORAGE)
    } catch (error) {
      throw error
    }
  }
  
  async function getAuthToken() {
    const token = getItem(AUTH_TOKEN_STORAGE)
  
    return token
  }
  
  export { getAuthToken, signIn, signOut, signUp, SignUpDTO };
