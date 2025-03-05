"use client"

import type React from "react"

import { useState } from "react"
import type { Repository } from "@/lib/types/repositoryTypes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface RepositorySettingsProps {
  repository: Repository
  onUpdate: (data: Partial<Repository>) => Promise<void>
}

export function RepositorySettings({ repository, onUpdate }: RepositorySettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: repository.name,
    description: repository.description || "",
    is_private: repository.is_private,
    accepts_donations: repository.accepts_donations,
    for_sale: repository.for_sale,
    price: repository.price || 0,
    default_branch: repository.default_branch,
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
    setIsLoading(true)

    try {
      await onUpdate(formData)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Repository Settings</CardTitle>
          <CardDescription>Update your repository information and settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>These actions are destructive and cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border border-destructive/20 rounded-md p-4">
            <h3 className="font-medium text-destructive">Transfer Repository</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Transfer this repository to another user or organization.
            </p>
            <Button variant="outline" className="text-destructive" disabled>
              Transfer Repository
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}