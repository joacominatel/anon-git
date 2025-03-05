"use client"

import { UserIcon, LogOutIcon, UserCircleIcon, PlusIcon, SettingsIcon, LogInIcon } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "@/lib/types/userTypes"

interface ProfileDropdownProps {
  user: User | null
  isAuthenticated: boolean
}

export function ProfileDropdown({ user, isAuthenticated }: ProfileDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src={user?.avatar_url || ""} alt={user?.username} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            <UserCircleIcon className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.full_name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.wallet_address}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAuthenticated && (
          <DropdownMenuGroup>
            <DropdownMenuItem>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <PlusIcon className="mr-2 h-4 w-4" />
            <span>New Repository</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SettingsIcon className="mr-2 h-4 w-4" />
            <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon className="mr-2 h-4 w-4" />
          {isAuthenticated ? <Link href="/logout">Sign Out</Link> : <Link href="/login">Sign In</Link>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}