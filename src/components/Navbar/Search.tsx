"use client"

import { useState } from "react"
import { SearchIcon } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"

export function Search() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full md:w-full justify-start text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline-block">Search repositories...</span>
        <span className="sm:hidden">Search</span>
        <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search repositories, users, or code..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Repositories">
            <CommandItem>anon-git/core</CommandItem>
            <CommandItem>anon-git/docs</CommandItem>
            <CommandItem>anon-git/examples</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Users">
            <CommandItem>anonymous-user-1</CommandItem>
            <CommandItem>web3-developer</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}