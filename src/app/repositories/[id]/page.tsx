"use client"

import { useState, use, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { 
  deleteRepository, 
  updateRepository, 
  addCollaborator, 
  removeCollaborator, 
  updateCollaboratorRole
} from "@/services/repositoryService"
import { RepositoryDataLoader } from "@/components/Repositories/RepositoryDataLoader"
import { RepositoryHeader } from "@/components/Repositories/RepositoryHeader"
import { RepositoryStats } from "@/components/Repositories/RepositoryStats"
import { getRepositoryStarsCount } from "@/services/repositoryService"
import { RepositoryTabs } from "@/components/Repositories/RepositoryTabs"
import type { Repository } from "@/lib/types/repositoryTypes"
import { useAuth } from "@/context/AuthContext"

export default function RepositoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("code")
  const [isDeleting, setIsDeleting] = useState(false)
  const [starsCount, setStarsCount] = useState(0)
  // Desempaquetar params usando React.use()
  const { id: repositoryId } = use(params)
  const { user } = useAuth()
  // Manejadores de eventos
  const handleDelete = async (repositoryId: string) => {
    setIsDeleting(true)
    try {
      await deleteRepository(repositoryId)
      toast.success("Repositorio eliminado exitosamente")
      router.push("/repositories")
    } catch (err) {
      console.error("Error eliminando repositorio:", err)
      toast.error("No se pudo eliminar el repositorio")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdateRepository = async (repository: Repository, updatedData: Partial<Repository>) => {
    try {
      const updatedRepo = {
        ...repository,
        ...updatedData,
        updated_at: new Date().toISOString(),
      }
      await updateRepository(repository.id, updatedRepo)
      toast.success("Repositorio actualizado exitosamente")
      return true
    } catch (err) {
      console.error("Error actualizando repositorio:", err)
      toast.error("No se pudo actualizar el repositorio")
      return false
    }
  }

  const handleAddCollaborator = async (repositoryId: string, collaboratorId: string, role: 'admin' | 'write' | 'read' = 'read') => {
    try {
      await addCollaborator(repositoryId, collaboratorId, role)
      toast.success("Colaborador añadido exitosamente")
    } catch (err) {
      console.error("Error añadiendo colaborador:", err)
      toast.error("No se pudo añadir al colaborador: " + (err as Error).message)
      throw err
    }
  }

  const handleRemoveCollaborator = async (repositoryId: string, collaboratorId: string) => {
    try {
      await removeCollaborator(repositoryId, collaboratorId)
      toast.success("Colaborador eliminado exitosamente")
    } catch (err) {
      console.error("Error eliminando colaborador:", err)
      toast.error("No se pudo eliminar al colaborador: " + (err as Error).message)
      throw err
    }
  }

  const handleUpdateCollaboratorRole = async (repositoryId: string, collaboratorId: string, newRole: 'admin' | 'write' | 'read') => {
    try {
      await updateCollaboratorRole(repositoryId, collaboratorId, newRole)
      toast.success("Rol de colaborador actualizado exitosamente")
    } catch (err) {
      console.error("Error actualizando rol de colaborador:", err)
      toast.error("No se pudo actualizar el rol del colaborador: " + (err as Error).message)
      throw err
    }
  }

  useEffect(() => {
    const fetchStarsCount = async () => {
      const starsCount = await getRepositoryStarsCount(repositoryId)
      setStarsCount(starsCount)
    }
    fetchStarsCount()
  }, [repositoryId])

  return (
    <RepositoryDataLoader repositoryId={repositoryId}>
      {({ repository, collaborators, users, permissions, isUserAdmin, refetchData }) => (
        <div className="p-8">
          <RepositoryHeader
            repository={repository}
            collaboratorsCount={collaborators.length}
            permissions={permissions}
            isUserAdmin={isUserAdmin}
            isDeleting={isDeleting}
            onDelete={() => handleDelete(repository.id)}
            onSetActiveTab={setActiveTab}
          />

          <RepositoryStats
            defaultBranch={repository.default_branch}
            starsCount={starsCount}
            createdAt={repository.created_at}
            repositoryId={repository.id}
            userId={user?.id || ""}
          />

          <Separator className="my-6" />

          <RepositoryTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            repository={repository}
            permissions={permissions}
            isUserAdmin={isUserAdmin}
            collaborators={collaborators}
            users={users}
            onUpdateRepository={(updatedData) => handleUpdateRepository(repository, updatedData).then(refetchData)}
            onAddCollaborator={(collaboratorId, role) => 
              handleAddCollaborator(repository.id, collaboratorId, role).then(refetchData)
            }
            onRemoveCollaborator={(collaboratorId) => 
              handleRemoveCollaborator(repository.id, collaboratorId).then(refetchData)
            }
            onUpdateRole={(collaboratorId, newRole) => 
              handleUpdateCollaboratorRole(repository.id, collaboratorId, newRole).then(refetchData)
            }
          />
        </div>
      )}
    </RepositoryDataLoader>
  )
}
