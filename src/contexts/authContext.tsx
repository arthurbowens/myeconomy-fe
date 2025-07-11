import { Buffer } from 'buffer';
import { createContext, ReactNode, useEffect, useState } from "react";

import { api } from "../utils/api";

import { UserDTO } from "../resources/usuarioResource";
import { SignUpDTO } from "../services/auth/authResource";

import * as authService from '../services/auth/authService';
import * as userService from '../services/usuarioService';
import { getItem, removeItem, setItem } from "../utils/localStorage";
import { AUTH_TOKEN_STORAGE, USER_STORAGE } from "../utils/storageConfig";

export type AuthContextDataProps = {
  signIn: (email: string, senha: string) => Promise<any>
  signUp: (user: SignUpDTO) => Promise<void>
  signOut: () => Promise<void>
  updateUser: (data: UserDTO) => Promise<void>
  user: UserDTO
  isLoading: boolean
  authState?: {
    token: string | null
    authenticated: boolean | null
  }
}

interface AuthenticatedProps {
  token: string | null
  authenticated: boolean | null
}

export type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoading, setIsLoading] = useState(false)
  const [authState, setAuthState] = useState<AuthenticatedProps>({
    token: null,
    authenticated: null
  })

  async function updateToken(token: string) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  const signIn = async (email: string, senha: string) => {
    try {
      const basicAuth = 'Basic ' + Buffer.from(`${email}:${senha}`).toString('base64');
  
      const result = await api.post("/auth/signin", {}, {
        headers: {
          'Authorization': basicAuth
        }
      });
  
      const token = result.data;
  
      if (!token) {
        throw new Error("Token não recebido do servidor");
      }
  
      setAuthState({
        authenticated: true,
        token: token,
      });
  
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await setItem(AUTH_TOKEN_STORAGE, token);

      try {
        const authenticatedUser = await userService.getAuthenticatedUserService();
        setUser(authenticatedUser);
        await setItem(USER_STORAGE, JSON.stringify(authenticatedUser));
      } catch (err) {
        console.error('Erro ao buscar usuário autenticado após login', err);
      }
      return result.data;
    } catch (error) {
      console.error("Erro ao fazer login", error);
      throw error;
    }
  };

  async function signUp({ nome, dataNascimento, email, senha, confirmarSenha }: SignUpDTO) {
    try {
      await authService.signUp({ nome, dataNascimento, email,senha, confirmarSenha })
    } catch (error) {
      throw error
    }
  }

  async function signOut() {
    try {
      setIsLoading(true)

      await authService.signOut()

      setUser({} as UserDTO)
      await removeItem(USER_STORAGE)

      setAuthState({
        token: null,
        authenticated: null
      })
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  async function updateUser(data: UserDTO) {
    try {
      await userService.updateUserService(data)

      setUser(data)
      await setItem(USER_STORAGE, JSON.stringify(data))

    } catch (error) {
      throw error
    }
  }

  async function loadUserData() {
    try {
      setIsLoading(true)

      const storedUser = await getItem(USER_STORAGE)

      const user: UserDTO = storedUser ? JSON.parse(storedUser) : {}

      if (user) {
        setUser(user)
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  async function loadToken() {
    try {
      setIsLoading(true)

      const token = await authService.getAuthToken()

      if (token) {
        await updateToken(token)
        setAuthState({
          token,
          authenticated: true
        })
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadToken()
    loadUserData()
  }, [])

  return (
    <AuthContext.Provider value={{
      signIn,
      signUp,
      signOut,
      updateUser,
      user,
      isLoading,
      authState
    }}>
      {children}
    </AuthContext.Provider>
  )
}