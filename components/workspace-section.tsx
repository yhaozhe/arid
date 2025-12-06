"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { ViewerPanel } from "@/components/viewer-panel"
import { ChatPanel } from "@/components/chat-panel"
import { ToolbarPanel } from "@/components/toolbar-panel"
import { VersionPanel } from "@/components/version-panel"
import { cn } from "@/lib/utils"
import { PanelLeftClose, PanelRightClose, History, MessageSquare, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WorkspaceSection() {
  const { getCurrentProject, chatOpen, setChatOpen } = useAppStore()
  const [versionsOpen, setVersionsOpen] = useState(false)

  const currentProject = getCurrentProject()

  if (!currentProject) return null

  return (
    <div className="h-screen pt-14 flex bg-background">
      {/* Versions sidebar */}
      <div
        className={cn(
          "h-full border-r border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300 flex-shrink-0 overflow-hidden",
          versionsOpen ? "w-72" : "w-0",
        )}
      >
        {versionsOpen && <VersionPanel project={currentProject} />}
      </div>

      {/* Main workspace */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <ToolbarPanel versionsOpen={versionsOpen} setVersionsOpen={setVersionsOpen} />

        {/* Viewer with floating controls */}
        <div className="flex-1 relative bg-gradient-to-br from-background via-background to-accent/5">
          <ViewerPanel />

          {/* Floating toggle buttons with enhanced styling */}
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="sm"
              className={cn(
                "gap-2 bg-card/90 backdrop-blur-sm border border-border/50 shadow-lg transition-all hover:scale-105",
                versionsOpen && "bg-accent/10 text-accent border-accent/30",
              )}
              onClick={() => setVersionsOpen(!versionsOpen)}
            >
              {versionsOpen ? <PanelLeftClose className="h-4 w-4" /> : <History className="h-4 w-4" />}
              <span className="text-xs font-medium">Versions</span>
            </Button>
          </div>

          <div className="absolute right-4 top-4">
            <Button
              variant="secondary"
              size="sm"
              className={cn(
                "gap-2 bg-card/90 backdrop-blur-sm border border-border/50 shadow-lg transition-all hover:scale-105",
                chatOpen && "bg-accent/10 text-accent border-accent/30",
              )}
              onClick={() => setChatOpen(!chatOpen)}
            >
              {chatOpen ? <PanelRightClose className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
              <span className="text-xs font-medium">Chat</span>
            </Button>
          </div>

          {/* Quick stats badge */}
          <div className="absolute left-4 bottom-4 flex items-center gap-2 rounded-lg border border-border/40 bg-card/90 backdrop-blur-sm px-3 py-2 text-xs shadow-lg">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-muted-foreground">
              <span className="text-foreground font-medium capitalize">
                {currentProject.roomType.replace("-", " ")}
              </span>
              {" · "}
              <span className="capitalize">{currentProject.stylePreset}</span>
              {" · "}~32m²
            </span>
          </div>
        </div>
      </div>

      {/* Chat sidebar */}
      <div
        className={cn(
          "h-full border-l border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300 flex-shrink-0 overflow-hidden",
          chatOpen ? "w-80 lg:w-96" : "w-0",
        )}
      >
        {chatOpen && <ChatPanel project={currentProject} />}
      </div>
    </div>
  )
}
