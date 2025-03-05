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

export async function addCollaborator(repositoryId: string, usernameOrEmail: string, role: 'admin' | 'write' | 'read' = 'read') {
  const { data, error } = await client.rpc('add_repository_collaborator', {
    p_repository_id: repositoryId,
    p_username_or_email: usernameOrEmail, 
    p_role: role
  })
  
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
  const { data, error } = await client.rpc('remove_repository_collaborator', {
    p_repository_id: repositoryId,
    p_user_id: collaboratorId
  })
  
  if (error) {
    throw error
  }
  
  return data
}

export async function getCollaboratorsByRepository(repositoryId: string) {
  const { data, error } = await client
    .from('repository_collaborators')
    .select(`
      repository_id,
      user_id,
      role,
      created_at,
      user:user_id (
        id,
        username,
        email,
        full_name,
        avatar_url
      )
    `)
    .eq('repository_id', repositoryId)
  
  if (error) {
    throw error
  }
  
  // Transformar los datos para mantener la estructura esperada
  return data.map(item => ({
    repository_id: item.repository_id,
    user_id: item.user_id,
    role: item.role,
    created_at: item.created_at,
    user: item.user // Añadir la información de usuario
  }))
}

export async function updateCollaboratorRole(repositoryId: string, collaboratorId: string, newRole: 'admin' | 'write' | 'read') {
  const { data, error } = await client.rpc('update_collaborator_role', {
    p_repository_id: repositoryId,
    p_user_id: collaboratorId,
    p_new_role: newRole
  })
  
  if (error) {
    throw error
  }
  
  return data
}

export async function checkUserRepositoryPermissions(repositoryId: string, userId: string) {
  // Obtener información del repositorio
  const { data: repository, error: repositoryError } = await client.from('repositories').select('owner_id, is_private').eq('id', repositoryId).single()
  if (repositoryError) {
    throw repositoryError
  }

  // Si el repositorio es público, cualquiera puede verlo
  if (!repository.is_private) {
    return { canView: true, canEdit: false, isOwner: repository.owner_id === userId, role: null }
  }

  // Si el usuario es el propietario
  if (repository.owner_id === userId) {
    return { canView: true, canEdit: true, isOwner: true, role: 'owner' }
  }

  // Verificar si el usuario es un colaborador
  const { data: collaborator, error: collaboratorError } = await client.from('repository_collaborators')
    .select('role')
    .eq('repository_id', repositoryId)
    .eq('user_id', userId)
    .single()

  if (collaboratorError) {
    return { canView: false, canEdit: false, isOwner: false, role: null }
  }

  // Determinar permisos basados en el rol
  const canEdit = collaborator.role === 'admin' || collaborator.role === 'write'
  
  return { 
    canView: true, 
    canEdit: canEdit, 
    isOwner: false,
    role: collaborator.role 
  }
}

// Agregamos función para buscar usuarios sin cargar todos
export async function searchUsers(query: string, pageSize: number = 5) {
  const { data, error } = await client.rpc('search_users', {
    search_query: query,
    page_size: pageSize
  })
  
  if (error) {
    throw error
  }
  
  return data
}

// Añadir una nueva función para obtener repositorios donde el usuario es colaborador
export async function getCollaboratedRepositories(userId: string) {
  const { data, error } = await client
    .from('repositories')
    .select('*, repository_collaborators!inner(user_id, role)')
    .eq('repository_collaborators.user_id', userId)
  
  if (error) {
    throw error
  }
  
  // Añadir una propiedad que indique que el usuario es colaborador
  return data.map(repo => ({
    ...repo,
    is_collaborator: true,
    collaborator_role: repo.repository_collaborators[0].role
  }))
}