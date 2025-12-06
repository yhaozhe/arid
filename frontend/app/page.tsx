"use client"

import { Header } from "@/components/header"
import { UploadSection } from "@/components/upload-section"
import { ProcessingSection } from "@/components/processing-section"
import { WorkspaceSection } from "@/components/workspace-section"
import { useAppStore } from "@/lib/store"

export default function Home() {
  const { appState } = useAppStore()

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="relative">
        {appState === "upload" && <UploadSection />}
        {appState === "processing" && <ProcessingSection />}
        {appState === "workspace" && <WorkspaceSection />}
      </div>
    </main>
  )
}
