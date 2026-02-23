"use client"

import { useState } from "react"
import type { Environment, Document, Message } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AIChat } from "@/components/ai-chat"
import { DocumentUpload } from "@/components/document-upload"
import {
  ArrowLeft,
  MessageSquare,
  FileText,
  Layers,
  Upload,
  ChevronRight,
  Image as ImageIcon,
  File,
  CheckCircle2,
  Share2,
} from "lucide-react"
import { cn } from "@/lib/utils"

type SidebarTab = "chat" | "documents" | "tools"

interface WorkspaceProps {
  environment: Environment
  onBack: () => void
  onUpdateEnvironment: (env: Environment) => void
  onOpenQuiz: () => void
  onOpenFlashcards: () => void
}

export function Workspace({
  environment,
  onBack,
  onUpdateEnvironment,
  onOpenQuiz,
  onOpenFlashcards,
}: WorkspaceProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>("chat")

  function handleSendMessage(content: string) {
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
    }

    // Simulate AI response
    const aiResponse: Message = {
      id: `msg-${Date.now() + 1}`,
      role: "ai",
      content: generateAIResponse(content),
    }

    onUpdateEnvironment({
      ...environment,
      messages: [...environment.messages, userMessage, aiResponse],
      lastActivity: "Just now",
    })
  }

  function handleUpload(newDocs: Document[]) {
    const updatedDocs = environment.documents.map((doc) => {
      const updated = newDocs.find((d) => d.id === doc.id)
      return updated || doc
    })
    const brandNew = newDocs.filter(
      (d) => !environment.documents.find((ed) => ed.id === d.id)
    )
    onUpdateEnvironment({
      ...environment,
      documents: [...updatedDocs, ...brandNew],
      lastActivity: "Just now",
    })
  }

  function handleQuickAction(action: "summarize" | "quiz" | "flashcards") {
    if (action === "quiz") {
      onOpenQuiz()
      return
    }
    if (action === "flashcards") {
      onOpenFlashcards()
      return
    }
    handleSendMessage("Summarize all my documents")
  }

  function getFileIcon(type: Document["type"]) {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />
      case "image":
        return <ImageIcon className="h-4 w-4 text-blue-500" />
      default:
        return <File className="h-4 w-4 text-muted-foreground" />
    }
  }

  const sidebarTabs = [
    { id: "documents" as const, label: "Documents", icon: FileText },
    { id: "chat" as const, label: "AI Chat", icon: MessageSquare },
    { id: "tools" as const, label: "Study Tools", icon: Layers },
  ]

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 dark:border-slate-800 bg-[#F9F9F9] dark:bg-[#111]">
        {/* Sidebar header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-3 h-[60px]">
          <div className="flex items-center gap-2 overflow-hidden">
            <Button variant="ghost" size="icon-sm" onClick={onBack} className="h-7 w-7 rounded-md shrink-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to dashboard</span>
            </Button>
            <span className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              {environment.name}
            </span>
          </div>
          <Button variant="ghost" size="icon-sm" className="h-7 w-7 rounded-md shrink-0 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <Layers className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-0.5 p-3">
          {sidebarTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-slate-200/60 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/40 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-100"
              )}
            >
              <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-indigo-600 dark:text-indigo-400" : "opacity-70")} />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Document list in sidebar */}
        <div className="flex flex-col gap-1 px-3 py-4 mt-auto border-t border-slate-200 dark:border-slate-800/60">
          <div className="flex items-center justify-between px-3 pb-2">
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Documents
            </p>
            <span className="text-[11px] font-medium bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded-sm">
              {environment.documents.length}
            </span>
          </div>
          <ScrollArea className="max-h-48 pr-2">
            <div className="flex flex-col gap-0.5">
              {environment.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between group rounded-md px-3 py-2 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-2 overflow-hidden flex-1 cursor-pointer" onClick={() => setActiveTab("documents")}>
                    {getFileIcon(doc.type)}
                    <span className="truncate text-[13px] text-slate-700 dark:text-slate-300 font-medium w-[120px]">
                      {doc.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-1">
                    {doc.status === "completed" && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500/80 shrink-0 mr-1" />
                    )}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="h-6 w-6 rounded-md opacity-0 group-hover:opacity-100 hover:text-indigo-600 dark:hover:text-indigo-400 focus:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Sharing link for '${doc.name}' generated and copied to clipboard! Peers can now access this on the 0G network.`)
                      }}
                      title="Share with Peers"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full justify-start gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-md"
            onClick={() => setActiveTab("documents")}
          >
            <Upload className="h-3.5 w-3.5" />
            Upload Document
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {activeTab === "chat" && (
          <AIChat
            messages={environment.messages}
            onSendMessage={handleSendMessage}
            onQuickAction={handleQuickAction}
            environmentName={environment.name}
          />
        )}

        {activeTab === "documents" && (
          <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-medium text-foreground">Documents</h2>
              <p className="text-xs text-muted-foreground">
                Upload and manage your study materials
              </p>
            </div>
            <DocumentUpload
              documents={environment.documents}
              onUpload={handleUpload}
            />
          </div>
        )}

        {activeTab === "tools" && (
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-medium text-foreground">Study Tools</h2>
              <p className="text-xs text-muted-foreground">
                AI-powered tools to enhance your learning
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={onOpenQuiz}
                className="flex items-center justify-between rounded-lg border p-4 text-left transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Layers className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium text-foreground">Quiz</p>
                    <p className="text-xs text-muted-foreground">
                      Test your knowledge with generated questions
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
              <button
                onClick={onOpenFlashcards}
                className="flex items-center justify-between rounded-lg border p-4 text-left transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Layers className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium text-foreground">Flashcards</p>
                    <p className="text-xs text-muted-foreground">
                      Review concepts with flip cards
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function generateAIResponse(question: string): string {
  const q = question.toLowerCase()
  if (q.includes("summarize")) {
    return "**Document Summary**\n\nBased on your uploaded documents, here are the key points:\n\n- **Core Concepts** - The materials cover fundamental principles and their applications\n- **Key Definitions** - Important terminology has been identified across your documents\n- **Relationships** - Several interconnected themes emerge from your study materials\n\nWould you like me to dive deeper into any of these areas?"
  }
  if (q.includes("quiz") || q.includes("test")) {
    return "I can generate a quiz from your documents. Use the **Generate Quiz** button or navigate to **Study Tools** to start a practice quiz.\n\nThe quiz will cover:\n- Key concepts from your materials\n- Important definitions\n- Application-based questions"
  }
  if (q.includes("flashcard")) {
    return "I can create flashcards from your documents. Navigate to **Study Tools** and select **Flashcards** to start reviewing.\n\nFlashcards will include:\n- Term and definition pairs\n- Key concept summaries\n- Important facts to remember"
  }
  return `**Analysis of Your Question**\n\nBased on your documents, here is what I found:\n\nYour question touches on several key concepts covered in your materials. The documents provide comprehensive coverage of this topic, with specific details in multiple sections.\n\n- **Key Finding** - The primary source material directly addresses this\n- **Supporting Evidence** - Additional context from related documents\n- **Application** - How this concept connects to broader themes\n\nWould you like me to elaborate on any specific aspect?`
}
