"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Bell, Paintbrush, Shield, Database } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface SettingsViewProps {
    onBack: () => void
}

export function SettingsView({ onBack }: SettingsViewProps) {
    return (
        <div className="flex flex-1 flex-col bg-[#FAFAFA] dark:bg-[#0A0A0A]">
            <div className="flex flex-col mx-auto w-full max-w-3xl px-6 py-10 gap-8">
                <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-6">
                    <Button variant="ghost" size="icon-sm" onClick={onBack} className="h-8 w-8 rounded-md shrink-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">Settings</h1>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Configure your application preferences</p>
                    </div>
                </div>

                <div className="flex flex-col gap-8">
                    {/* Appearance */}
                    <section className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                            <Paintbrush className="h-5 w-5" />
                            <h2 className="text-lg font-semibold">Appearance</h2>
                        </div>
                        <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <span className="font-medium text-slate-900 dark:text-slate-50">Dark Mode</span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">Toggle dark mode manually (requires reload or system sync)</span>
                                </div>
                                <Switch id="dark-mode" />
                            </div>
                        </div>
                    </section>

                    {/* Advanced / 0G Storage */}
                    <section className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                            <Database className="h-5 w-5" />
                            <h2 className="text-lg font-semibold">Storage & Compute</h2>
                        </div>
                        <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <span className="font-medium text-slate-900 dark:text-slate-50">0G Decentralized Sync</span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">Back up all learning environments to off-chain 0G storage</span>
                                </div>
                                <Switch id="0g-sync" defaultChecked />
                            </div>
                        </div>
                    </section>

                    {/* Notifications */}
                    <section className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                            <Bell className="h-5 w-5" />
                            <h2 className="text-lg font-semibold">Notifications</h2>
                        </div>
                        <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <span className="font-medium text-slate-900 dark:text-slate-50">Email Alerts</span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">Receive weekly digests of your study progress</span>
                                </div>
                                <Switch id="email-alerts" />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
