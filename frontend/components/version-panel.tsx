"use client"

import { Check, Clock, Plus, MoreHorizontal, Trash2, Copy, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import type { Project, DesignVersion } from "@/lib/types"

interface VersionPanelProps {
  project: Project
}

export function VersionPanel({ project }: VersionPanelProps) {
  const { setCurrentVersion, addVersion, addMessage } = useAppStore()

  const handleSelectVersion = (versionId: string) => {
    setCurrentVersion(project.id, versionId)
  }

  const handleCreateVersion = () => {
    const currentVersion = project.versions.find((v) => v.id === project.currentVersionId)
    if (!currentVersion) return

    const newVersion: DesignVersion = {
      id: crypto.randomUUID(),
      name: `Version ${project.versions.length + 1}`,
      timestamp: new Date(),
      stylePreset: currentVersion.stylePreset,
      furnitureItems: [...currentVersion.furnitureItems.map((f) => ({ ...f }))],
      sceneConfig: { ...currentVersion.sceneConfig },
    }

    addVersion(project.id, newVersion)
    setCurrentVersion(project.id, newVersion.id)

    addMessage(project.id, {
      id: crypto.randomUUID(),
      role: "assistant",
      content: `Saved as "${newVersion.name}". Continue making changes freely!`,
      timestamp: new Date(),
    })
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return new Date(date).toLocaleDateString()
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-accent" />
          <span className="font-semibold text-sm">Versions</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:bg-accent/10 hover:text-accent"
          onClick={handleCreateVersion}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Versions list */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-1.5">
          {project.versions
            .slice()
            .reverse()
            .map((version) => {
              const isActive = version.id === project.currentVersionId

              return (
                <div
                  key={version.id}
                  onClick={() => handleSelectVersion(version.id)}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl p-3 cursor-pointer transition-all",
                    isActive
                      ? "bg-accent/10 border border-accent/30"
                      : "hover:bg-secondary/50 border border-transparent",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-medium transition-all",
                      isActive
                        ? "bg-accent text-accent-foreground shadow-sm shadow-accent/20"
                        : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {isActive ? <Check className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className={cn("text-sm truncate block", isActive && "font-medium")}>{version.name}</span>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span>{formatTime(version.timestamp)}</span>
                      <span className="opacity-40">·</span>
                      <span className="capitalize">{version.stylePreset}</span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )
            })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border/40 p-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 border-accent/30 hover:bg-accent/10 hover:text-accent bg-transparent"
          onClick={handleCreateVersion}
        >
          <Plus className="h-3.5 w-3.5" />
          Save Checkpoint
        </Button>
      </div>
    </div>
  )
}
