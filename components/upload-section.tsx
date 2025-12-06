"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import {
  Upload,
  ImageIcon,
  ArrowRight,
  Sparkles,
  Brain,
  Wand2,
  MessageSquare,
  Layers,
  Ruler,
  FileDown,
  X,
  Camera,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import type { Project } from "@/lib/types"

export function UploadSection() {
  const { setAppState, addProject, setCurrentProjectId } = useAppStore()

  const [isDragActive, setIsDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [prompt, setPrompt] = useState("")
  const [isHovering, setIsHovering] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  })

  const handleTransform = async () => {
    if (!file || !preview || isSubmitting) return

    setError(null)
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("prompt", prompt)

      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Failed to generate design")
      }

      const data: {
        projectId: string
        name: string
        roomType: Project["roomType"]
        stylePreset: Project["stylePreset"]
        glbUrl: string
      } = await res.json()

      const now = new Date()

      const project: Project = {
        id: data.projectId,
        name: data.name || prompt.slice(0, 30) || "Untitled Design",
        description: prompt,
        initialPrompt: prompt,
        floorPlanImage: preview,
        chatHistory: [],
        versions: [],
        currentVersionId: "",
        createdAt: now,
        updatedAt: now,
        roomType: data.roomType,
        stylePreset: data.stylePreset,
        aiAnalysis: undefined,
        glbUrl: data.glbUrl,
      }

      addProject(project)
      setCurrentProjectId(project.id)
      setAppState("processing")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const features = [
    { icon: Brain, label: "AI Detection", desc: "Auto-detects room type" },
    { icon: MessageSquare, label: "Chat Edits", desc: "Refine with natural language" },
    { icon: Ruler, label: "Measurements", desc: "Real scale dimensions" },
    { icon: FileDown, label: "Export", desc: "PDF, OBJ, GLTF formats" },
  ]

  return (
    <div className="min-h-screen pt-14 overflow-hidden">
      {/* Hero section with animated background */}
      <div className="relative">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-gradient-to-br from-accent/20 via-accent/5 to-transparent rounded-full blur-[100px] animate-float" />
          <div
            className="absolute bottom-20 right-[10%] w-[400px] h-[400px] bg-gradient-to-tr from-purple-500/10 via-accent/10 to-transparent rounded-full blur-[80px] animate-float"
            style={{ animationDelay: "-2s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, oklch(0.72 0.17 162 / 0.05), transparent)" }}
          />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:px-6">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="group relative inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent backdrop-blur-sm transition-all hover:border-accent/50 hover:bg-accent/15 cursor-default">
              <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Sparkles className="h-4 w-4 relative" />
              <span className="relative">Floor Plan to 3D in Seconds</span>
            </div>
          </div>

          {/* Main heading */}
          <h1 className="text-center text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-balance">
            Design spaces with
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-accent via-emerald-400 to-teal-400 animate-gradient">
              AI precision
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-center text-lg sm:text-xl text-muted-foreground mb-12 text-pretty leading-relaxed">
            Upload any floor plan. Describe your vision. Watch AI transform it into a fully-furnished, interactive 3D
            model you can explore and refine.
          </p>

          {/* Main upload/input area */}
          <div className="mx-auto max-w-3xl">
            <div
              className={cn(
                "relative rounded-3xl border-2 transition-all duration-300 overflow-hidden",
                preview
                  ? "border-accent/40 bg-card/80 backdrop-blur-sm"
                  : isDragActive
                    ? "border-accent bg-accent/5 scale-[1.01]"
                    : "border-border/60 bg-card/50 backdrop-blur-sm hover:border-border hover:bg-card/70",
              )}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {preview ? (
                <div className="p-6">
                  {/* Preview with prompt */}
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Image preview */}
                    <div className="relative lg:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden bg-secondary/50 group">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt="Floor plan preview"
                        className="h-full w-full object-contain p-4"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-3 right-3 h-8 w-8 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          setPreview(null)
                          setFile(null)
                          setError(null)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-medium">
                        <Camera className="h-3.5 w-3.5 text-accent" />
                        Floor plan ready
                      </div>
                    </div>

                    {/* Prompt input */}
                    <div className="lg:w-1/2 flex flex-col">
                      <label className="text-sm font-medium text-muted-foreground mb-2">
                        Describe your ideal space
                      </label>
                      <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., Modern minimalist living room with warm wood tones, a large sectional sofa, and lots of natural light..."
                        className="flex-1 min-h-[140px] resize-none bg-secondary/30 border-border/50 text-base leading-relaxed placeholder:text-muted-foreground/60"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        AI will auto-detect room type and suggest optimal furniture placement
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-border/40">
                    <Button
                      variant="ghost"
                      onClick={() => setPreview(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Start over
                    </Button>
                    <Button
                      onClick={handleTransform}
                      size="lg"
                      disabled={!file || isSubmitting}
                      className="gap-2 bg-gradient-to-r from-accent to-emerald-500 text-accent-foreground hover:opacity-90 shadow-lg shadow-accent/25 px-8 disabled:opacity-60"
                    >
                      <Wand2 className="h-4 w-4" />
                      {isSubmitting ? "Generating..." : "Generate 3D Design"}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div {...getRootProps()} className="cursor-pointer">
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center text-center p-12 sm:p-16">
                    {/* Animated upload icon */}
                    <div
                      className={cn(
                        "relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl transition-all duration-300",
                        isDragActive
                          ? "bg-accent text-accent-foreground scale-110 rotate-3"
                          : "bg-secondary/80 text-muted-foreground",
                        isHovering && !isDragActive && "scale-105",
                      )}
                    >
                      {isDragActive ? <ImageIcon className="h-10 w-10" /> : <Upload className="h-10 w-10" />}
                      {/* Pulse ring */}
                      <div
                        className={cn(
                          "absolute inset-0 rounded-3xl border-2 border-accent/50 animate-ping opacity-0",
                          (isDragActive || isHovering) && "opacity-75",
                        )}
                      />
                    </div>

                    <h3 className="mb-2 text-xl sm:text-2xl font-semibold">
                      {isDragActive ? "Drop it here!" : "Upload your floor plan"}
                    </h3>
                    <p className="mb-6 text-muted-foreground max-w-sm">
                      Drag and drop your floor plan image, or click to browse. We support PNG, JPG, and WEBP.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <Button
                        size="lg"
                        className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20"
                      >
                        <Upload className="h-4 w-4" />
                        Choose File
                      </Button>
                      <span className="text-sm text-muted-foreground">or drag and drop</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 mx-auto max-w-3xl text-sm text-red-500 bg-red-500/10 border border-red-500/40 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-12">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group flex items-center gap-2.5 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm px-4 py-2.5 transition-all hover:border-accent/30 hover:bg-accent/5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary group-hover:bg-accent/10 transition-colors">
                  <feature.icon className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">{feature.label}</div>
                  <div className="text-xs text-muted-foreground">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Architecture tools section */}
      <div className="border-t border-border/40 bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">Built for architecture students</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Professional tools to help you visualize, measure, and present your designs
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Ruler, title: "Scale Measurements", desc: "Accurate dimensions with metric/imperial toggle" },
              { icon: Layers, title: "Layer Control", desc: "Toggle furniture, walls, and annotations" },
              { icon: FileDown, title: "Multi-Format Export", desc: "PNG renders, PDF plans, OBJ/GLTF 3D files" },
              { icon: MessageSquare, title: "Design Annotations", desc: "Add notes and material callouts" },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-border/50 bg-card/50 p-6 transition-all hover:border-accent/30 hover:bg-card overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary group-hover:bg-accent/10 transition-colors">
                    <item.icon className="h-6 w-6 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
