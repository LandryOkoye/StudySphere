"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ChevronDown, LogOut, Settings, User, Bell, Search } from "lucide-react"
import { Logo } from "@/components/logo"

interface NavbarProps {
  walletAddress: string
  onDisconnect: () => void
  onNavigate?: (view: any) => void
}

export function Navbar({ walletAddress, onDisconnect, onNavigate }: NavbarProps) {
  const truncated = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/95 px-6 backdrop-blur-sm">
      <div
        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => onNavigate?.("dashboard")}
      >
        <Logo className="h-8 w-auto" variant="transparent" />
      </div>

      {/* Search Bar - Hidden on very small screens */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            className="w-full pl-9 bg-slate-100/50 dark:bg-slate-800/50 border-transparent focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/50 rounded-full h-9 text-sm transition-all"
            placeholder="Search environments..."
          />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4 ml-auto">
        {/* Notification Bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          onClick={() => onNavigate?.("notifications")}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-[#0A0A0A]" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 font-mono text-xs rounded-full h-9 px-4 border-slate-200 dark:border-slate-800 bg-[#FAFAFA] dark:bg-[#111]">
              <div className="h-2 w-2 rounded-full bg-indigo-500" />
              {truncated}
              <ChevronDown className="h-3 w-3 text-muted-foreground ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-[#111] border-slate-200 dark:border-slate-800 rounded-xl shadow-lg mt-1">
            <DropdownMenuItem className="gap-2 text-sm cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800/50 rounded-md m-1" onClick={() => onNavigate?.("profile")}>
              <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-sm cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800/50 rounded-md m-1" onClick={() => onNavigate?.("settings")}>
              <Settings className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />
            <DropdownMenuItem className="gap-2 text-sm text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-500/10 cursor-pointer rounded-md m-1" onClick={onDisconnect}>
              <LogOut className="h-4 w-4" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
