'use server'
import { cookies } from "next/headers";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

export type SignUpData = {
  email: string;
  password: string;
  username: string;
  full_name?: string;
  display_name?: string;
  country?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  wallet_address?: string;
};

/**
 * SERVER SIDE FUNCTIONS
 * Estas funciones se ejecutan en el entorno del servidor.
 */

export async function signUpUserServer(data: SignUpData) {
  // Crear cliente Supabase del lado servidor, usando las cookies de Next.js.
  const serverClient = createServerClient(cookies());

  // Registrar el usuario con email y password.
  const { data: authData, error: authError } = await serverClient.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (authError) {
    return { error: authError };
  }

  // Asegurarse de obtener el id del usuario registrado.
  const userId = authData.user?.id;
  if (!userId) {
    return { error: new Error("User ID not found after sign up") };
  }

  // Insertar información adicional en la tabla 'users'.
  const { error: insertError } = await serverClient
    .from("users")
    .insert([
      {
        id: userId,
        username: data.username,
        email: data.email || null,
        full_name: data.full_name || null,
        display_name: data.display_name || null,
        country: data.country || null,
        phone: data.phone || null,
        avatar_url: data.avatar_url || null,
        bio: data.bio || null,
        wallet_address: data.wallet_address || null,
      },
    ]);

  if (insertError) {
    return { error: insertError };
  }

  // El token de sesión se maneja automáticamente en las cookies usando el cookieStore.
  return { user: authData.user, session: authData.session };
}

export async function signInUserServer(email: string, password: string) {
  const serverClient = createServerClient(cookies());
  const { data: authData, error } = await serverClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error };
  }

  // La sesión se almacena automáticamente en las cookies.
  return { user: authData.user, session: authData.session };
}

export async function getUserServer() {
  const serverClient = createServerClient(cookies());
  const {
    data: { user },
    error,
  } = await serverClient.auth.getUser();
  if (error) {
    return { error };
  }
  return { user };
}

export async function signOutUserServer() {
  const serverClient = createServerClient(cookies());
  const { error } = await serverClient.auth.signOut();
  return { error };
}

/**
 * CLIENT SIDE FUNCTIONS
 * Estas funciones se ejecutan en el navegador.
 */

export async function signUpUserClient(data: SignUpData) {
  const client = createBrowserClient();
  const { data: authData, error: authError } = await client.auth.signUp({
    email: data.email,
    password: data.password,
  });
  if (authError) {
    return { error: authError };
  }
  const userId = authData.user?.id;
  if (!userId) {
    return { error: new Error("User ID not found after sign up") };
  }

  // Insertar información adicional en la tabla 'users'
  const { error: insertError } = await client
    .from("users")
    .insert([
      {
        id: userId,
        username: data.username,
        email: data.email,
        full_name: data.full_name,
        display_name: data.display_name,
        country: data.country,
        phone: data.phone,
        avatar_url: data.avatar_url,
        bio: data.bio,
        wallet_address: data.wallet_address,
      },
    ]);
  if (insertError) {
    return { error: insertError };
  }

  // Guardar el token de sesión en las cookies del navegador.
  if (authData.session) {
    document.cookie = `sb:token=${authData.session.access_token}; path=/;`;
  }

  return { user: authData.user, session: authData.session };
}

export async function signInUserClient(email: string, password: string) {
  const client = createBrowserClient();
  const { data: authData, error } = await client.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return { error };
  }
  if (authData.session) {
    document.cookie = `sb:token=${authData.session.access_token}; path=/;`;
  }
  return { user: authData.user, session: authData.session };
}

export async function getUserClient() {
  const client = createBrowserClient();
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error) {
    return { error };
  }
  return { user };
}

export async function signOutUserClient() {
  const client = createBrowserClient();
  const { error } = await client.auth.signOut();
  // Limpiar la cookie del token en el cliente.
  document.cookie = "sb:token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  return { error };
}
