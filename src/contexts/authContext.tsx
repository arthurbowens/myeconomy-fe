import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../utils/api";
import * as localStorage from "../utils/localStorage";
import { Buffer } from 'buffer';

interface AuthContextProps {
  onRegister: (
    nome: string,
    email: string,
    dataNascimento: string,
    senha: string,
    confirmarSenha: string,
  ) => Promise<void>;
  onLogin: (email: string, senha: string) => Promise<any>;
  onLogout: () => Promise<void>;
  authState: AuthenticateProps;
}

interface AuthenticateProps {
  token: string | null;
  authenticated: boolean | null;
}

type AuthProviderProps = {
  children: ReactNode;
};

const TOKEN_KEY = "access-token";

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthenticateProps>({
    token: null,
    authenticated: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await localStorage.getStorageItem(TOKEN_KEY);

      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setAuthState({
          token: token,
          authenticated: true,
        });
      }
    };

    loadToken();
  }, []);

  const register = async (
    nome: string,
    email: string,
    dataNascimento: string,
    senha: string,
    confirmarSenha: string,
  ) => {
    try {
      const response = await api.post("/auth/signup", {
        nome,
        email,
        dataNascimento,
        senha,
        confirmarSenha,
      });
      
      if (response.data) {
        console.log("Registro realizado com sucesso");
        return response.data;
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Erro ao realizar o cadastro. Tente novamente.");
    }
  };

  const login = async (email: string, senha: string) => {
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
      await localStorage.setStorageItem(TOKEN_KEY, token);
      return result.data;
    } catch (error) {
      console.error("Erro ao fazer login", error);
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeStorageItem(TOKEN_KEY);
    api.defaults.headers.common["Authorization"] = "";
    setAuthState({
      authenticated: null,
      token: null,
    });
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};