"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Wallet, Mail } from "lucide-react"
import { Logo } from "@/components/logo"

interface AuthScreenProps {
  onConnect: () => void
}

export function AuthScreen({ onConnect }: AuthScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0A] px-4 selection:bg-indigo-500/30">
      <div className="flex w-full max-w-[420px] flex-col items-center gap-10">
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center gap-5 text-center">
          <Logo className="h-24 w-auto mb-2" variant="transparent" />
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Welcome back
            </h1>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
              Own your learning. Study with AI.
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="w-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border-slate-200/60 dark:border-slate-800/60 transition-all rounded-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-lg font-semibold tracking-tight">Get Started</CardTitle>
            <CardDescription className="text-sm">
              Choose a wallet to access your workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3.5 px-6">
            <Button
              size="lg"
              className="w-full justify-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all rounded-lg font-medium"
              onClick={onConnect}
            >
              MetaMask
            </Button>

            <Button
              size="lg"
              className="w-full justify-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 shadow-sm transition-all rounded-lg font-medium"
              onClick={onConnect}
            >
              OKX Wallet
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-[#111] px-2 text-slate-400 font-medium tracking-wider">
                  Or
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="lg"
              className="w-full gap-2.5 bg-transparent border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/50 shadow-sm transition-all rounded-lg font-medium"
              onClick={onConnect}
            >
              <Mail className="h-4 w-4" />
              Continue with Email
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center flex-col px-6 pb-6 pt-2 gap-4">
            <p className="text-center text-[13px] text-slate-500 leading-relaxed">
              By continuing, you agree to our{" "}
              <a href="#" className="underline underline-offset-4 hover:text-slate-900 dark:hover:text-slate-300 transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline underline-offset-4 hover:text-slate-900 dark:hover:text-slate-300 transition-colors">
                Privacy Policy
              </a>.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
