'use client'

import { useEffect, useState } from "react"
import { useAuth, useIsAuthenticated } from "@/context/AuthContext"
import { 
  getRepository, 
  getCollaboratorsByRepository, 
  checkUserRepositoryPermissions 
} from "@/services/repositoryService"
import { Repository, RepositoryCollaborator } from "@/lib/types/repositoryTypes"
import { User } from "@/lib/types/userTypes"
import { RepositoryPermissions } from "@/lib/types/permissionTypes"
import { LoadingView, ErrorView, NoPermissionView } from "./RepositoryStateViews"
import { useRouter } from "next/navigation"

// Tipo para representar la estructura de la respuesta API de colaboradores
interface CollaboratorResponse {
  repository_id: string;
  user_id: string;
  role: 'admin' | 'write' | 'read';
  created_at: string;
  user: {
    id: string;
    username: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    created_at?: string;
    updated_at?: string;
  }[];
}

interface RepositoryDataLoaderProps {
  repositoryId: string;
  children: (props: {
    repository: Repository;
    collaborators: RepositoryCollaborator[];
    users: User[];
    permissions: RepositoryPermissions;
    isUserAdmin: boolean;
    refetchData: () => Promise<void>;
  }) => React.ReactNode;
}

export function RepositoryDataLoader({ repositoryId, children }: RepositoryDataLoaderProps) {
  const router = useRouter();
  const { user } = useAuth();
  const isAuthenticated = useIsAuthenticated();
  const [repository, setRepository] = useState<Repository | null>(null);
  const [collaborators, setCollaborators] = useState<RepositoryCollaborator[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<RepositoryPermissions>({
    canView: false,
    canEdit: false,
    isOwner: false,
    role: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isUserAdmin = collaborators.some(
    (collab) => collab.user_id === user?.id && collab.role === 'admin'
  );

  // Función para cargar todos los datos del repositorio
  const fetchRepositoryData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Cargar repositorio
      const repoData = await getRepository(repositoryId);
      if (repoData && repoData.length > 0) {
        setRepository(repoData[0]);
        
        // Verificar permisos
        if (isAuthenticated && user) {
          const userPermissions = await checkUserRepositoryPermissions(repoData[0].id, user.id);
          setPermissions(userPermissions);
        } else if (!repoData[0].is_private) {
          setPermissions({
            canView: true,
            canEdit: false,
            isOwner: false,
            role: null
          });
        }

        // Cargar colaboradores
        const collaboratorsData = await getCollaboratorsByRepository(repoData[0].id);
        const formattedCollaborators = collaboratorsData.map((collaborator: CollaboratorResponse) => {
          return {
            repository_id: collaborator.repository_id,
            user_id: collaborator.user_id,
            role: collaborator.role,
            created_at: collaborator.created_at,
            user: collaborator.user[0] ? {
              id: collaborator.user[0].id,
              username: collaborator.user[0].username,
              email: collaborator.user[0].email,
              full_name: collaborator.user[0].full_name,
              avatar_url: collaborator.user[0].avatar_url,
              created_at: collaborator.user[0].created_at || "",
              updated_at: collaborator.user[0].updated_at || ""
            } : undefined
          };
        });
        setCollaborators(formattedCollaborators);
      } else {
        setError("Repository not found");
      }
    } catch (err) {
      console.error("Error fetching repository data:", err);
      setError("Failed to load repository data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchRepositoryData();
  }, [repositoryId, user, isAuthenticated]);

  // Renderizado condicional basado en el estado
  if (isLoading) {
    return <LoadingView />;
  }

  if (error || !repository) {
    return <ErrorView errorMessage={error} onBack={() => router.push("/repositories")} />;
  }

  if (!permissions.canView) {
    return <NoPermissionView onBack={() => router.push("/repositories")} />;
  }

  // Renderizar el componente hijo con los datos cargados
  return <>{children({
    repository,
    collaborators,
    users,
    permissions,
    isUserAdmin,
    refetchData: fetchRepositoryData
  })}</>;
} 