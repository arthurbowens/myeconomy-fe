import * as userResource from '../resources/usuarioResource'

async function getAuthenticatedUserService() {
  const user: userResource.UserDTO = await userResource.getAuthenticatedUser()

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