"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BookOpen, ChevronDown, LogOut, Settings, User } from "lucide-react"

interface NavbarProps {
  walletAddress: string
  onDisconnect: () => void
}

export function Navbar({ walletAddress, onDisconnect }: NavbarProps) {
  const truncated = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/95 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
          <BookOpen className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-foreground">
          StudySphere
        </span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 font-mono text-xs">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            {truncated}
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="gap-2 text-sm">
            <User className="h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 text-sm">
            <Settings className="h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 text-sm" onClick={onDisconnect}>
            <LogOut className="h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
