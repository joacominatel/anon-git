"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { createRepository } from "@/services/repositoryService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { PlusIcon, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

export function CreateRepositoryButton() {
  const router = useRouter()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_private: false,
    accepts_donations: false,
    for_sale: false,
    price: 0,
    default_branch: "main",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.id) {
      toast.error("You must be logged in to create a repository")
      return
    }

    setIsLoading(true)

    try {
      const newRepository = {
        ...formData,
        owner_id: user.id
    }

      const result = await createRepository(newRepository)
      if (!result) {
        throw new Error("Failed to create repository")
      }
      toast.success("Repository created successfully")
      setOpen(false)
    } catch (error) {
      console.error("Error creating repository:", error)
      toast.error("Failed to create repository. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Repository
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create a new repository</DialogTitle>
          <DialogDescription>Fill in the details below to create your new repository.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Repository Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="default_branch">Default Branch</Label>
              <Input
                id="default_branch"
                name="default_branch"
                value={formData.default_branch}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is_private" className="cursor-pointer">
                Private Repository
              </Label>
              <Switch
                id="is_private"
                checked={formData.is_private}
                onCheckedChange={(checked) => handleSwitchChange("is_private", checked)}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="accepts_donations" className="cursor-pointer">
                Accept Donations
              </Label>
              <Switch
                id="accepts_donations"
                checked={formData.accepts_donations}
                onCheckedChange={(checked) => handleSwitchChange("accepts_donations", checked)}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="for_sale" className="cursor-pointer">
                For Sale
              </Label>
              <Switch
                id="for_sale"
                checked={formData.for_sale}
                onCheckedChange={(checked) => handleSwitchChange("for_sale", checked)}
                disabled={isLoading}
              />
            </div>
            {formData.for_sale && (
              <div className="grid gap-2">
                <Label htmlFor="price">Price (ETH)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.001"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Repository"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

