import { User } from './userTypes';

export type Repository = {
    id: string; // UUID generado automáticamente
    owner_id: string; // UUID del usuario propietario
    name: string;
    description?: string;
    is_private: boolean;
    accepts_donations: boolean;
    for_sale: boolean;
    price?: number; // Decimal
    default_branch: string;
    created_at: string;
    updated_at: string;
    is_collaborator?: boolean; // Indica si el usuario actual es colaborador
    collaborator_role?: 'admin' | 'write' | 'read'; // Rol del colaborador
    repository_collaborators?: any[]; // Para mapeo de relaciones
};


export type RepositoryCollaborator = {
    repository_id: string; // UUID del repositorio
    user_id: string; // UUID del colaborador
    role: 'admin' | 'write' | 'read';
    created_at: string;
    user?: User; // Información de usuario del colaborador
};

export type RepositoryStar = {
    repository_id: string; // UUID del repositorio
    user_id: string; // UUID del usuario que estrella
    created_at: string;
};

/* Issues */
export type Issue = {
    id: string; // UUID generado automáticamente
    repository_id: string; // UUID del repositorio
    creator_id: string; // UUID del usuario creador
    assignee_id?: string | null; // UUID del asignado, si existe
    title: string;
    description?: string;
    status: 'open' | 'closed';
    created_at: string;
    updated_at: string;
};

/* Pull Requests */
export type PullRequest = {
    id: string; // UUID generado automáticamente
    repository_id: string; // UUID del repositorio
    creator_id: string; // UUID del creador
    title: string;
    description?: string;
    source_branch: string;
    target_branch: string;
    status: 'open' | 'merged' | 'closed';
    created_at: string;
    updated_at: string;
};
