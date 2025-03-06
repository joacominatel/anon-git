"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { createRepository } from "@/services/repositoryService"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { ModalCreateRepository } from "./ModalCreateRepository"
export function CreateRepositoryButton() {
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
      <ModalCreateRepository handleSubmit={handleSubmit} isLoading={isLoading} handleChange={handleChange} handleSwitchChange={handleSwitchChange} formData={formData} setOpen={setOpen} />
    </Dialog>
  )
}

