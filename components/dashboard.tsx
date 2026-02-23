"use client"

import { useState, useEffect } from "react"
import type { Environment } from "@/lib/store"
import { CreateEnvironmentDialog } from "@/components/create-environment-dialog"
import { DeleteEnvironmentDialog } from "@/components/delete-environment-dialog"
import { EnvironmentCard } from "@/components/environment-card"
import { FolderOpen, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

const GREETINGS = [
  "Nice to have you",
  "Ready to learn?",
  "Let's make some progress",
  "Welcome back to StudySphere",
  "Time to dive in",
]

interface DashboardProps {
  environments: Environment[]
  onCreateEnvironment: (name: string) => void
  onOpenEnvironment: (id: string) => void
  onDeleteEnvironment?: (id: string) => void
}

export function Dashboard({
  environments,
  onCreateEnvironment,
  onOpenEnvironment,
  onDeleteEnvironment,
}: DashboardProps) {
  const [greeting, setGreeting] = useState("Welcome")
  const [envToDelete, setEnvToDelete] = useState<Environment | null>(null)

  useEffect(() => {
    // Pick a random greeting when the component mounts
    const randomGreeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)]
    setGreeting(randomGreeting)
  }, [])

  return (
    <div className="flex flex-1 flex-col bg-[#FAFAFA] dark:bg-[#0A0A0A]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-6 gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {greeting}
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {environments.length} learning{" "}
              {environments.length === 1 ? "environment" : "environments"}
            </p>
          </div>
          <CreateEnvironmentDialog onCreateEnvironment={onCreateEnvironment}>
            <Button
              className="bg-slate-900 text-white hover:bg-slate-800 shadow-sm rounded-lg px-6 h-11 text-[15px] font-semibold transition-all shrink-0"
            >
              <Plus className="mr-2 h-4 w-4" strokeWidth={2.5} />
              Create Environment
            </Button>
          </CreateEnvironmentDialog>
        </div>

        {environments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-5 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/20 py-24 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
              <FolderOpen className="h-6 w-6 text-slate-500 dark:text-slate-400" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <p className="text-base font-semibold text-slate-900 dark:text-slate-100">No environments yet</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[250px] text-center">
                Create your first learning environment to start studying with AI.
              </p>
            </div>
            <div className="mt-2">
              <CreateEnvironmentDialog onCreateEnvironment={onCreateEnvironment} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {environments.map((env) => (
              <EnvironmentCard
                key={env.id}
                environment={env}
                onClick={() => onOpenEnvironment(env.id)}
                onDelete={() => setEnvToDelete(env)}
              />
            ))}
          </div>
        )}
      </div>

      <DeleteEnvironmentDialog
        open={envToDelete !== null}
        onOpenChange={(open) => !open && setEnvToDelete(null)}
        onConfirm={() => {
          if (envToDelete && onDeleteEnvironment) {
            onDeleteEnvironment(envToDelete.id)
          }
        }}
        environmentName={envToDelete?.name}
      />
    </div>
  )
}
