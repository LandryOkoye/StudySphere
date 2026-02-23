"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Bell, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react"

interface NotificationsViewProps {
    onBack: () => void
}

export function NotificationsView({ onBack }: NotificationsViewProps) {
    const notifications = [
        {
            id: 1,
            title: "New Environment Created",
            message: "You successfully created 'Advanced Algorithms'.",
            time: "2 hours ago",
            icon: BookOpen,
            color: "text-indigo-500",
            bg: "bg-indigo-50 dark:bg-indigo-500/10",
            read: false
        },
        {
            id: 2,
            title: "Quiz Mastery Achieved",
            message: "You passed the 'Biology 101' quiz with a 95% score. Verified via 0G Smart Contract.",
            time: "1 day ago",
            icon: CheckCircle2,
            color: "text-emerald-500",
            bg: "bg-emerald-50 dark:bg-emerald-500/10",
            read: true
        },
        {
            id: 3,
            title: "System Update",
            message: "We've rolled out faster processing for large PDF uploads on the decentralized network.",
            time: "3 days ago",
            icon: AlertCircle,
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-500/10",
            read: true
        }
    ]

    return (
        <div className="flex flex-1 flex-col bg-[#FAFAFA] dark:bg-[#0A0A0A]">
            <div className="flex flex-col mx-auto w-full max-w-3xl px-6 py-10 gap-8">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon-sm" onClick={onBack} className="h-8 w-8 rounded-md shrink-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Button>
                        <div className="flex flex-col gap-1">
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">Notifications</h1>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Stay updated on your study progress</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="hidden sm:flex rounded-full text-xs font-medium">
                        Mark all as read
                    </Button>
                </div>

                <div className="flex flex-col gap-3">
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`flex items-start gap-4 p-5 rounded-2xl border transition-colors ${notif.read
                                    ? "bg-white dark:bg-[#111] border-slate-200 dark:border-slate-800"
                                    : "bg-indigo-50/50 dark:bg-indigo-500/5 border-indigo-200 dark:border-indigo-500/20"
                                }`}
                        >
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${notif.bg} ${notif.color}`}>
                                <notif.icon className="h-5 w-5" />
                            </div>
                            <div className="flex flex-1 flex-col gap-1">
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className={`text-sm font-semibold ${notif.read ? "text-slate-900 dark:text-slate-100" : "text-indigo-900 dark:text-indigo-100"}`}>
                                        {notif.title}
                                    </h3>
                                    <span className="text-xs font-medium text-slate-400 whitespace-nowrap">{notif.time}</span>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {notif.message}
                                </p>
                            </div>
                            {!notif.read && (
                                <div className="h-2 w-2 mt-1.5 rounded-full bg-indigo-500 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
