"use client"

import type { Environment } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnvironmentCardProps {
  environment: Environment
  onClick: () => void
}

export function EnvironmentCard({ environment, onClick }: EnvironmentCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:border-primary/30 hover:shadow-md"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{environment.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <FileText className="h-3.5 w-3.5" />
          <span>
            {environment.documents.length}{" "}
            {environment.documents.length === 1 ? "document" : "documents"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{environment.lastActivity}</span>
        </div>
      </CardContent>
    </Card>
  )
}
