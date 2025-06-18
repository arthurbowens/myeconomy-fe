import * as userResource from '../resources/usuarioResource'

async function getAuthenticatedUserService() {
  const data = await userResource.getAuthenticatedUser()

  const user: userResource.UserDTO = data.user

  return user
}

async function updateUserService({ nome, dataNascimento, email}: userResource.UserDTO) {
  await userResource.updateUser({
    nome,
    dataNascimento,
    email,
  })
}

export { getAuthenticatedUserService, updateUserService }