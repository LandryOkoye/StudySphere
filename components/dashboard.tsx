"use client"

import type { Environment } from "@/lib/store"
import { CreateEnvironmentDialog } from "@/components/create-environment-dialog"
import { EnvironmentCard } from "@/components/environment-card"
import { FolderOpen } from "lucide-react"

interface DashboardProps {
  environments: Environment[]
  onCreateEnvironment: (name: string) => void
  onOpenEnvironment: (id: string) => void
}

export function Dashboard({
  environments,
  onCreateEnvironment,
  onOpenEnvironment,
}: DashboardProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-semibold text-foreground">Your Environments</h1>
            <p className="text-sm text-muted-foreground">
              {environments.length} learning{" "}
              {environments.length === 1 ? "environment" : "environments"}
            </p>
          </div>
          <CreateEnvironmentDialog onCreateEnvironment={onCreateEnvironment} />
        </div>

        {environments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed bg-muted/30 py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <FolderOpen className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm font-medium text-foreground">No environments yet</p>
              <p className="text-sm text-muted-foreground">
                Create your first learning environment to get started.
              </p>
            </div>
            <CreateEnvironmentDialog onCreateEnvironment={onCreateEnvironment} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {environments.map((env) => (
              <EnvironmentCard
                key={env.id}
                environment={env}
                onClick={() => onOpenEnvironment(env.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
