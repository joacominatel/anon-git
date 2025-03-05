"use client"

import { Logo } from "./Logo"
import { Search } from "./Search"
import { NavLinks } from "./NavLinks"
import { ProfileDropdown } from "./ProfileDropdown"
import { SettingsDropdown } from "./SettingsDropdown"
import { ThemeToggle } from "./ThemeToggle"
import { Notifications } from "./Notifications"
import { Web3Status } from "./Web3Status"
import { CreateDropdown } from "./CreateDropdown"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { MenuIcon } from "lucide-react"
export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Left section: Logo and mobile menu */}
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col gap-6 py-4">
                <Logo />
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-medium">Menu</div>
                  <div className="flex flex-col gap-1">
                    <Button variant="ghost" className="justify-start">
                      <CodeIcon className="mr-2 h-4 w-4" />
                      Repositories
                    </Button>
                    <Button variant="ghost" className="justify-start">
                      <StarIcon className="mr-2 h-4 w-4" />
                      Stars
                    </Button>
                    <Button variant="ghost" className="justify-start">
                      <UserIcon className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Logo />
          <NavLinks />
        </div>

        {/* Middle section: Search */}
        <div className="hidden md:flex md:w-1/3 mx-4">
          <Search />
        </div>

        {/* Right section: Actions */}
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <Search />
          </div>
          <Web3Status />
          <CreateDropdown />
          <Notifications />
          <ThemeToggle />
          <SettingsDropdown />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  )
}

// Import these icons for the mobile menu
import { CodeIcon, StarIcon, UserIcon } from "lucide-react"
