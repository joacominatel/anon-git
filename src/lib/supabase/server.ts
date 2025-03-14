'use server'
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return (await cookieStore).getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(async ({ name, value, options }) => (await cookieStore).set(name, value, options))
          } catch (error) {
            console.error("Error setting cookies", error);
          }
        },
      },
    },
  );
};

export const getUser = async (cookieStore: ReturnType<typeof cookies>) => {
  const supabase = await createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()
  return user
}