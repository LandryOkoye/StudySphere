"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Upload, FileText, Image, FileIcon, CheckCircle2, Loader2, Globe, HardDrive, Link as LinkIcon } from "lucide-react"
import type { Document } from "@/lib/store"
import { cn } from "@/lib/utils"

interface DocumentUploadProps {
  documents: Document[]
  onUpload: (files: Document[]) => void
}

type TabType = "local" | "drive" | "web"

export function DocumentUpload({ documents, onUpload }: DocumentUploadProps) {
  const [activeTab, setActiveTab] = useState<TabType>("local")
  const [isDragging, setIsDragging] = useState(false)
  const [urlInput, setUrlInput] = useState("")

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
      simulateUpload("local", "New Document.pdf", "pdf")
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  function simulateUpload(source: string, filename: string, type: Document["type"]) {
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: filename,
      type: type,
      status: "uploading",
      progress: 0,
    }
    onUpload([newDoc])

    // Simulate progress (includes 0G processing simulation)
    let progress = 0
    const interval = setInterval(() => {
      progress += 20
      if (progress >= 100) {
        clearInterval(interval)
        onUpload([{ ...newDoc, status: "completed", progress: 100 }])
      } else if (progress >= 80) {
        onUpload([{ ...newDoc, status: "processing", progress }])
      } else {
        onUpload([{ ...newDoc, status: "uploading", progress }])
      }
    }, 400)

    if (source === "web") setUrlInput("")
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
        return <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" />
      case "processing":
        return (
          <div className="flex items-center gap-1.5 min-w-24 justify-end">
            <span className="text-[10px] uppercase font-semibold text-amber-500 tracking-wider">0G Sync</span>
            <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Custom Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
        <button
          onClick={() => setActiveTab("local")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-md text-sm font-medium transition-all",
            activeTab === "local"
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          )}
        >
          <Upload className="h-4 w-4" />
          Local
        </button>
        <button
          onClick={() => setActiveTab("drive")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-md text-sm font-medium transition-all",
            activeTab === "drive"
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          )}
        >
          <HardDrive className="h-4 w-4" />
          Drive
        </button>
        <button
          onClick={() => setActiveTab("web")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-md text-sm font-medium transition-all",
            activeTab === "web"
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          )}
        >
          <Globe className="h-4 w-4" />
          Web Link
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[220px]">
        {activeTab === "local" && (
          <div
            className={cn(
              "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-all h-[220px]",
              isDragging
                ? "border-indigo-500 bg-indigo-500/5"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
              <Upload className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Upload local files</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">
                Drag and drop PDFs, DOCX, Images, or Notes here.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 text-xs h-8 bg-white dark:bg-[#111]"
              onClick={() => simulateUpload("local", "Local_Document.pdf", "pdf")}
            >
              Browse Files
            </Button>
          </div>
        )}

        {activeTab === "drive" && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-8 h-[220px] bg-slate-50/50 dark:bg-slate-900/10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <HardDrive className="h-6 w-6 text-blue-500" />
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Import from Google Drive</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[220px]">
                Connect your account to select and import cloud files directly.
              </p>
            </div>
            <Button
              className="mt-2 text-xs h-8 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 gap-2"
              onClick={() => simulateUpload("drive", "Shared_Notes.docx", "pdf")}
            >
              <HardDrive className="h-3.5 w-3.5" />
              Connect Drive
            </Button>
          </div>
        )}

        {activeTab === "web" && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-8 h-[220px] bg-slate-50/50 dark:bg-slate-900/10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
              <Globe className="h-6 w-6 text-indigo-500" />
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center w-full max-w-sm">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Add Web Links</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                Paste Article or YouTube URLs. AI will extract and process the content via 0G.
              </p>
              <div className="flex w-full gap-2">
                <Input
                  placeholder="https://youtube.com/..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="h-9 text-xs flex-1 bg-white dark:bg-[#111]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && urlInput) simulateUpload("web", "Parsed_Web_Content.pdf", "pdf")
                  }}
                />
                <Button
                  disabled={!urlInput}
                  className="h-9 w-9 p-0 shrink-0"
                  onClick={() => simulateUpload("web", "Parsed_Web_Content.pdf", "pdf")}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Documents List */}
      {documents.length > 0 && (
        <div className="flex flex-col gap-1.5 mt-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="group flex items-center gap-3 rounded-lg border border-slate-100 dark:border-slate-800/60 bg-white dark:bg-[#111] px-4 py-3 shadow-sm hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-50 dark:bg-slate-800/50">
                {getFileIcon(doc.type)}
              </div>
              <div className="flex flex-1 flex-col truncate gap-0.5">
                <span className="truncate text-[13px] font-medium text-slate-900 dark:text-slate-100">
                  {doc.name}
                </span>
                {doc.status === "uploading" && (
                  <div className="flex items-center gap-2">
                    <Progress value={doc.progress} className="h-1 flex-1 max-w-[100px]" />
                    <span className="text-[10px] text-slate-500">{doc.progress}%</span>
                  </div>
                )}
                {doc.status === "processing" && (
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Processing on 0G Compute...</span>
                )}
                {doc.status === "completed" && (
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Synced to 0G Storage</span>
                )}
              </div>
              <div className="flex-shrink-0">
                {getStatusIcon(doc.status)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
