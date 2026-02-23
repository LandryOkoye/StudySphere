"use client"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { ArrowRight, BookOpen, BrainCircuit, Globe, Zap } from "lucide-react"

interface LandingPageProps {
    onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
    return (
        <div className="flex min-h-screen flex-col bg-[#FAFAFA] dark:bg-[#0A0A0A] selection:bg-indigo-500/30">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-50">
                <Logo className="h-10 w-auto" variant="transparent" />
                <div className="flex items-center gap-4">
                    <Button onClick={onGetStarted} className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 rounded-full px-5 font-semibold">
                        Get Started
                    </Button>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-8">
                    {/* <Zap className="h-4 w-4" /> */}
                    Powered by 0G Network
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-slate-50 max-w-4xl mb-6">
                    The ultimate intelligent <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">
                        learning workspace.
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed font-medium">
                    Upload any document, link, or video. Our decentralized AI extracts insights, builds quizzes, and generates custom flashcards in seconds. High-density, high-focus.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Button size="lg" onClick={onGetStarted} className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-full h-12 px-8 text-base shadow-lg shadow-indigo-500/20 group">
                        Start Learning Free
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium sm:ml-4">
                        No credit card required. Web3 native.
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl w-full text-left">
                    <div className="flex flex-col gap-3 p-6 rounded-2xl bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/50 transition-colors">
                        {/* <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10 mb-2">
                            <BrainCircuit className="h-5 w-5 text-indigo-500" />
                        </div> */}
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Contextual Magic</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Ask deep questions about your specific documents. The AI reads it all.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 p-6 rounded-2xl bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 transition-colors">
                        {/* <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10 mb-2">
                            <BookOpen className="h-5 w-5 text-emerald-500" />
                        </div> */}
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Instant Study Tools</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            One click to generate comprehensive quizzes and highly efficient flashcards.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 p-6 rounded-2xl bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 transition-colors">
                        {/* <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10 mb-2">
                            <Globe className="h-5 w-5 text-blue-500" />
                        </div> */}
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Decentralized Verity</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Files are processed via 0G Compute. High speeds, massive horizontal scalability.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
