"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ModalCreateRepositoryProps {
    handleSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSwitchChange: (name: string, checked: boolean) => void;
    formData: {
        name: string;
        description: string;
        is_private: boolean;
        accepts_donations: boolean;
        for_sale: boolean;
        price: number;
        default_branch: string;
    };
    setOpen: (open: boolean) => void;
}

export function ModalCreateRepository({handleSubmit, isLoading, handleChange, handleSwitchChange, formData, setOpen}: ModalCreateRepositoryProps) {
    return (
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
    )
}