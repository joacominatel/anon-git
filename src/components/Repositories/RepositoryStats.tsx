'use client'

import { 
  GitBranchIcon, 
  StarIcon, 
  GitForkIcon, 
  CalendarIcon 
} from "lucide-react"
import { format } from "date-fns"

interface RepositoryStatsProps {
  defaultBranch: string
  createdAt: string
  starsCount?: number
  forksCount?: number
}

export function RepositoryStats({
  defaultBranch,
  createdAt,
  starsCount = 0,
  forksCount = 0
}: RepositoryStatsProps) {
  return (
    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
      <div className="flex items-center">
        <GitBranchIcon className="h-4 w-4 mr-1" />
        <span>{defaultBranch}</span>
      </div>
      <div className="flex items-center">
        <StarIcon className="h-4 w-4 mr-1" />
        <span>{starsCount} stars</span>
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