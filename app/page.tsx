"use client"

import { useState } from "react"
import { AuthScreen } from "@/components/auth-screen"
import { Navbar } from "@/components/navbar"
import { Dashboard } from "@/components/dashboard"
import { Workspace } from "@/components/workspace"
import { QuizView } from "@/components/quiz-view"
import { FlashcardsView } from "@/components/flashcards-view"
import { LandingPage } from "@/components/landing-page"
import { ProfileView } from "@/components/profile-view"
import { SettingsView } from "@/components/settings-view"
import { NotificationsView } from "@/components/notifications-view"
import type { Environment } from "@/lib/store"
import { sampleEnvironments } from "@/lib/store"

export type View = "landing" | "auth" | "dashboard" | "workspace" | "quiz" | "flashcards" | "profile" | "settings" | "notifications"

export default function Page() {
  const [view, setView] = useState<View>("landing")
  const [environments, setEnvironments] = useState<Environment[]>(sampleEnvironments)
  const [activeEnvId, setActiveEnvId] = useState<string | null>(null)
  const walletAddress = "0x1a2B3c4D5e6F7890aBcDeF1234567890AbCdEf12"

  const activeEnvironment = environments.find((e) => e.id === activeEnvId) || null

  function handleConnect() {
    setView("dashboard")
  }

  function handleDisconnect() {
    setView("auth")
    setActiveEnvId(null)
  }

  function handleCreateEnvironment(name: string) {
    const newEnv: Environment = {
      id: `env-${Date.now()}`,
      name,
      documents: [],
      messages: [],
      quiz: [],
      flashcards: [],
      lastActivity: "Just now",
    }
    setEnvironments((prev) => [...prev, newEnv])
  }

  function handleOpenEnvironment(id: string) {
    setActiveEnvId(id)
    setView("workspace")
  }

  function handleUpdateEnvironment(updated: Environment) {
    setEnvironments((prev) =>
      prev.map((env) => (env.id === updated.id ? updated : env))
    )
  }

  function handleDeleteEnvironment(id: string) {
    setEnvironments((prev) => prev.filter((env) => env.id !== id))
    if (activeEnvId === id) {
      setActiveEnvId(null)
      setView("dashboard")
    }
  }

  function handleBack() {
    setView("dashboard")
    setActiveEnvId(null)
  }

  function handleBackToWorkspace() {
    setView("workspace")
  }

  // Landing page
  if (view === "landing") {
    return <LandingPage onGetStarted={() => setView("auth")} />
  }

  // Auth screen
  if (view === "auth") {
    return <AuthScreen onConnect={handleConnect} />
  }

  // Quiz view
  if (view === "quiz" && activeEnvironment) {
    return (
      <div className="flex h-screen flex-col bg-background">
        <Navbar walletAddress={walletAddress} onDisconnect={handleDisconnect} onNavigate={setView} />
        <QuizView
          questions={activeEnvironment.quiz}
          environmentName={activeEnvironment.name}
          onBack={handleBackToWorkspace}
        />
      </div>
    )
  }

  // Flashcards view
  if (view === "flashcards" && activeEnvironment) {
    return (
      <div className="flex h-screen flex-col bg-background">
        <Navbar walletAddress={walletAddress} onDisconnect={handleDisconnect} onNavigate={setView} />
        <FlashcardsView
          flashcards={activeEnvironment.flashcards}
          environmentName={activeEnvironment.name}
          onBack={handleBackToWorkspace}
        />
      </div>
    )
  }

  // Workspace view
  if (view === "workspace" && activeEnvironment) {
    return (
      <div className="flex h-screen flex-col bg-background">
        <Navbar walletAddress={walletAddress} onDisconnect={handleDisconnect} onNavigate={setView} />
        <Workspace
          environment={activeEnvironment}
          onBack={handleBack}
          onUpdateEnvironment={handleUpdateEnvironment}
          onOpenQuiz={() => setView("quiz")}
          onOpenFlashcards={() => setView("flashcards")}
        />
      </div>
    )
  }

  // Profile view
  if (view === "profile") {
    return (
      <div className="flex h-screen flex-col bg-background">
        <Navbar walletAddress={walletAddress} onDisconnect={handleDisconnect} onNavigate={setView} />
        <ProfileView walletAddress={walletAddress} onBack={handleBack} />
      </div>
    )
  }

  // Settings view
  if (view === "settings") {
    return (
      <div className="flex h-screen flex-col bg-background">
        <Navbar walletAddress={walletAddress} onDisconnect={handleDisconnect} onNavigate={setView} />
        <SettingsView onBack={handleBack} />
      </div>
    )
  }

  // Notifications view
  if (view === "notifications") {
    return (
      <div className="flex h-screen flex-col bg-background">
        <Navbar walletAddress={walletAddress} onDisconnect={handleDisconnect} onNavigate={setView} />
        <NotificationsView onBack={handleBack} />
      </div>
    )
  }

  // Dashboard view
  return (
    <div className="flex h-screen flex-col bg-background">
      <Navbar walletAddress={walletAddress} onDisconnect={handleDisconnect} onNavigate={setView} />
      <Dashboard
        environments={environments}
        onCreateEnvironment={handleCreateEnvironment}
        onOpenEnvironment={handleOpenEnvironment}
        onDeleteEnvironment={handleDeleteEnvironment}
      />
    </div>
  )
}
