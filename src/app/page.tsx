"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { GitBranchIcon } from "lucide-react"

export default function Page() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <GitBranchIcon className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Welcome to anon-git</h1>
        <p className="text-xl text-muted-foreground mb-8">A decentralized and anonymous code repository platform.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-2">Anonymous Contributions</h2>
            <p className="text-muted-foreground">
              Contribute to projects without revealing your identity. All actions are secured through blockchain
              technology.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-2">Decentralized Storage</h2>
            <p className="text-muted-foreground">
              Your code is stored across a distributed network, ensuring censorship resistance and high availability.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">Explore Repositories</Button>
          <Button size="lg" variant="outline">
            Connect Wallet
          </Button>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
              Toggle {resolvedTheme === "dark" ? "Light" : "Dark"} Mode
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}