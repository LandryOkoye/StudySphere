"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, Image, FileIcon, CheckCircle2, Loader2, X } from "lucide-react"
import type { Document } from "@/lib/store"
import { cn } from "@/lib/utils"

interface DocumentUploadProps {
  documents: Document[]
  onUpload: (files: Document[]) => void
}

export function DocumentUpload({ documents, onUpload }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      simulateUpload()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  function simulateUpload() {
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: "New Document.pdf",
      type: "pdf",
      status: "uploading",
      progress: 0,
    }
    onUpload([newDoc])

    // Simulate progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 20
      if (progress >= 100) {
        clearInterval(interval)
        onUpload([{ ...newDoc, status: "completed", progress: 100 }])
      } else {
        onUpload([{ ...newDoc, status: "uploading", progress }])
      }
    }, 300)
  }

  function getFileIcon(type: Document["type"]) {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />
      case "image":
        return <Image className="h-4 w-4 text-blue-500" />
      default:
        return <FileIcon className="h-4 w-4 text-muted-foreground" />
    }
  }

  function getStatusIcon(status: Document["status"]) {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
      case "uploading":
        return <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
      case "processing":
        return <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/40 hover:bg-muted/30"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          <Upload className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-medium text-foreground">Upload documents</p>
          <p className="text-xs text-muted-foreground">
            Upload PDFs, images, or notes
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={simulateUpload}
        >
          Browse Files
        </Button>
      </div>

      {documents.length > 0 && (
        <div className="flex flex-col gap-1">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted/50"
            >
              {getFileIcon(doc.type)}
              <span className="flex-1 truncate text-sm text-foreground">
                {doc.name}
              </span>
              {doc.status === "uploading" ? (
                <div className="w-16">
                  <Progress value={doc.progress} className="h-1.5" />
                </div>
              ) : (
                getStatusIcon(doc.status)
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
