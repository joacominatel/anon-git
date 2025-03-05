'use client'
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
 * CLIENT SIDE FUNCTIONS
 * Estas funciones se ejecutan en el navegador.
 */

const client = createBrowserClient();

export async function signUpUserClient(data: SignUpData) {
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
  const { error } = await client.auth.signOut();
  // Limpiar la cookie del token en el cliente.
  document.cookie = "sb:token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  return { error };
}

export async function resetPassword(email: string) {
  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/update-password`,
  });
  return { error };
}