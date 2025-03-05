"use client"

import { CodeIcon } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from "next/link"

export function NavLinks() {
  return (
    <NavigationMenu className="hidden md:flex items-center">
      <NavigationMenuList className="flex items-center gap-1">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="">Explore</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <CodeIcon className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Decentralized Repositories
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Explore fully anonymous and decentralized code repositories
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/trending"
                  >
                    <div className="text-sm font-medium leading-none">Trending</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Discover popular repositories and developers
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/topics"
                  >
                    <div className="text-sm font-medium leading-none">Topics</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Browse repositories by topic
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/repositories" legacyBehavior passHref>
            <NavigationMenuLink className={`${navigationMenuTriggerStyle()} h-10`}>
              Repositories
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/stars" legacyBehavior passHref>
            <NavigationMenuLink className={`${navigationMenuTriggerStyle()} h-10`}>
              Stars
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}