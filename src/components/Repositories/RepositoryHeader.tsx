'use client'

import { useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  EyeIcon,
  EyeOffIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
  Loader2
} from "lucide-react"
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
import { Repository } from "@/lib/types/repositoryTypes"
import { RepositoryPermissions } from "@/lib/types/permissionTypes"

interface RepositoryHeaderProps {
  repository: Repository
  collaboratorsCount: number
  permissions: RepositoryPermissions
  isUserAdmin: boolean
  isDeleting: boolean
  onDelete: () => Promise<void>
  onSetActiveTab: (tab: string) => void
}

export function RepositoryHeader({
  repository,
  collaboratorsCount,
  permissions,
  isUserAdmin,
  isDeleting,
  onDelete,
  onSetActiveTab
}: RepositoryHeaderProps) {
  const canManageRepository = permissions.isOwner || isUserAdmin

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-3xl font-bold tracking-tight">{repository.name}</h1>
          <Badge variant={repository.is_private ? "outline" : "secondary"}>
            {repository.is_private ? <EyeOffIcon className="h-3 w-3 mr-1" /> : <EyeIcon className="h-3 w-3 mr-1" />}
            {repository.is_private ? "Privado" : "Público"}
          </Badge>
          {repository.for_sale && <Badge variant="destructive">En Venta</Badge>}
          {repository.accepts_donations && <Badge variant="default">Acepta Donaciones</Badge>}
          <Badge variant="secondary">{collaboratorsCount} colaboradores</Badge>
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
          <Button variant="outline" onClick={() => onSetActiveTab("settings")}>
            <PencilIcon className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" onClick={() => onSetActiveTab("collaborators")}>
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
                  <AlertDialogAction onClick={onDelete} disabled={isDeleting}>
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
  )
} 