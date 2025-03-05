'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  signInUserClient,
  signUpUserClient,
  signOutUserClient,
  getUserClient,
  type SignUpData,
} from '@/services/userServices';
import type { User } from '@/lib/types/userTypes';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Refrescar el estado del usuario desde el cliente
  const refreshUser = async () => {
    setLoading(true);
    const { user: fetchedUser, error } = await getUserClient();
    if (!error) {
      setUser(fetchedUser as unknown as User);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Al montar, se intenta recuperar el usuario autenticado
    refreshUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user: loggedInUser, error } = await signInUserClient(email, password);
      if (error) {
        console.error("Error al iniciar sesión:", error.message);
      } else {
        setUser(loggedInUser as unknown as User);
      }
    } catch (error) {
      console.error("Error en signIn:", error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: SignUpData) => {
    setLoading(true);
    try {
      const { user: newUser, error } = await signUpUserClient(data);
      if (error) {
        console.error("Error al registrarse:", error.message);
      } else {
        setUser(newUser as unknown as User);
      }
    } catch (error) {
      console.error("Error en signUp:", error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await signOutUserClient();
      if (error) {
        console.error("Error al cerrar sesión:", error.message);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error en signOut:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
