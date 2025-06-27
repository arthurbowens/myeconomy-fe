import * as authResource from './authResource'



async function signIn(email: string, senha: string) {
  return authResource.signIn(email, senha).then((response) => response.data);
}

async function signUp({
  nome,
  dataNascimento,
  email,
  senha,
  confirmarSenha,
}: authResource.SignUpDTO) {
  await authResource.signUp({ nome, dataNascimento, email, senha, confirmarSenha })
}

async function signOut() {
  await authResource.signOut()
}

async function getAuthToken() {
  const token = authResource.getAuthToken()

  return token
}

export { signIn, signUp, signOut, getAuthToken }