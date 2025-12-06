"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sparkles, ChevronDown, Plus, FolderOpen, Settings, Zap } from "lucide-react"
import { useAppStore } from "@/lib/store"

export function Header() {
  const { appState, setAppState, projects, currentProjectId, setCurrentProjectId, getCurrentProject } = useAppStore()

  const currentProject = getCurrentProject()

  const handleNewProject = () => {
    setCurrentProjectId(null)
    setAppState("upload")
  }

  const handleSelectProject = (projectId: string) => {
    setCurrentProjectId(projectId)
    setAppState("workspace")
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1800px] items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent/70 shadow-lg shadow-accent/20">
              <Sparkles className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">Spatium</span>
            <span className="hidden sm:inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent uppercase tracking-wider">
              AI
            </span>
          </div>

          {appState === "workspace" && currentProject && (
            <>
              <div className="h-5 w-px bg-border/60" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                    <span className="max-w-[180px] truncate text-sm">{currentProject.name}</span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  <DropdownMenuItem onClick={handleNewProject} className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Project
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {projects.length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Recent</div>
                      {projects.slice(0, 5).map((project) => (
                        <DropdownMenuItem
                          key={project.id}
                          onClick={() => handleSelectProject(project.id)}
                          className="gap-2"
                        >
                          <FolderOpen className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <div className="truncate text-sm">{project.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {project.versions.length} version{project.versions.length !== 1 ? "s" : ""}
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        {/* Right actions */}
        <nav className="flex items-center gap-1">
          {appState === "workspace" && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
              onClick={handleNewProject}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New</span>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            className="ml-2 gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90 shadow-md shadow-accent/20"
          >
            <Zap className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Upgrade</span>
          </Button>
        </nav>
      </div>
    </header>
  )
}
