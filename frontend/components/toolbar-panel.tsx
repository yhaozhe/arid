"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Sun,
  Moon,
  Sunset,
  CloudSun,
  Grid3X3,
  Ruler,
  Eye,
  Box,
  Layers,
  ArrowUp,
  Download,
  Share2,
  ChevronDown,
  Camera,
  RotateCcw,
  Maximize,
  Map,
  FileImage,
  FileText,
  Cable as Cube,
  StickyNote,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

interface ToolbarPanelProps {
  versionsOpen: boolean
  setVersionsOpen: (open: boolean) => void
}

export function ToolbarPanel({ versionsOpen, setVersionsOpen }: ToolbarPanelProps) {
  const {
    getCurrentProject,
    lighting,
    setLighting,
    showGrid,
    setShowGrid,
    showMeasurements,
    setShowMeasurements,
    viewMode,
    setViewMode,
    setAppState,
    setCurrentProjectId,
    viewMode3D,
    setViewMode3D,
    annotationMode,
    setAnnotationMode,
  } = useAppStore()

  const project = getCurrentProject()

  const lightingOptions = [
    { value: "day" as const, label: "Daylight", icon: Sun },
    { value: "night" as const, label: "Night", icon: Moon },
    { value: "warm" as const, label: "Warm", icon: Sunset },
    { value: "cool" as const, label: "Cool", icon: CloudSun },
  ]

  const viewOptions = [
    { value: "perspective" as const, label: "Perspective", icon: Box },
    { value: "top" as const, label: "Top", icon: ArrowUp },
    { value: "front" as const, label: "Front", icon: Layers },
    { value: "side" as const, label: "Side", icon: Eye },
  ]

  const handleNewDesign = () => {
    setCurrentProjectId(null)
    setAppState("upload")
  }

  const currentLightingIcon = lightingOptions.find((o) => o.value === lighting)?.icon || Sun

  return (
    <div className="flex items-center justify-between gap-2 border-b border-border/40 bg-card/50 backdrop-blur-sm px-4 py-2">
      {/* Left: Project info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-500">Live</span>
        </div>
        <div className="hidden sm:block h-4 w-px bg-border/60" />
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="capitalize font-medium text-foreground">{project?.roomType.replace("-", " ")}</span>
          <span className="opacity-40">·</span>
          <span className="capitalize">{project?.stylePreset}</span>
        </div>
      </div>

      {/* Center: View controls */}
      <div className="flex items-center gap-1">
        {/* 3D / Plan toggle */}
        <div className="flex items-center rounded-lg border border-border/50 bg-secondary/50 p-0.5 mr-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-7 px-3 text-xs rounded-md font-medium transition-all",
              viewMode3D === "immersive" && "bg-accent text-accent-foreground shadow-sm",
            )}
            onClick={() => setViewMode3D("immersive")}
          >
            <Maximize className="h-3.5 w-3.5 mr-1.5" />
            3D
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-7 px-3 text-xs rounded-md font-medium transition-all",
              viewMode3D === "blueprint" && "bg-accent text-accent-foreground shadow-sm",
            )}
            onClick={() => setViewMode3D("blueprint")}
          >
            <Map className="h-3.5 w-3.5 mr-1.5" />
            Plan
          </Button>
        </div>

        {/* Camera view */}
        {viewMode3D === "immersive" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5 h-8 text-xs font-medium">
                <Camera className="h-3.5 w-3.5" />
                <span className="hidden sm:inline capitalize">{viewMode}</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {viewOptions.map((opt) => (
                <DropdownMenuItem key={opt.value} onClick={() => setViewMode(opt.value)}>
                  <opt.icon className="mr-2 h-4 w-4" />
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Lighting */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1.5 h-8 text-xs font-medium">
              {(() => {
                const Icon = currentLightingIcon
                return <Icon className="h-3.5 w-3.5" />
              })()}
              <span className="hidden sm:inline capitalize">{lighting}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {lightingOptions.map((opt) => (
              <DropdownMenuItem key={opt.value} onClick={() => setLighting(opt.value)}>
                <opt.icon className="mr-2 h-4 w-4" />
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-4 w-px bg-border/60 mx-1" />

        {/* Toggle buttons */}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8 transition-all", showGrid && "bg-accent/10 text-accent")}
          onClick={() => setShowGrid(!showGrid)}
          title="Toggle Grid"
        >
          <Grid3X3 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8 transition-all", showMeasurements && "bg-accent/10 text-accent")}
          onClick={() => setShowMeasurements(!showMeasurements)}
          title="Toggle Measurements"
        >
          <Ruler className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8 transition-all", annotationMode && "bg-accent/10 text-accent")}
          onClick={() => setAnnotationMode(!annotationMode)}
          title="Annotation Mode"
        >
          <StickyNote className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="gap-1.5 h-8 text-xs font-medium" onClick={handleNewDesign}>
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">New</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1.5 h-8 text-xs font-medium">
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <FileImage className="mr-2 h-4 w-4" />
              PNG Render
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              PDF Plan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Cube className="mr-2 h-4 w-4" />
              OBJ Model
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Box className="mr-2 h-4 w-4" />
              GLTF Model
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="sm" className="gap-1.5 h-8 text-xs font-medium">
          <Share2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </div>
    </div>
  )
}
