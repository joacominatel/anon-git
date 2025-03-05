// Tipos de permisos para repositorios
export interface RepositoryPermissions {
  canView: boolean;
  canEdit: boolean;
  isOwner: boolean;
  role: string | null;
} 