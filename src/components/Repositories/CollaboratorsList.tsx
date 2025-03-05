'use client'

import { useState, useEffect } from "react"
import { RepositoryCollaborator } from "@/lib/types/repositoryTypes"
import { User } from "@/lib/types/userTypes"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserPlusIcon, TrashIcon, User2Icon, Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { searchUsers } from "@/services/repositoryService"
interface CollaboratorsListProps {
    collaborators: RepositoryCollaborator[]
    users: User[]
    repositoryId: string
    isOwner: boolean
    isUserAdmin: boolean
    onAddCollaborator: (collaboratorId: string, role: 'admin' | 'write' | 'read') => Promise<void>
    onRemoveCollaborator: (collaboratorId: string) => Promise<void>
    onUpdateRole: (collaboratorId: string, role: 'admin' | 'write' | 'read') => Promise<void>
    ownerId: string
}

export function CollaboratorsList({ 
    collaborators, 
    users, 
    repositoryId, 
    isOwner, 
    isUserAdmin, 
    onAddCollaborator, 
    onRemoveCollaborator, 
    onUpdateRole, 
    ownerId 
}: CollaboratorsListProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<User[]>([])
    const [newCollaboratorUsername, setNewCollaboratorUsername] = useState("")
    const [newCollaboratorRole, setNewCollaboratorRole] = useState<'admin' | 'write' | 'read'>('read')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const canManageCollaborators = isOwner || isUserAdmin
    console.log(`Usuarios: ${JSON.stringify(users)}`)

    // Función para buscar usuarios
    const handleSearchUsers = async (query: string) => {
        if (query.trim().length < 2) {
            setSearchResults([]);
            return;
        }
        
        setIsSearching(true);
        try {
            const results = await searchUsers(query);
            setSearchResults(results);
        } catch (err) {
            console.error("Error al buscar usuarios:", err);
        } finally {
            setIsSearching(false);
        }
    };

    // Debounce para la búsqueda
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleSearchUsers(searchQuery);
        }, 500);
        
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleAddCollaborator = async () => {
        setIsSubmitting(true)
        setError(null)
        try {
            if (!newCollaboratorUsername || newCollaboratorUsername.trim() === '') {
                setError("Ingrese un nombre de usuario o email válido")
                return
            }

            await onAddCollaborator(newCollaboratorUsername, newCollaboratorRole)
            setNewCollaboratorUsername("")
            setSearchQuery("")
            setNewCollaboratorRole('read')
            setIsAddDialogOpen(false)
        } catch (err) {
            console.error("Error adding collaborator:", err)
            setError("Ocurrió un error al agregar el colaborador: " + (err as Error).message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'admin': return "destructive"
            case 'write': return "default"
            case 'read': return "secondary"
            default: return "outline"
        }
    }

    return (
        <div className="space-y-6">
            {canManageCollaborators && (
                <div className="flex justify-end">
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <UserPlusIcon className="h-4 w-4 mr-2" />
                                Agregar Colaborador
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Agregar Nuevo Colaborador</DialogTitle>
                                <DialogDescription>
                                    Busque un usuario por nombre de usuario o email y seleccione su rol.
                                </DialogDescription>
                            </DialogHeader>
                            {error && (
                                <div className="bg-destructive/15 text-destructive p-2 rounded-md text-sm">
                                    {error}
                                </div>
                            )}
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="search" className="text-right">
                                        Buscar
                                    </Label>
                                    <div className="col-span-3 relative">
                                        <Input
                                            id="search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Buscar por usuario o email"
                                        />
                                        {isSearching && (
                                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            </div>
                                        )}
                                        
                                        {searchResults.length > 0 && (
                                            <div className="absolute z-10 w-full mt-1 bg-background rounded-md border shadow-md max-h-48 overflow-auto">
                                                {searchResults.map(user => (
                                                    <div 
                                                        key={user.id} 
                                                        className="p-2 hover:bg-muted cursor-pointer"
                                                        onClick={() => {
                                                            setNewCollaboratorUsername(user.username);
                                                            setSearchQuery(`${user.username} (${user.email})`);
                                                            setSearchResults([]);
                                                        }}
                                                    >
                                                        <div className="font-medium">{user.username}</div>
                                                        <div className="text-xs text-muted-foreground">{user.email}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="role" className="text-right">
                                        Rol
                                    </Label>
                                    <Select 
                                        value={newCollaboratorRole} 
                                        onValueChange={(value) => setNewCollaboratorRole(value as any)}
                                    >
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Seleccione un rol" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Roles</SelectLabel>
                                                <SelectItem value="admin">Administrador</SelectItem>
                                                <SelectItem value="write">Escritura</SelectItem>
                                                <SelectItem value="read">Lectura</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button 
                                    variant="outline" 
                                    onClick={() => setIsAddDialogOpen(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button 
                                    onClick={handleAddCollaborator} 
                                    disabled={isSubmitting || !newCollaboratorUsername}
                                >
                                    {isSubmitting ? "Agregando..." : "Agregar"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            )}

            {collaborators.length === 0 ? (
                <div className="text-muted-foreground text-center p-4 border rounded-md">
                    No hay colaboradores en este repositorio.
                </div>
            ) : (
                <div className="space-y-2">
                    {collaborators.map((collaborator) => {
                        const user = collaborator.user || users.find(u => u.id === collaborator.user_id)
                        const isRepositoryOwner = collaborator.user_id === ownerId
                        
                        return (
                            <div 
                                key={collaborator.user_id} 
                                className="flex items-center justify-between p-3 border rounded-md"
                            >
                                <div className="flex items-center gap-2">
                                    <User2Icon className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">
                                            {getUserDisplayName(user)}
                                            {isRepositoryOwner && (
                                                <Badge variant="outline" className="ml-2">
                                                    Propietario
                                                </Badge>
                                            )}
                                        </div>
                                        {!isRepositoryOwner && (
                                            <div className="flex items-center gap-2">
                                                <Badge variant={getRoleBadgeVariant(collaborator.role)}>
                                                    {collaborator.role === 'admin' 
                                                        ? 'Administrador' 
                                                        : collaborator.role === 'write' 
                                                            ? 'Escritura' 
                                                            : 'Lectura'}
                                                </Badge>
                                                {isOwner && (
                                                    <Select 
                                                        defaultValue={collaborator.role} 
                                                        onValueChange={(value) => onUpdateRole(
                                                            collaborator.user_id, 
                                                            value as 'admin' | 'write' | 'read'
                                                        )}
                                                    >
                                                        <SelectTrigger className="h-7 text-xs">
                                                            <SelectValue placeholder="Cambiar rol" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="admin">Administrador</SelectItem>
                                                            <SelectItem value="write">Escritura</SelectItem>
                                                            <SelectItem value="read">Lectura</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {(isOwner || (isUserAdmin && !isRepositoryOwner)) && !isRepositoryOwner && (
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => onRemoveCollaborator(collaborator.user_id)}
                                    >
                                        <TrashIcon className="h-4 w-4 text-destructive" />
                                    </Button>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function getUserDisplayName(user?: User) {
    if (!user) return "Usuario desconocido"
    return user.full_name || user.email || user.id
}