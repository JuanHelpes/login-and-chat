import { createContext, useState } from "react";
import type { ReactNode } from "react";
import api from "../services/api"; // Importando a instância do Axios

// Tipos para o usuário e contexto
type User = {
  usu_id: string;
  name?: string;
  token: string;
} | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<boolean | undefined>;
  Login_Google: (email: string, jti: string, nome: string) => Promise<boolean | undefined>;
  logout: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

// Crie o contexto
export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  Login_Google: async () => false,
  logout: () => {},
});

// Crie o provider
export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Estado para armazenar a informação de login
  const [user, setUser] = useState<User>(null);

  // Função para login
  const login = async (email: string, password: string) => {
    const userPayload = {
      email: email,
      senha: password,
    };

    try {
      const response = await api.post("user/login", userPayload);
      if (response.status === 401 || response.status === 500) {
        setUser(null);
        return false; // Login falhou
      } else {
        // Autenticação bem-sucedida
        const token = response.data.token;
        const usu_id = response.data.id;
        const name = response.data.nome;

        setUser({ usu_id: usu_id, token: token, name: name });
        return true; // Login bem-sucedido
      }
    } catch (error) {
      console.log("Erro ao fazer login:", error);
    }
  };

  // Função para login com Google
  const Login_Google = async (email: string, jti: string, nome: string) => {
    const userPayload = {
      email: email,
      jti: jti,
      nome: nome
    };

    try {
      const response = await api.post("user/GoogleLogin", userPayload);
      if (response.status === 401 || response.status === 500) {
        setUser(null);
        return false; // Login falhou
      } else {
        // Autenticação bem-sucedida
        const token = response.data.token;
        const usu_id = response.data.id;
        const name = response.data.nome;

        setUser({ usu_id: usu_id, token: token, name: name });
        return true; // Login bem-sucedido
      }
    } catch (error) {
      console.log("Erro ao fazer login:", error);
    }
  };

  // Função para logout
  const logout = () => {
    setUser(null); // Remover o usuário logado
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, Login_Google }}>
      {children}
    </AuthContext.Provider>
  );
};
