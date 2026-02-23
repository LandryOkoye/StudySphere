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
} from "@/components/ui/dialog"

interface DeleteEnvironmentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    environmentName?: string | null
}

export function DeleteEnvironmentDialog({ open, onOpenChange, onConfirm, environmentName }: DeleteEnvironmentDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Environment</DialogTitle>
                    <DialogDescription className="text-slate-600 dark:text-slate-400">
                        Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-slate-100">&quot;{environmentName}&quot;</span>?
                        <br /><br />
                        <span className="text-red-500 font-medium">Warning:</span> All your files, documents, and generated study materials in this environment will be permanently lost.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-lg">
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            onConfirm()
                            onOpenChange(false)
                        }}
                        className="rounded-lg bg-red-600 hover:bg-red-700 text-white"
                    >
                        Yes, delete it
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
