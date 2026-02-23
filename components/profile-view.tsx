"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Activity, FileText, CheckCircle2 } from "lucide-react"

interface ProfileViewProps {
    walletAddress: string
    onBack: () => void
}

export function ProfileView({ walletAddress, onBack }: ProfileViewProps) {
    return (
        <div className="flex flex-1 flex-col bg-[#FAFAFA] dark:bg-[#0A0A0A]">
            <div className="flex flex-col mx-auto w-full max-w-3xl px-6 py-10 gap-8">
                <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-6">
                    <Button variant="ghost" size="icon-sm" onClick={onBack} className="h-8 w-8 rounded-md shrink-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">Your Profile</h1>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Manage your decentralized identity</p>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 shadow-sm items-center sm:items-start text-center sm:text-left">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 shrink-0">
                            <User className="h-10 w-10" />
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Wallet</p>
                            <p className="font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-900 dark:text-slate-50 tracking-wide text-[15px] break-all">{walletAddress}</p>
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-4 mb-2">Lifetime Statistics</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center gap-2 text-indigo-500">
                                <FileText className="h-5 w-5" />
                                <span className="font-medium text-sm">Documents</span>
                            </div>
                            <span className="text-3xl font-semibold text-slate-900 dark:text-slate-50">47</span>
                        </div>
                        <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center gap-2 text-slate-500">
                                <Activity className="h-5 w-5" />
                                <span className="font-medium text-sm">Quizzes Taken</span>
                            </div>
                            <span className="text-3xl font-semibold text-slate-900 dark:text-slate-50">28</span>
                        </div>
                        <div className="flex flex-col gap-3 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 shadow-sm">
                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500">
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="font-medium text-sm">Passed</span>
                            </div>
                            <span className="text-3xl font-semibold text-emerald-700 dark:text-emerald-400">21</span>
                        </div>
                        <div className="flex flex-col gap-3 p-5 rounded-2xl bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 shadow-sm">
                            <div className="flex items-center gap-2 text-red-600 dark:text-red-500">
                                <Activity className="h-5 w-5" />
                                <span className="font-medium text-sm">Failed</span>
                            </div>
                            <span className="text-3xl font-semibold text-red-700 dark:text-red-400">7</span>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
                        <div className="flex flex-col gap-1 text-center sm:text-left">
                            <h3 className="text-lg font-bold">Performance Result</h3>
                            <p className="text-indigo-100 font-medium text-sm">You are in the top 15% of active learners this week!</p>
                        </div>
                        <div className="mt-4 sm:mt-0 px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20 font-bold tracking-wide">
                            A- TIER
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
