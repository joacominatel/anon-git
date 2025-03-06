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
  // Obtener usuario de autenticación
  const {
    data: { user: authUser },
    error,
  } = await client.auth.getUser();
  
  if (error || !authUser) {
    return { error };
  }
  
  console.log('authUser', authUser.id)
  // Obtener datos adicionales de la tabla users
  const { data: userData, error: userError } = await client
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (userError) {
    console.error('Error fetching user data from users table:', userError);
    return { user: authUser };
  }
  
  // Combinar los datos de autenticación con los datos de la tabla users
  const fullUser = {
    ...authUser,
    ...userData
  };
  
  return { user: fullUser };
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

export async function updatePassword(password: string) {
  const { error } = await client.auth.updateUser({
    password,
  });
  return { error };
}

export async function getAllUsers() {
  const { data, error } = await client.from('users').select('*');
  if (error) {
    throw error;
  }
  return data;
}

export async function signInWithPhantomClient() {
  // Verificar si Phantom está instalado
  const isPhantomInstalled = window.phantom?.solana?.isPhantom || false;
  
  if (!isPhantomInstalled) {
    return { 
      error: new Error("Phantom no está instalado. Por favor instala la extensión de Phantom para continuar.") 
    };
  }

  try {
    // Conectar con Phantom
    const provider = window.phantom?.solana;
    
    if (!provider) {
      return { error: new Error("No se pudo acceder al proveedor de Phantom") };
    }
    console.log('provider', provider)
    
    const { publicKey } = await provider.connect();
    console.log('publicKey', publicKey)
    
    if (!publicKey) {
      return { error: new Error("No se pudo obtener la clave pública de Phantom") };
    }
    
    const walletAddress = publicKey.toString();
    
    // Generar un mensaje para firmar
    const message = `Iniciar sesión en AnonGit: ${new Date().toISOString()}`;
    const encodedMessage = new TextEncoder().encode(message);
    
    // Solicitar firma al usuario
    const signatureData = await provider.signMessage(encodedMessage, "utf8");
    const signature = Buffer.from(signatureData.signature).toString('hex');
    
    // Autenticar con Supabase usando signInWithIdToken
    const { data: authData, error: authError } = await client.auth.signInWithIdToken({
      token: signature,
      provider: 'solana',
    });

    if (authError) {
      // Si el usuario no existe, intentamos registrarlo
      if (authError.message.includes('user not found')) {
        return await signUpWithPhantomClient(walletAddress, signature, message);
      }
      return { error: authError };
    }
    
    // Guardar el token de sesión
    if (authData.session) {
      document.cookie = `sb:token=${authData.session.access_token}; path=/;`;
    }
    
    return { user: authData.user, session: authData.session };
  } catch (error) {
    console.error('Error al autenticar con Phantom:', error);
    return { 
      error: new Error(error instanceof Error ? error.message : 'Error desconocido al conectar con Phantom') 
    };
  }
}

export async function signUpWithPhantomClient(walletAddress: string, signature: string, nonce: string) {
  try {
    // Generar un email único basado en la dirección de wallet
    const email = `${walletAddress.substring(0, 10)}@phantom.solana`;
    // Generar una contraseña aleatoria segura
    const password = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    
    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await client.auth.signUp({
      email,
      password,
    });
    
    if (authError) {
      return { error: authError };
    }
    
    const userId = authData.user?.id;
    if (!userId) {
      return { error: new Error("ID de usuario no encontrado después del registro") };
    }
    
    // Generar un nombre de usuario único
    const username = `solana_${walletAddress.substring(0, 8)}`;
    
    // Insertar información en la tabla 'users'
    const { error: insertError } = await client
      .from("users")
      .insert([
        {
          id: userId,
          username,
          email,
          wallet_address: walletAddress,
          display_name: `Solana User ${walletAddress.substring(0, 6)}`,
        },
      ]);
      
    if (insertError) {
      return { error: insertError };
    }
    
    // Iniciar sesión con el usuario recién creado
    const { data: signInData, error: signInError } = await client.auth.signInWithPassword({
      email,
      password,
    });
    
    if (signInError) {
      return { error: signInError };
    }
    
    // Guardar el token de sesión
    if (signInData.session) {
      document.cookie = `sb:token=${signInData.session.access_token}; path=/;`;
    }
    
    return { user: signInData.user, session: signInData.session };
  } catch (error) {
    console.error('Error al registrar usuario con Phantom:', error);
    return { 
      error: new Error(error instanceof Error ? error.message : 'Error desconocido al registrar con Phantom') 
    };
  }
}