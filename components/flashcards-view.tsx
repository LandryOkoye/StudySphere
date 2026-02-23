"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react"
import type { Flashcard } from "@/lib/store"
import { cn } from "@/lib/utils"

interface FlashcardsViewProps {
  flashcards: Flashcard[]
  environmentName: string
  onBack: () => void
}

export function FlashcardsView({ flashcards, environmentName, onBack }: FlashcardsViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  if (flashcards.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-[#FAFAFA] dark:bg-[#0A0A0A]">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No flashcards available yet.</p>
        <Button variant="outline" size="sm" onClick={onBack} className="bg-white dark:bg-[#111]">
          Go back
        </Button>
      </div>
    )
  }

  const card = flashcards[currentIndex]

  function handlePrev() {
    setCurrentIndex((i) => (i > 0 ? i - 1 : flashcards.length - 1))
    setIsFlipped(false)
  }

  function handleNext() {
    setCurrentIndex((i) => (i < flashcards.length - 1 ? i + 1 : 0))
    setIsFlipped(false)
  }

  return (
    <div className="flex flex-1 flex-col bg-[#FAFAFA] dark:bg-[#0A0A0A]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#0A0A0A]/50 px-6 py-4">
        <Button variant="ghost" size="icon-sm" onClick={onBack} className="h-8 w-8 rounded-md shrink-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div className="flex flex-col gap-0.5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Flashcards • {environmentName}</h2>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Card {currentIndex + 1} of {flashcards.length}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-200 dark:bg-slate-800 w-full">
        <div
          className="h-full bg-indigo-500 dark:bg-indigo-400 transition-all duration-300 ease-in-out"
          style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
        />
      </div>

      {/* Flashcard Area */}
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-10 px-6 py-12">
        <div className="w-full relative" style={{ perspective: "1500px" }}>
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="relative h-80 w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-4 focus-visible:ring-offset-[#FAFAFA] dark:focus-visible:ring-offset-[#0A0A0A] rounded-3xl"
            aria-label={isFlipped ? "Show question" : "Show answer"}
            style={{
              transformStyle: "preserve-3d",
              transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front */}
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center gap-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-[#111] p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-colors hover:border-slate-300 dark:hover:border-slate-700",
              )}
              style={{ backfaceVisibility: "hidden" }}
            >
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Question</p>
              <h3 className="text-2xl font-medium text-slate-900 dark:text-slate-100 leading-relaxed max-w-lg">{card.front}</h3>
              <p className="mt-auto text-[13px] font-medium text-slate-400 dark:text-slate-500 animate-pulse">Click to flip</p>
            </div>

            {/* Back */}
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center gap-6 rounded-3xl border border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-500/10 p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]",
              )}
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">Answer</p>
              <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed max-w-lg font-medium">{card.back}</p>
              <p className="mt-auto text-[13px] font-medium text-indigo-400 dark:text-indigo-500/50">Click to flip back</p>
            </div>
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6 w-full max-w-sm">
          <div className="flex items-center justify-between w-full bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-full p-1.5 shadow-sm">
            <Button
              variant="ghost"
              className="rounded-full h-10 w-10 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 shrink-0"
              onClick={handlePrev}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Previous card</span>
            </Button>
            <span className="text-[14px] font-semibold text-slate-700 dark:text-slate-300 tracking-wide tabular-nums px-4">
              {currentIndex + 1} <span className="text-slate-400 font-medium">/</span> {flashcards.length}
            </span>
            <Button
              variant="ghost"
              className="rounded-full h-10 w-10 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 shrink-0"
              onClick={handleNext}
            >
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">Next card</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-[13px] font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-full h-8 px-4 transition-colors"
            onClick={() => {
              setCurrentIndex(0)
              setIsFlipped(false)
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restart Deck
          </Button>
        </div>
      </div>
    </div>
  )
}
