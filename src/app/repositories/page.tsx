'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, useIsAuthenticated } from '@/context/AuthContext'
import { getRepositories, getRepositoriesByUser } from '@/services/repositoryService'
import { Repository } from '@/lib/types/repositoryTypes'
import { RepositoryList } from '@/components/Repositories/RepositoryList'
import { RepositoryFilters } from '@/components/Repositories/RepositoryFilters'
import { CreateRepositoryButton } from '@/components/Repositories/CreateRepositoryButton'
import { PageHeader } from '@/components/ui/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'

export default function RepositoriesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const isAuthenticated = useIsAuthenticated()
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [userRepositories, setUserRepositories] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('all')

  // Fetch repositories
  useEffect(() => {
    const fetchRepositories = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Fetch all public repositories
        const allRepos = await getRepositories()
        setRepositories(allRepos.filter(repo => !repo.is_private))

        // If authenticated, fetch user's repositories
        if (isAuthenticated && user?.id) {
          const userRepos = await getRepositoriesByUser(user.id)
          setUserRepositories(userRepos)
        }
      } catch (err) {
        console.error('Error fetching repositories:', err)
        setError('Failed to load repositories. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRepositories()
  }, [isAuthenticated, user?.id])

  return (
    <div className="container py-8">
      <PageHeader
        title="Repositories"
        description="Discover and manage decentralized code repositories"
        action={isAuthenticated && <CreateRepositoryButton />}
      />

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md my-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <RepositoryFilters />

          <Tabs defaultValue="all" className="mt-6" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Repositories</TabsTrigger>
              {isAuthenticated && (
                <TabsTrigger value="yours">Your Repositories</TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="all">
              <RepositoryList 
                repositories={repositories} 
                emptyMessage="No public repositories found." 
              />
            </TabsContent>
            {isAuthenticated && (
              <TabsContent value="yours">
                <RepositoryList 
                  repositories={userRepositories} 
                  emptyMessage="You don't have any repositories yet." 
                  showCreateButton 
                />
              </TabsContent>
            )}
          </Tabs>
        </>
      )}
    </div>
  )
}
