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
      <aside className="flex w-64 shrink-0 flex-col border-r bg-sidebar">
        {/* Sidebar header */}
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <Button variant="ghost" size="icon-sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to dashboard</span>
          </Button>
          <span className="truncate text-sm font-medium text-sidebar-foreground">
            {environment.name}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-3">
          {sidebarTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                activeTab === tab.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Document list in sidebar */}
        <div className="flex flex-col gap-1 border-t px-3 py-3">
          <p className="px-3 pb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Documents
          </p>
          <ScrollArea className="max-h-60">
            {environment.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-2 rounded-md px-3 py-1.5"
              >
                {getFileIcon(doc.type)}
                <span className="flex-1 truncate text-xs text-sidebar-foreground">
                  {doc.name}
                </span>
                {doc.status === "completed" && (
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                )}
              </div>
            ))}
          </ScrollArea>
          <Button
            variant="ghost"
            size="sm"
            className="mt-1 w-full justify-start gap-2 text-xs text-muted-foreground"
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
