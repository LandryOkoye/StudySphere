"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Mail, BookOpen } from "lucide-react"

interface AuthScreenProps {
  onConnect: () => void
}

export function AuthScreen({ onConnect }: AuthScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-foreground">
              StudySphere
            </span>
          </div>
          <p className="text-center text-sm text-muted-foreground leading-relaxed">
            Own your learning. Study with AI.
          </p>
        </div>

        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-base">Get Started</CardTitle>
            <CardDescription>
              Connect your wallet to access your learning environments.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button
              size="lg"
              className="w-full gap-2"
              onClick={onConnect}
            >
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <Button
              variant="outline"
              size="lg"
              className="w-full gap-2"
              onClick={onConnect}
            >
              <Mail className="h-4 w-4" />
              Continue with Email
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground leading-relaxed max-w-xs">
          By connecting, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
