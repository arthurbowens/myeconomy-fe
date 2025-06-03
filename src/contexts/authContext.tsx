import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import * as localStorage from "../utils/localStorage";

interface AuthContextProps {
  onRegister: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  onLogin: (email: string, password: string) => Promise<any>;
  onLogout: () => Promise<void>;
  authState: AuthenticateProps;
  user: UserProps | null;
}

interface AuthenticateProps {
  authenticated: boolean;
}

interface UserProps {
  nome: string;
  email: string;
  senha: string;
}

//Tipando por causa do typescript
type AuthProviderProps = {
  children: ReactNode;
};

const USERS_KEY = "users";
const SESSION_KEY = "session";

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthenticateProps>({ authenticated: false });
  const [user, setUser] = useState<UserProps | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const session = await localStorage.getStorageItem(SESSION_KEY);
      if (session) {
        const sessionObj = JSON.parse(session);
        setAuthState({ authenticated: true });
        setUser(sessionObj);
      }
    };
    loadSession();
  }, []);

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    if (!name || !email || !password || !confirmPassword) {
      throw new Error("Preencha todos os campos obrigatórios.");
    }
    if (password !== confirmPassword) {
      throw new Error("As senhas não coincidem.");
    }
    const usersRaw = await localStorage.getStorageItem(USERS_KEY);
    const users: UserProps[] = usersRaw ? JSON.parse(usersRaw) : [];
    if (users.find((u) => u.email === email)) {
      throw new Error("Já existe um usuário com este email.");
    }
    const newUser: UserProps = { nome: name, email, senha: password };
    users.push(newUser);
    await localStorage.setStorageItem(USERS_KEY, JSON.stringify(users));
  };

  const login = async (email: string, password: string) => {
    const usersRaw = await localStorage.getStorageItem(USERS_KEY);
    const users: UserProps[] = usersRaw ? JSON.parse(usersRaw) : [];
    const found = users.find((u) => u.email === email && u.senha === password);
    if (!found) {
      throw new Error("Email ou senha inválidos.");
    }
    await localStorage.setStorageItem(SESSION_KEY, JSON.stringify(found));
    setAuthState({ authenticated: true });
    setUser(found);
    return found;
  };

  const logout = async () => {
    await localStorage.removeStorageItem(SESSION_KEY);
    setAuthState({ authenticated: false });
    setUser(null);
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
