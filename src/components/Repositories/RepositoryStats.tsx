'use client'

import { 
  GitBranchIcon, 
  StarIcon, 
  GitForkIcon, 
  CalendarIcon 
} from "lucide-react"
import { format } from "date-fns"
import { getIsStarred, toggleStarRepository, getRepositoryStarsCount } from "@/services/repositoryService"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface RepositoryStatsProps {
  defaultBranch: string
  createdAt: string
  starsCount?: number
  forksCount?: number
  repositoryId: string
  userId: string
}

export function RepositoryStats({
  defaultBranch,
  createdAt,
  forksCount = 0,
  repositoryId,
  userId
}: RepositoryStatsProps) {
  const [isStarred, setIsStarred] = useState(false)
  const [starsCount, setStarsCount] = useState(0)

  const handleToggleStar = async (repositoryId: string, userId: string) => {
    await toggleStarRepository(repositoryId, userId)
    setIsStarred(!isStarred)
    if (isStarred) {
      toast.success("Repository unstarred")
      setStarsCount(starsCount - 1)
    } else {
      toast.success("Repository starred")
      setStarsCount(starsCount + 1)
    }
  }

  useEffect(() => {
    const fetchIsStarred = async () => {
      const isStarred = await getIsStarred(repositoryId, userId)
      setIsStarred(isStarred)
    }
    fetchIsStarred()
    const fetchStarsCount = async () => {
      const starsCount = await getRepositoryStarsCount(repositoryId)
      setStarsCount(starsCount)
    }
    fetchStarsCount()
  }, [repositoryId, userId])
  

  return (
    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
      <div className="flex items-center">
        <GitBranchIcon className="h-4 w-4 mr-1" />
        <span>{defaultBranch}</span>
      </div>
      <div className="flex items-center">
        <StarIcon className={cn("h-4 w-4 mr-1 cursor-pointer", { "text-yellow-500": isStarred })} onClick={() => handleToggleStar(repositoryId, userId)} />
        <span>{starsCount} {starsCount === 1 ? "star" : "stars"}</span>
      </div>
      <div className="flex items-center">
        <GitForkIcon className="h-4 w-4 mr-1" />
        <span>{forksCount} forks</span>
      </div>
      <div className="flex items-center">
        <CalendarIcon className="h-4 w-4 mr-1" />
        <span>Created {format(new Date(createdAt), "MMM d, yyyy")}</span>
      </div>
    </div>
  )
} 