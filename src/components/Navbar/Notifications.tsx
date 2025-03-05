/* eslint-disable react/no-unescaped-entities */
"use client"

import { BellIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function Notifications() {
  const notificationCount = 3

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          {notificationCount > 0 && (
            <Badge
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
              variant="destructive"
            >
              {notificationCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          <DropdownMenuItem className="flex flex-col items-start">
            <div className="font-medium">New pull request</div>
            <div className="text-xs text-muted-foreground">Anonymous user opened a pull request in anon-git/core</div>
            <div className="text-xs text-muted-foreground mt-1">2 minutes ago</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex flex-col items-start">
            <div className="font-medium">Repository starred</div>
            <div className="text-xs text-muted-foreground">
              Your repository anon-git/docs was starred by 0x7890...1234
            </div>
            <div className="text-xs text-muted-foreground mt-1">1 hour ago</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex flex-col items-start">
            <div className="font-medium">Issue comment</div>
            <div className="text-xs text-muted-foreground">
              New comment on issue #42: "Implement decentralized authentication"
            </div>
            <div className="text-xs text-muted-foreground mt-1">3 hours ago</div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-primary">View all notifications</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

