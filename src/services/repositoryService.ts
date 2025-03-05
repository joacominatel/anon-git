'use client'
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import type { Repository } from "@/lib/types/repositoryTypes";

const client = createBrowserClient()

export async function createRepository(repository: Omit<Repository, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await client.from('repositories').insert(repository)
  if (error) {
    throw error
  }
  return data
}

export async function getRepository(id: string) {
  const { data, error } = await client.from('repositories').select('*').eq('id', id)
  if (error) {
    throw error
  }
  return data
}

export async function updateRepository(id: string, repository: Repository) {
  const { data, error } = await client.from('repositories').update(repository).eq('id', id)
  if (error) {
    throw error
  }
  return data
}

export async function deleteRepository(id: string) {
  const { error } = await client.from('repositories').delete().eq('id', id)
  if (error) {
    throw error
  }
}

export async function getRepositories() {
  const { data, error } = await client.from('repositories').select('*')
  if (error) {
    throw error
  }
  return data
}

export async function getRepositoriesByUser(userId: string) {
  const { data, error } = await client.from('repositories').select('*').eq('user_id', userId)
  if (error) {
    throw error
  }
  return data
}