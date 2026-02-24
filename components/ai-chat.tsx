"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, Sparkles, ListChecks, Layers, Globe, FileText, CheckCircle2 } from "lucide-react"
import type { Message } from "@/lib/store"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"

interface AIChatProps {
  messages: Message[]
  onSendMessage: (content: string) => void
  onQuickAction: (action: "summarize" | "quiz" | "flashcards") => void
  environmentName: string
  isLoading?: boolean
}

export function AIChat({
  messages,
  onSendMessage,
  onQuickAction,
  environmentName,
  isLoading,
}: AIChatProps) {
  const [inputValue, setInputValue] = useState("")
  const [webSearchEnabled, setWebSearchEnabled] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages])

  function handleSend() {
    if (inputValue.trim()) {
      // If web search is enabled, we could prefix or add metadata, but here we just send the text
      const content = webSearchEnabled ? `[Web Search] ${inputValue.trim()}` : inputValue.trim()
      onSendMessage(content)
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
            className="ml-4 text-[13px] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: processed.slice(2) }}
          />
        )
      }
      if (line.startsWith("# ")) {
        return (
          <h3 key={i} className="text-[13px] font-semibold mt-2 mb-1 text-slate-900 dark:text-slate-100">
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
          className="text-[13px] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: processed }}
        />
      )
    })
  }

  return (
    <div className="flex flex-1 flex-col bg-white dark:bg-[#0A0A0A] relative min-h-0">
      {/* Header (Optional, could be removed as we have sidebar, but kept for context) */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4 bg-white/50 dark:bg-[#0A0A0A]/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{environmentName}</h2>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">0G Compute Online</span>
          </div>
        </div>
      </div>

      {/* Messages / Welcome Area */}
      <div className="flex-1 overflow-y-auto scroll-smooth">
        <div className="flex flex-col max-w-4xl mx-auto w-full px-6 py-8 pb-32">
          {messages.length === 0 && (
            <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col gap-2 mb-10">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  Welcome back to {environmentName}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Your AI learning workspace is ready. Let's make some progress today.
                </p>
              </div>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                <div className="flex flex-col gap-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#FAFAFA] dark:bg-[#111]">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <FileText className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Documents</span>
                  </div>
                  <span className="text-xl font-semibold text-slate-900 dark:text-slate-100">12 Processed</span>
                </div>
                <div className="flex flex-col gap-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#FAFAFA] dark:bg-[#111]">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Quizzes</span>
                  </div>
                  <span className="text-xl font-semibold text-slate-900 dark:text-slate-100">4 Mastered</span>
                </div>
                <div className="flex flex-col gap-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#FAFAFA] dark:bg-[#111]">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Globe className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Web Context</span>
                  </div>
                  <span className="text-xl font-semibold text-slate-900 dark:text-slate-100">8 Web Clips</span>
                </div>
              </div>

              {/* Suggested Actions */}
              <div className="flex flex-col gap-4">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Suggested Actions
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onQuickAction("summarize")}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111] text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    Summarize recent notes
                  </button>
                  <button
                    onClick={() => onQuickAction("quiz")}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111] text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <ListChecks className="h-4 w-4 text-emerald-500" />
                    Start a quick quiz
                  </button>
                  <button
                    onClick={() => onSendMessage("Search the web for recent advancements in this topic")}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111] text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <Globe className="h-4 w-4 text-blue-500" />
                    Search web for updates
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex group",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "ai" && (
                  <div className="flex-shrink-0 mr-4 mt-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/10 border border-indigo-600/20 text-indigo-600">
                      <Sparkles className="h-4 w-4" />
                    </div>
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm",
                    message.role === "user"
                      ? "bg-slate-900 text-slate-50 dark:bg-slate-100 dark:text-slate-900 rounded-tr-sm"
                      : "bg-white text-slate-900 dark:bg-[#111] dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-tl-sm"
                  )}
                >
                  {message.role === "user" && message.content.startsWith("[Web Search]") && (
                    <div className="flex items-center gap-1.5 mb-2 text-xs font-medium opacity-70">
                      <Globe className="h-3 w-3" />
                      <span>Web Search</span>
                    </div>
                  )}
                  {message.role === "ai" ? (
                    <div className="flex flex-col gap-2">
                      {renderMessageContent(message.content)}
                    </div>
                  ) : (
                    <p className="text-[13px] leading-relaxed">
                      {message.content.replace("[Web Search] ", "")}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex-shrink-0 mr-4 mt-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/10 border border-indigo-600/20 text-indigo-600">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                  </div>
                </div>
                <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm bg-white text-slate-900 dark:bg-[#111] dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-tl-sm">
                  <span className="text-[13px] leading-relaxed flex gap-1">
                    <span className="animate-bounce delay-75">.</span>
                    <span className="animate-bounce delay-150">.</span>
                    <span className="animate-bounce delay-300">.</span>
                  </span>
                </div>
              </div>
            )}

            {/* Invisible div to scroll to */}
            <div ref={messagesEndRef} className="h-4 w-full shrink-0" />
          </div>
        </div>
      </div>

      {/* Input Area (Centered heavily at bottom) */}
      <div className="absolute bottom-6 left-0 right-0 px-6 flex justify-center pointer-events-none">
        <div className="w-full max-w-3xl flex flex-col gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111] shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-3 pointer-events-auto transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={isLoading ? "AI is thinking..." : "Ask anything, or type '/' to search the web…"}
            className="flex-1 resize-none bg-transparent text-[14px] outline-none placeholder:text-slate-400 leading-relaxed px-2 py-1 max-h-[150px] overflow-y-auto text-slate-900 dark:text-slate-100 disabled:opacity-50"
          />

          <div className="flex items-center justify-between pt-2 px-1">
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded-md">
                    <Paperclip className="h-3.5 w-3.5" />
                    Attach
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 bg-white dark:bg-[#111] border-slate-200 dark:border-slate-800 rounded-xl shadow-lg">
                  <DropdownMenuItem className="text-xs gap-2 py-2 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800/50 rounded-md m-1">
                    <FileText className="h-3.5 w-3.5 text-slate-500" />
                    Local File
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs gap-2 py-2 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800/50 rounded-md m-1">
                    <Layers className="h-3.5 w-3.5 text-blue-500" />
                    Google Drive
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs gap-2 py-2 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800/50 rounded-md m-1">
                    <Globe className="h-3.5 w-3.5 text-emerald-500" />
                    Web URL
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <Switch
                  id="web-search"
                  checked={webSearchEnabled}
                  onCheckedChange={setWebSearchEnabled}
                  className="data-[state=checked]:bg-indigo-500 h-4 w-7 [&_span]:h-3 [&_span]:w-3 [&_span]:data-[state=checked]:translate-x-3"
                />
                <label
                  htmlFor="web-search"
                  className={cn(
                    "text-xs font-medium cursor-pointer transition-colors",
                    webSearchEnabled
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-slate-500 dark:text-slate-400"
                  )}
                >
                  Web Search
                </label>
              </div>
            </div>

            <Button
              size="icon-sm"
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className={cn(
                "shrink-0 h-8 w-8 rounded-lg transition-all",
                inputValue.trim() && !isLoading
                  ? "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                  : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600"
              )}
            >
              <Send className="h-3.5 w-3.5" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
