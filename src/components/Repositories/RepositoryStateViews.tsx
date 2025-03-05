'use client'

import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangleIcon, ArrowLeftIcon } from "lucide-react"

export function LoadingView() {
  return (
    <div className="p-8 flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

interface ErrorViewProps {
  errorMessage: string | null
  onBack: () => void
}

export function ErrorView({ errorMessage, onBack }: ErrorViewProps) {
  return (
    <div className="p-8">
      <div className="bg-destructive/15 text-destructive p-4 rounded-md my-4 flex items-center">
        <AlertTriangleIcon className="h-5 w-5 mr-2" />
        {errorMessage || "Repository not found"}
      </div>
      <Button variant="outline" onClick={onBack} className="mt-4">
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Volver a Repositorios
      </Button>
    </div>
  )
}

interface NoPermissionViewProps {
  onBack: () => void
}

export function NoPermissionView({ onBack }: NoPermissionViewProps) {
  return (
    <div className="p-8">
      <div className="bg-destructive/15 text-destructive p-4 rounded-md my-4 flex items-center">
        <AlertTriangleIcon className="h-5 w-5 mr-2" />
        Este repositorio es privado. No tienes permiso para verlo.
      </div>
      <Button variant="outline" onClick={onBack} className="mt-4">
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Volver a Repositorios
      </Button>
    </div>
  )
} 