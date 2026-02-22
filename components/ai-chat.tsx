"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, Sparkles, ListChecks, Layers } from "lucide-react"
import type { Message } from "@/lib/store"
import { cn } from "@/lib/utils"

interface AIChatProps {
  messages: Message[]
  onSendMessage: (content: string) => void
  onQuickAction: (action: "summarize" | "quiz" | "flashcards") => void
  environmentName: string
}

export function AIChat({
  messages,
  onSendMessage,
  onQuickAction,
  environmentName,
}: AIChatProps) {
  const [inputValue, setInputValue] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  function handleSend() {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim())
      setInputValue("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInputValue(e.target.value)
    // Auto-resize
    const textarea = e.target
    textarea.style.height = "auto"
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
  }

  function renderMessageContent(content: string) {
    // Simple markdown-like rendering for bold, bullets, headings
    const lines = content.split("\n")
    return lines.map((line, i) => {
      // Bold
      const processed = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

      if (line.startsWith("- ")) {
        return (
          <li
            key={i}
            className="ml-4 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: processed.slice(2) }}
          />
        )
      }
      if (line.startsWith("# ")) {
        return (
          <h3 key={i} className="text-sm font-semibold mt-2 mb-1">
            {line.slice(2)}
          </h3>
        )
      }
      if (line === "") {
        return <br key={i} />
      }
      return (
        <p
          key={i}
          className="text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: processed }}
        />
      )
    })
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-sm font-medium text-foreground">{environmentName}</h2>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground">AI ready</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 overflow-y-auto" ref={scrollRef}>
        <div className="flex flex-col gap-6 px-6 py-6">
          {messages.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-sm font-medium text-foreground">
                  Ask anything about your documents
                </p>
                <p className="max-w-xs text-xs text-muted-foreground leading-relaxed">
                  Upload study materials and start asking questions. The AI will analyze your documents and provide intelligent answers.
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-xl px-4 py-3",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                )}
              >
                {message.role === "ai" ? (
                  <div className="flex flex-col gap-1">
                    {renderMessageContent(message.content)}
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{message.content}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="flex gap-2 px-6 pb-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => onQuickAction("summarize")}
        >
          <Sparkles className="h-3 w-3" />
          Summarize documents
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => onQuickAction("quiz")}
        >
          <ListChecks className="h-3 w-3" />
          Generate quiz
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => onQuickAction("flashcards")}
        >
          <Layers className="h-3 w-3" />
          Create flashcards
        </Button>
      </div>

      {/* Input */}
      <div className="border-t px-6 py-4">
        <div className="flex items-end gap-2 rounded-lg border bg-background p-2">
          <Button variant="ghost" size="icon-sm" className="shrink-0">
            <Paperclip className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Attach file</span>
          </Button>
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your documents..."
            className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground leading-relaxed"
          />
          <Button
            size="icon-sm"
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
