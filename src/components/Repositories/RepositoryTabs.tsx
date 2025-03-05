'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GitBranchIcon } from "lucide-react"
import { Repository, RepositoryCollaborator } from "@/lib/types/repositoryTypes"
import { User } from "@/lib/types/userTypes"
import { RepositorySettings } from "@/components/Repositories/RepositorySettings"
import { CollaboratorsList } from "@/components/Repositories/CollaboratorsList"
import { RepositoryPermissions } from "@/lib/types/permissionTypes"

interface RepositoryTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  repository: Repository
  permissions: RepositoryPermissions
  isUserAdmin: boolean
  collaborators: RepositoryCollaborator[]
  users: User[]
  onUpdateRepository: (updatedData: Partial<Repository>) => Promise<void>
  onAddCollaborator: (collaboratorId: string, role: 'admin' | 'write' | 'read') => Promise<void>
  onRemoveCollaborator: (collaboratorId: string) => Promise<void>
  onUpdateRole: (collaboratorId: string, newRole: 'admin' | 'write' | 'read') => Promise<void>
}

export function RepositoryTabs({
  activeTab,
  setActiveTab,
  repository,
  permissions,
  isUserAdmin,
  collaborators,
  users,
  onUpdateRepository,
  onAddCollaborator,
  onRemoveCollaborator,
  onUpdateRole
}: RepositoryTabsProps) {
  return (
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
          <RepositorySettings repository={repository} onUpdate={onUpdateRepository} />
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
            onAddCollaborator={onAddCollaborator}
            onRemoveCollaborator={onRemoveCollaborator}
            onUpdateRole={onUpdateRole}
            ownerId={repository.owner_id}
          />
        </div>
      </TabsContent>
    </Tabs>
  )
} 