import { api } from "../utils/api"
import { setItem } from "../utils/localStorage"
import { USER_STORAGE } from "../utils/storageConfig"

type UserDTO = {
  id?: string
  nome: string
  dataNascimento: string
  email: string
}

async function getAuthenticatedUser() {
  try {
    const { data } = await api.get('/auth/current-user')

    if (data) {
      await setItem(USER_STORAGE, JSON.stringify(data))
    }

    return data
  } catch (error) {
    throw error
  }
}

async function updateUser({ nome, dataNascimento, email }: UserDTO) {
  try {
    await api.put('/me', {
      nome,
      dataNascimento,
      email
    })

  } catch (error) {
    throw error
  }
}

export { UserDTO, getAuthenticatedUser, updateUser }