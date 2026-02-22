"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

interface CreateEnvironmentDialogProps {
  onCreateEnvironment: (name: string) => void
}

export function CreateEnvironmentDialog({ onCreateEnvironment }: CreateEnvironmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")

  function handleCreate() {
    if (name.trim()) {
      onCreateEnvironment(name.trim())
      setName("")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Create Environment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Environment</DialogTitle>
          <DialogDescription>
            Give your learning environment a name to get started.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="env-name">Environment name</Label>
          <Input
            id="env-name"
            placeholder="e.g., Biology 101"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate()
            }}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
