"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle2, XCircle, ArrowRight } from "lucide-react"
import type { QuizQuestion } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { ethers } from "ethers"
import contractData from "@/lib/contractData.json"

interface QuizViewProps {
  questions: QuizQuestion[]
  environmentName: string
  environmentId: string
  onBack: () => void
  signer: any
}

export function QuizView({ questions, environmentName, environmentId, onBack, signer }: QuizViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [isLoggingScore, setIsLoggingScore] = useState(false)

  const question = questions[currentIndex]

  async function handleLogScore() {
    if (!signer) {
      alert("Please connect your wallet first! You can do this by returning to the auth screen.")
      return
    }

    setIsLoggingScore(true)
    try {
      const contract = new ethers.Contract(
        contractData.address,
        contractData.abi,
        signer
      )

      // The smart contract takes: recordQuizScore(string memory environmentId, uint8 score)
      const tx = await contract.recordQuizScore(environmentId, score)
      await tx.wait()
      alert("Verification Success: Score successfully logged on the 0G Network!")
    } catch (error) {
      console.error("Smart Contract Interaction Error:", error)
      alert("Failed to log score. Make sure you are connected to the Newton (0G) testnet with funds.")
    } finally {
      setIsLoggingScore(false)
    }
  }

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
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-[#FAFAFA] dark:bg-[#0A0A0A]">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No quiz questions available yet.</p>
        <Button variant="outline" size="sm" onClick={onBack} className="bg-white dark:bg-[#111]">
          Go back
        </Button>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 bg-[#FAFAFA] dark:bg-[#0A0A0A]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-2">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">Quiz Complete</h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            You scored {score} out of {questions.length}
          </p>
        </div>
        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={onBack} disabled={isLoggingScore} className="bg-white dark:bg-[#111]">
            Back to Workspace
          </Button>
          <Button onClick={handleRestart} disabled={isLoggingScore} className="bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">
            Try Again
          </Button>
          <Button onClick={handleLogScore} disabled={isLoggingScore} className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 flex items-center gap-2">
            {isLoggingScore && <Loader2 className="h-4 w-4 animate-spin" />}
            Log Score On-Chain
          </Button>
        </div>
      </div>
    )
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
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Quiz • {environmentName}</h2>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-200 dark:bg-slate-800 w-full">
        <div
          className="h-full bg-indigo-500 dark:bg-indigo-400 transition-all duration-300 ease-in-out"
          style={{ width: `${((currentIndex + (hasAnswered ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Area */}
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-8 px-6 py-12">
        <Card className="w-full shadow-sm border-slate-200/60 dark:border-slate-800/60 transition-all rounded-2xl bg-white dark:bg-[#111] overflow-hidden">
          <CardContent className="flex flex-col gap-8 p-8">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
              {question.question}
            </h3>

            <RadioGroup
              value={selectedOption}
              onValueChange={(v) => {
                if (!hasAnswered) setSelectedOption(v)
              }}
              className="gap-3"
            >
              {question.options.map((option, index) => {
                const isCorrect = index === question.correctIndex
                const isSelected = Number(selectedOption) === index

                return (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center gap-4 rounded-xl border px-5 py-4 transition-all cursor-pointer relative",
                      hasAnswered && isCorrect && "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10 dark:border-emerald-500/50",
                      hasAnswered && isSelected && !isCorrect && "border-red-500 bg-red-50/50 dark:bg-red-500/10 dark:border-red-500/50",
                      !hasAnswered && isSelected && "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 dark:border-indigo-500/50 shadow-sm",
                      !hasAnswered && !isSelected && "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                    )}
                    onClick={() => {
                      if (!hasAnswered) setSelectedOption(String(index))
                    }}
                  >
                    <RadioGroupItem
                      value={String(index)}
                      id={`option-${index}`}
                      disabled={hasAnswered}
                      className={cn(
                        "mt-0.5 pointer-events-none",
                        hasAnswered && isCorrect ? "text-emerald-500 border-emerald-500" : "",
                        hasAnswered && isSelected && !isCorrect ? "text-red-500 border-red-500" : ""
                      )}
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className={cn(
                        "flex-1 cursor-pointer text-[14px] leading-relaxed peer-disabled:opacity-100",
                        hasAnswered && isCorrect && "text-emerald-700 dark:text-emerald-400 font-medium",
                        hasAnswered && isSelected && !isCorrect && "text-red-700 dark:text-red-400 font-medium",
                        !hasAnswered && isSelected && "text-indigo-900 dark:text-indigo-100 font-medium",
                        !hasAnswered && !isSelected && "text-slate-700 dark:text-slate-300"
                      )}
                    >
                      {option}
                    </Label>

                    {hasAnswered && (
                      <div className="absolute right-4 text-emerald-500">
                        {isCorrect && <CheckCircle2 className="h-5 w-5" />}
                        {isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-500" />}
                      </div>
                    )}
                  </div>
                )
              })}
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex w-full justify-end">
          {!hasAnswered ? (
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={selectedOption === undefined}
              className="px-8 rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 font-medium"
            >
              Check Answer
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleNext}
              className="px-8 rounded-full gap-2 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 font-medium group"
            >
              {currentIndex + 1 >= questions.length ? "View Results" : "Next Question"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
