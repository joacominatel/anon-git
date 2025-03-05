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
  const { data, error } = await client.from('repositories').select('*').eq('owner_id', userId)
  if (error) {
    throw error
  }
  return data
}

export async function addCollaborator(repositoryId: string, collaboratorId: string) {
  //   check if user is owner of repository
  const { data: repository, error: repositoryError } = await client.from('repositories').select('owner_id').eq('id', repositoryId).single()
  if (repositoryError) {
    throw repositoryError
  }
  if (repository.owner_id !== collaboratorId) {
    throw new Error('User is not the owner of the repository')
  }

  const { data, error } = await client.from('collaborators').insert({ repository_id: repositoryId, user_id: collaboratorId })
  if (error) {
    throw error
  }
  return data
}

export async function getCollaborators(repositoryId: string) {
  const { data, error } = await client.from('collaborators').select('*').eq('repository_id', repositoryId)
  if (error) {
    throw error
  }
  return data
}

export async function removeCollaborator(repositoryId: string, collaboratorId: string) {
    // check if user is owner of repository
    const { data: repository, error: repositoryError } = await client.from('repositories').select('owner_id').eq('id', repositoryId).single()
    if (repositoryError) {
        throw repositoryError
    }
    if (repository.owner_id !== collaboratorId) {
        throw new Error('User is not the owner of the repository')
    }
}

export async function getCollaboratorsByRepository(repositoryId: string) {
  const { data, error } = await client.from('collaborators').select('*').eq('repository_id', repositoryId)
  if (error) {
    throw error
  }
  return data
}