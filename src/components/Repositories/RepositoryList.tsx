'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Repository } from '@/lib/types/repositoryTypes'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GitForkIcon, StarIcon, EyeIcon, EyeOffIcon, CalendarIcon, GitBranchIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { CreateRepositoryButton } from './CreateRepositoryButton'
import {
  Pagination
} from '@/components/ui/pagination'

interface RepositoryListProps {
  repositories: Repository[]
  emptyMessage: string
  showCreateButton?: boolean
}

export function RepositoryList({ repositories, emptyMessage, showCreateButton = false }: RepositoryListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = repositories.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(repositories.length / itemsPerPage)

  if (repositories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <GitBranchIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">{emptyMessage}</h3>
        <p className="text-muted-foreground mt-2 mb-6">
          {showCreateButton ? 'Create your first repository to get started.' : 'Check back later for new repositories.'}
        </p>
        {showCreateButton && <CreateRepositoryButton />}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((repo) => (
          <Card key={repo.id} className="flex flex-col h-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    <Link href={`/repositories/${repo.id}`} className="hover:underline">
                      {repo.name}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {repo.description || 'No description provided'}
                  </CardDescription>
                </div>
                <Badge variant={repo.is_private ? 'outline' : 'secondary'}>
                  {repo.is_private ? (
                    <EyeOffIcon className="h-3 w-3 mr-1" />
                  ) : (
                    <EyeIcon className="h-3 w-3 mr-1" />
                  )}
                  {repo.is_private ? 'Private' : 'Public'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                <span>Updated {formatDistanceToNow(new Date(repo.updated_at))} ago</span>
              </div>
              {repo.for_sale && (
                <Badge variant="destructive" className="mt-2">
                  For Sale
                </Badge>
              )}
              {repo.accepts_donations && (
                <Badge variant="default" className="mt-2 ml-2">
                  Accepts Donations
                </Badge>
              )}
            </CardContent>
            <CardFooter className="pt-2 border-t flex justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm">
                  <GitBranchIcon className="h-3.5 w-3.5 mr-1" />
                  <span>{repo.default_branch}</span>
                </div>
                <div className="flex items-center text-sm">
                  <StarIcon className="h-3.5 w-3.5 mr-1" />
                  <span>0</span>
                </div>
                <div className="flex items-center text-sm">
                  <GitForkIcon className="h-3.5 w-3.5 mr-1" />
                  <span>0</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/repositories/${repo.id}`}>View</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}
