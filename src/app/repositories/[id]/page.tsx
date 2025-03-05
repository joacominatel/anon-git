"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth, useIsAuthenticated } from "@/context/AuthContext"
import { getRepository, deleteRepository, updateRepository } from "@/services/repositoryService"
import type { Repository } from "@/lib/types/repositoryTypes"
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

export default function RepositoryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const isAuthenticated = useIsAuthenticated()
  const [repository, setRepository] = useState<Repository | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState("code")

  const isOwner = isAuthenticated && user?.id === repository?.owner_id

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

  // Check if user can view this repository
  const canView = !repository.is_private || isOwner

  if (!canView) {
    return (
      <div className="container py-8">
        <div className="bg-destructive/15 text-destructive p-4 rounded-md my-4 flex items-center">
          <AlertTriangleIcon className="h-5 w-5 mr-2" />
          This repository is private. You don't have permission to view it.
        </div>
        <Button variant="outline" onClick={() => router.push("/repositories")} className="mt-4">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Repositories
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{repository.name}</h1>
            <Badge variant={repository.is_private ? "outline" : "secondary"}>
              {repository.is_private ? <EyeOffIcon className="h-3 w-3 mr-1" /> : <EyeIcon className="h-3 w-3 mr-1" />}
              {repository.is_private ? "Private" : "Public"}
            </Badge>
            {repository.for_sale && <Badge variant="destructive">For Sale</Badge>}
            {repository.accepts_donations && <Badge variant="default">Accepts Donations</Badge>}
          </div>
          <p className="text-muted-foreground mt-1">{repository.description || "No description provided"}</p>
        </div>
        {isOwner && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setActiveTab("settings")}>
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the repository and all of its contents.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
          {isOwner && <TabsTrigger value="settings">Settings</TabsTrigger>}
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
        {isOwner && (
          <TabsContent value="settings" className="mt-6">
            <RepositorySettings repository={repository} onUpdate={handleUpdateRepository} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

