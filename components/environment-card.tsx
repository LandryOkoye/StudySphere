"use client"

import type { Environment } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, ChevronRight, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EnvironmentCardProps {
  environment: Environment
  onClick: () => void
  onDelete?: (id: string) => void
}

export function EnvironmentCard({ environment, onClick, onDelete }: EnvironmentCardProps) {
  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-200 border-slate-200/60 dark:border-slate-800/60",
        "bg-white dark:bg-[#111] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-slate-300 dark:hover:border-slate-700",
        "rounded-xl overflow-hidden hover:-translate-y-0.5"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3 pt-5 px-5">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100 line-clamp-1 pr-2">
            {environment.name}
          </CardTitle>
          <div className="flex items-center gap-1">
            {onDelete && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-6 w-6 text-slate-400 opacity-0 transition-opacity hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(environment.id)
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="sr-only">Delete environment</span>
              </Button>
            )}
            <ChevronRight className="h-4 w-4 text-slate-400 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-5 pb-5">
        <div className="flex items-center gap-2 text-[13px] font-medium text-slate-500 dark:text-slate-400">
          <FileText className="h-4 w-4 text-indigo-500/80" strokeWidth={2} />
          <span>
            {environment.documents.length}{" "}
            {environment.documents.length === 1 ? "document" : "documents"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[13px] font-medium text-slate-500 dark:text-slate-400">
          <Clock className="h-4 w-4 text-slate-400" strokeWidth={2} />
          <span>{environment.lastActivity}</span>
        </div>
      </CardContent>
    </Card>
  )
}
