"use client"

import { PlusIcon, GitForkIcon, BookIcon, CodeIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CreateDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <PlusIcon className="h-5 w-5" />
          <span className="sr-only">Create new</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Create New</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/repositories" className="flex items-center w-full">
            <CodeIcon className="mr-2 h-4 w-4" />
            <span>Repository</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <GitForkIcon className="mr-2 h-4 w-4" />
            <span>Fork</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BookIcon className="mr-2 h-4 w-4" />
            <span>Documentation</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}