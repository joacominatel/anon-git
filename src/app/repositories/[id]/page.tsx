"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth, useIsAuthenticated } from "@/context/AuthContext"
import { getRepository, deleteRepository, updateRepository, addCollaborator, getCollaboratorsByRepository, removeCollaborator, updateCollaboratorRole, checkUserRepositoryPermissions } from "@/services/repositoryService"
import { getAllUsers } from "@/services/userServices"
import type { Repository, RepositoryCollaborator } from "@/lib/types/repositoryTypes"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  GitBranchIcon,
  StarIcon,
  GitForkIcon,
  EyeIcon,
  EyeOffIcon,
  CalendarIcon,
  Loader2,
  PencilIcon,
  TrashIcon,
  AlertTriangleIcon,
  ArrowLeftIcon,
  UsersIcon,
} from "lucide-react"
import { format } from "date-fns"
import { RepositorySettings } from "@/components/Repositories/RepositorySettings"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CollaboratorsList } from "@/components/Repositories/CollaboratorsList"

// Definir el tipo User aquí para evitar problemas de importación
type User = {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  display_name?: string;
  country?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  wallet_address?: string;
  created_at: string; 
  updated_at: string;
};

export default function RepositoryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const isAuthenticated = useIsAuthenticated()
  const [repository, setRepository] = useState<Repository | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState("code")
  const [collaborators, setCollaborators] = useState<RepositoryCollaborator[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [permissions, setPermissions] = useState<{
    canView: boolean;
    canEdit: boolean;
    isOwner: boolean;
    role: string | null;
  }>({
    canView: false,
    canEdit: false,
    isOwner: false,
    role: null,
  })

  const isUserAdmin = collaborators.some(
    collab => collab.user_id === user?.id && collab.role === 'admin'
  )
  
  const canManageRepository = permissions.isOwner || isUserAdmin

  useEffect(() => {
    const fetchRepository = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getRepository(params.id)
        if (data && data.length > 0) {
          setRepository(data[0])
        } else {
          setError("Repository not found")
        }
      } catch (err) {
        console.error("Error fetching repository:", err)
        setError("Failed to load repository. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRepository()
  }, [params.id])

  useEffect(() => {
    const checkPermissions = async () => {
      if (isAuthenticated && user && repository) {
        try {
          const userPermissions = await checkUserRepositoryPermissions(repository.id, user.id);
          setPermissions(userPermissions);
        } catch (err) {
          console.error("Error checking permissions:", err);
        }
      }
    };
    
    if (repository && isAuthenticated) {
      checkPermissions();
    } else if (repository && !repository.is_private) {
      setPermissions({
        canView: true,
        canEdit: false,
        isOwner: false,
        role: null
      });
    }
  }, [repository, isAuthenticated, user]);

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const data = await getCollaboratorsByRepository(params.id);
        setCollaborators(data);
      } catch (err) {
        console.error("Error fetching collaborators:", err);
      }
    };
    fetchCollaborators();
  }, [params.id]);

  const handleAddCollaborator = async (collaboratorId: string, role: 'admin' | 'write' | 'read' = 'read') => {
    if (!repository?.id) {
      toast.error("Repository ID is missing")
      return
    }
    try {
      await addCollaborator(repository.id, collaboratorId, role)
      toast.success("Colaborador añadido exitosamente")
      const updatedCollaborators = await getCollaboratorsByRepository(repository.id)
      setCollaborators(updatedCollaborators)
    } catch (err) {
      console.error("Error adding collaborator:", err)
      toast.error("No se pudo añadir al colaborador: " + (err as Error).message)
    }
  }

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    if (!repository?.id) {
      toast.error("Repository ID is missing")
      return
    }
    try {
      await removeCollaborator(repository.id, collaboratorId)
      toast.success("Colaborador eliminado exitosamente")
      setCollaborators(collaborators.filter(c => c.user_id !== collaboratorId))
    } catch (err) {
      console.error("Error removing collaborator:", err)
      toast.error("No se pudo eliminar al colaborador: " + (err as Error).message)
    }
  }

  const handleUpdateCollaboratorRole = async (collaboratorId: string, newRole: 'admin' | 'write' | 'read') => {
    if (!repository?.id) {
      toast.error("Repository ID is missing")
      return
    }
    try {
      await updateCollaboratorRole(repository.id, collaboratorId, newRole)
      toast.success("Rol de colaborador actualizado exitosamente")
      setCollaborators(collaborators.map(c => 
        c.user_id === collaboratorId 
          ? { ...c, role: newRole } 
          : c
      ))
    } catch (err) {
      console.error("Error updating collaborator role:", err)
      toast.error("No se pudo actualizar el rol del colaborador: " + (err as Error).message)
    }
  }
  
  const handleDelete = async () => {
    if (!repository) return

    setIsDeleting(true)
    try {
      await deleteRepository(repository.id)
      toast.success("Repository deleted successfully")
      router.push("/repositories")
    } catch (err) {
      console.error("Error deleting repository:", err)
      toast.error("Failed to delete repository")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdateRepository = async (updatedData: Partial<Repository>) => {
    if (!repository) return

    try {
      const updatedRepo = {
        ...repository,
        ...updatedData,
        updated_at: new Date().toISOString(),
      }
      await updateRepository(repository.id, updatedRepo)
      setRepository(updatedRepo)
      toast.success("Repository updated successfully")
    } catch (err) {
      console.error("Error updating repository:", err)
      toast.error("Failed to update repository")
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !repository) {
    return (
      <div className="p-8">
        <div className="bg-destructive/15 text-destructive p-4 rounded-md my-4 flex items-center">
          <AlertTriangleIcon className="h-5 w-5 mr-2" />
          {error || "Repository not found"}
        </div>
        <Button variant="outline" onClick={() => router.push("/repositories")} className="mt-4">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Repositories
        </Button>
      </div>
    )
  }

  if (!permissions.canView) {
    return (
      <div className="p-8">
        <div className="bg-destructive/15 text-destructive p-4 rounded-md my-4 flex items-center">
          <AlertTriangleIcon className="h-5 w-5 mr-2" />
          Este repositorio es privado. No tienes permiso para verlo.
        </div>
        <Button variant="outline" onClick={() => router.push("/repositories")} className="mt-4">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Volver a Repositorios
        </Button>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{repository.name}</h1>
            <Badge variant={repository.is_private ? "outline" : "secondary"}>
              {repository.is_private ? <EyeOffIcon className="h-3 w-3 mr-1" /> : <EyeIcon className="h-3 w-3 mr-1" />}
              {repository.is_private ? "Privado" : "Público"}
            </Badge>
            {repository.for_sale && <Badge variant="destructive">En Venta</Badge>}
            {repository.accepts_donations && <Badge variant="default">Acepta Donaciones</Badge>}
            <Badge variant="secondary">{collaborators.length} colaboradores</Badge>
            {permissions.role && (
              <Badge variant={permissions.role === 'admin' ? 'destructive' : permissions.role === 'write' ? 'default' : 'secondary'}>
                Tu rol: {permissions.role === 'admin' ? 'Administrador' : permissions.role === 'write' ? 'Escritura' : 'Lectura'}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1">{repository.description || "Sin descripción"}</p>
        </div>
        {canManageRepository && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setActiveTab("settings")}>
              <PencilIcon className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button variant="outline" onClick={() => setActiveTab("collaborators")}>
              <UsersIcon className="h-4 w-4 mr-2" />
              Colaboradores
            </Button>
            {permissions.isOwner && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Eliminará permanentemente el repositorio y todo su contenido.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                      {isDeleting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Eliminando...
                        </>
                      ) : (
                        "Eliminar"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
        <div className="flex items-center">
          <GitBranchIcon className="h-4 w-4 mr-1" />
          <span>{repository.default_branch}</span>
        </div>
        <div className="flex items-center">
          <StarIcon className="h-4 w-4 mr-1" />
          <span>0 stars</span>
        </div>
        <div className="flex items-center">
          <GitForkIcon className="h-4 w-4 mr-1" />
          <span>0 forks</span>
        </div>
        <div className="flex items-center">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>Created {format(new Date(repository.created_at), "MMM d, yyyy")}</span>
        </div>
      </div>

      <Separator className="my-6" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="pull-requests">Pull Requests</TabsTrigger>
          {permissions.isOwner && <TabsTrigger value="settings">Settings</TabsTrigger>}
          <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
        </TabsList>
        <TabsContent value="code" className="mt-6">
          <div className="bg-muted p-8 rounded-md text-center">
            <GitBranchIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Repository content will appear here</h3>
            <p className="text-muted-foreground mt-2">This is a placeholder for the repository content view.</p>
          </div>
        </TabsContent>
        <TabsContent value="issues" className="mt-6">
          <div className="bg-muted p-8 rounded-md text-center">
            <h3 className="text-lg font-medium">No issues yet</h3>
            <p className="text-muted-foreground mt-2">Issues for this repository will appear here.</p>
          </div>
        </TabsContent>
        <TabsContent value="pull-requests" className="mt-6">
          <div className="bg-muted p-8 rounded-md text-center">
            <h3 className="text-lg font-medium">No pull requests yet</h3>
            <p className="text-muted-foreground mt-2">Pull requests for this repository will appear here.</p>
          </div>
        </TabsContent>
        {permissions.isOwner && (
          <TabsContent value="settings" className="mt-6">
            <RepositorySettings repository={repository} onUpdate={handleUpdateRepository} />
          </TabsContent>
        )}
        <TabsContent value="collaborators" className="mt-6">
          <div className="rounded-md border p-6">
            <h2 className="text-xl font-bold mb-4">Colaboradores del Repositorio</h2>
            <p className="text-muted-foreground mb-6">
              Los colaboradores pueden acceder a este repositorio según su nivel de permiso. 
              Los administradores pueden gestionar colaboradores y realizar cambios en el repositorio.
            </p>
            <CollaboratorsList 
              collaborators={collaborators} 
              users={users}
              repositoryId={repository.id}
              isOwner={permissions.isOwner}
              isUserAdmin={isUserAdmin}
              onAddCollaborator={handleAddCollaborator}
              onRemoveCollaborator={handleRemoveCollaborator}
              onUpdateRole={handleUpdateCollaboratorRole}
              ownerId={repository.owner_id}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

