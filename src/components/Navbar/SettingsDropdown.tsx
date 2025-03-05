"use client"

import { SettingsIcon, GlobeIcon, ShieldIcon, KeyIcon, EyeIcon, LockIcon } from "lucide-react"
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

export function SettingsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <SettingsIcon className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <GlobeIcon className="mr-2 h-4 w-4" />
            <span>Network Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShieldIcon className="mr-2 h-4 w-4" />
            <span>Privacy</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <KeyIcon className="mr-2 h-4 w-4" />
            <span>Encryption Keys</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <EyeIcon className="mr-2 h-4 w-4" />
            <span>Visibility</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LockIcon className="mr-2 h-4 w-4" />
            <span>Security</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}