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
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <p className="text-sm text-muted-foreground">No flashcards available yet.</p>
        <Button variant="outline" size="sm" onClick={onBack}>
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
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-6 py-3">
        <Button variant="ghost" size="icon-sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div className="flex flex-col gap-0.5">
          <h2 className="text-sm font-medium text-foreground">Flashcards - {environmentName}</h2>
          <p className="text-xs text-muted-foreground">
            Card {currentIndex + 1} of {flashcards.length}
          </p>
        </div>
      </div>

      {/* Flashcard */}
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-6 px-6 py-8">
        <div className="w-full" style={{ perspective: "1000px" }}>
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="relative h-64 w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
            aria-label={isFlipped ? "Show question" : "Show answer"}
            style={{
              transformStyle: "preserve-3d",
              transition: "transform 0.5s",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front */}
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl border bg-card p-8 text-center shadow-sm",
              )}
              style={{ backfaceVisibility: "hidden" }}
            >
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Question</p>
              <p className="text-sm font-medium text-card-foreground leading-relaxed">{card.front}</p>
              <p className="mt-2 text-xs text-muted-foreground">Click to flip</p>
            </div>

            {/* Back */}
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl border bg-primary/5 p-8 text-center shadow-sm",
              )}
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <p className="text-xs font-medium text-primary uppercase tracking-wider">Answer</p>
              <p className="text-sm text-foreground leading-relaxed">{card.back}</p>
              <p className="mt-2 text-xs text-muted-foreground">Click to flip</p>
            </div>
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handlePrev}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Previous card</span>
          </Button>
          <span className="text-sm text-muted-foreground tabular-nums">
            {currentIndex + 1} / {flashcards.length}
          </span>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">Next card</span>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-xs text-muted-foreground"
          onClick={() => {
            setCurrentIndex(0)
            setIsFlipped(false)
          }}
        >
          <RotateCcw className="h-3 w-3" />
          Restart
        </Button>
      </div>
    </div>
  )
}
