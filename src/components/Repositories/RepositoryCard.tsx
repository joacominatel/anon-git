'use client'

import Link from 'next/link'
import { Repository } from '@/lib/types/repositoryTypes'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EyeIcon, EyeOffIcon, CalendarIcon, GitBranchIcon, UsersIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface RepositoryCardProps {
  repository: Repository
  isCollaboration?: boolean
}

export function RepositoryCard({ repository, isCollaboration = false }: RepositoryCardProps) {
  return (
    <Link href={`/repositories/${repository.id}`}>
      <Card className={cn(
        "h-full transition-all hover:shadow-md", 
        isCollaboration && "border-blue-500 border-2"
      )}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{repository.name}</CardTitle>
            <div className="flex gap-1">
              <Badge variant={repository.is_private ? "outline" : "secondary"}>
                {repository.is_private ? <EyeOffIcon className="h-3 w-3 mr-1" /> : <EyeIcon className="h-3 w-3 mr-1" />}
                {repository.is_private ? "Privado" : "Público"}
              </Badge>
              {isCollaboration && (
                <Badge variant="default" className="bg-blue-500 text-white hover:bg-blue-600">
                  <UsersIcon className="h-3 w-3 mr-1" />
                  {repository.collaborator_role === 'admin' 
                    ? 'Admin' 
                    : repository.collaborator_role === 'write' 
                      ? 'Editor' 
                      : 'Lector'}
                </Badge>
              )}
            </div>
          </div>
          <CardDescription className="line-clamp-2">
            {repository.description || "Sin descripción"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <GitBranchIcon className="h-4 w-4 mr-1" />
            <span className="mr-4">{repository.default_branch}</span>
            
            {repository.for_sale && <Badge variant="destructive" className="mr-2">En Venta</Badge>}
            {repository.accepts_donations && <Badge variant="default">Donaciones</Badge>}
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground pt-2">
          <div className="flex items-center">
            <CalendarIcon className="h-3 w-3 mr-1" />
            <span>Actualizado {formatDistanceToNow(new Date(repository.updated_at), { addSuffix: true })}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
} 