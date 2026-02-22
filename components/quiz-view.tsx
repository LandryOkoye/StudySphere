"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle2, XCircle, ArrowRight } from "lucide-react"
import type { QuizQuestion } from "@/lib/store"
import { cn } from "@/lib/utils"

interface QuizViewProps {
  questions: QuizQuestion[]
  environmentName: string
  onBack: () => void
}

export function QuizView({ questions, environmentName, onBack }: QuizViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  const question = questions[currentIndex]

  function handleSubmit() {
    if (selectedOption === undefined) return
    setHasAnswered(true)
    if (Number(selectedOption) === question.correctIndex) {
      setScore((s) => s + 1)
    }
  }

  function handleNext() {
    if (currentIndex + 1 >= questions.length) {
      setCompleted(true)
      return
    }
    setCurrentIndex((i) => i + 1)
    setSelectedOption(undefined)
    setHasAnswered(false)
  }

  function handleRestart() {
    setCurrentIndex(0)
    setSelectedOption(undefined)
    setHasAnswered(false)
    setScore(0)
    setCompleted(false)
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <p className="text-sm text-muted-foreground">No quiz questions available yet.</p>
        <Button variant="outline" size="sm" onClick={onBack}>
          Go back
        </Button>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Quiz Complete</h2>
          <p className="text-sm text-muted-foreground">
            You scored {score} out of {questions.length}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            Back to workspace
          </Button>
          <Button onClick={handleRestart}>Try Again</Button>
        </div>
      </div>
    )
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
          <h2 className="text-sm font-medium text-foreground">Quiz - {environmentName}</h2>
          <p className="text-xs text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentIndex + (hasAnswered ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-6 px-6 py-8">
        <Card className="w-full">
          <CardContent className="flex flex-col gap-6 pt-6">
            <p className="text-sm font-medium text-foreground leading-relaxed">
              {question.question}
            </p>

            <RadioGroup
              value={selectedOption}
              onValueChange={(v) => {
                if (!hasAnswered) setSelectedOption(v)
              }}
            >
              {question.options.map((option, index) => {
                const isCorrect = index === question.correctIndex
                const isSelected = Number(selectedOption) === index

                return (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors",
                      hasAnswered && isCorrect && "border-emerald-500 bg-emerald-50",
                      hasAnswered && isSelected && !isCorrect && "border-red-500 bg-red-50",
                      !hasAnswered && isSelected && "border-primary bg-primary/5",
                      !hasAnswered && !isSelected && "hover:bg-muted/50"
                    )}
                  >
                    <RadioGroupItem
                      value={String(index)}
                      id={`option-${index}`}
                      disabled={hasAnswered}
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className={cn(
                        "flex-1 cursor-pointer text-sm",
                        hasAnswered && isCorrect && "text-emerald-700 font-medium",
                        hasAnswered && isSelected && !isCorrect && "text-red-700"
                      )}
                    >
                      {option}
                    </Label>
                    {hasAnswered && isCorrect && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    )}
                    {hasAnswered && isSelected && !isCorrect && (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                )
              })}
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          {!hasAnswered ? (
            <Button onClick={handleSubmit} disabled={selectedOption === undefined}>
              Check Answer
            </Button>
          ) : (
            <Button onClick={handleNext} className="gap-2">
              {currentIndex + 1 >= questions.length ? "View Results" : "Next Question"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
