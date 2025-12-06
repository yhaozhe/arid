"use client"

import { useState, useEffect } from "react"
import { Check, Loader2, Scan, Box, Armchair, Sparkles, Brain, Palette } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"

const processingSteps = [
  { id: 1, title: "Analyzing floor plan", desc: "Detecting walls, doors, and windows", icon: Scan, duration: 1200 },
  { id: 2, title: "Detecting room type", desc: "AI identifying space purpose", icon: Brain, duration: 1000 },
  { id: 3, title: "Generating 3D model", desc: "Creating geometry from 2D input", icon: Box, duration: 1500 },
  {
    id: 4,
    title: "Placing furniture",
    desc: "Optimal arrangement based on your prompt",
    icon: Armchair,
    duration: 1200,
  },
  { id: 5, title: "Applying style", desc: "Colors, materials, and lighting", icon: Palette, duration: 800 },
]

export function ProcessingSection() {
  const { setAppState, getCurrentProject, addMessage } = useAppStore()
  const currentProject = getCurrentProject()

  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const processStep = (stepIndex: number) => {
      if (stepIndex >= processingSteps.length) {
        if (currentProject) {
          const promptContext = currentProject.initialPrompt
            ? `Based on your request: "${currentProject.initialPrompt.slice(0, 100)}${currentProject.initialPrompt.length > 100 ? "..." : ""}"`
            : "I've analyzed your floor plan"

          addMessage(currentProject.id, {
            id: crypto.randomUUID(),
            role: "assistant",
            content: `${promptContext}\n\nI've detected this as a **${currentProject.roomType.replace("-", " ")}** and created a ${currentProject.stylePreset} design. The space is approximately 32m² with optimal furniture placement.\n\nYou can now:\n• Chat to refine colors, furniture, or style\n• Toggle measurements and grid overlay\n• Export in multiple formats\n\nTry saying "make it warmer" or "switch to minimalist style"!`,
            timestamp: new Date(),
          })
        }
        setTimeout(() => setAppState("workspace"), 400)
        return
      }

      setCurrentStep(stepIndex)

      timeoutId = setTimeout(() => {
        setCompletedSteps((prev) => [...prev, stepIndex])
        processStep(stepIndex + 1)
      }, processingSteps[stepIndex].duration)
    }

    processStep(0)

    return () => clearTimeout(timeoutId)
  }, [setAppState, currentProject, addMessage])

  const progress = ((completedSteps.length / processingSteps.length) * 100).toFixed(0)

  return (
    <div className="min-h-screen pt-14 flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] animate-pulse-glow" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-12 lg:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Preview with enhanced visuals */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-2xl shadow-accent/5">
              {currentProject?.floorPlanImage && (
                <img
                  src={currentProject.floorPlanImage || "/placeholder.svg"}
                  alt="Floor plan"
                  className="h-full w-full object-contain p-8"
                />
              )}

              {/* Scanning overlay with multiple layers */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-accent/15 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-accent/5" />
              </div>

              {/* Animated scan line */}
              <div
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent animate-scan"
                style={{
                  animation: "scan 2s ease-in-out infinite",
                }}
              />

              {/* Corner markers with glow */}
              {[
                "left-6 top-6 border-l-2 border-t-2",
                "right-6 top-6 border-r-2 border-t-2",
                "bottom-6 left-6 border-b-2 border-l-2",
                "bottom-6 right-6 border-b-2 border-r-2",
              ].map((pos, i) => (
                <div
                  key={i}
                  className={cn("absolute h-6 w-6 border-accent", pos)}
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>

            {/* Progress indicator */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-2/3">
              <div className="rounded-full border border-border/50 bg-card/90 backdrop-blur-sm px-5 py-3 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Processing</span>
                  <span className="text-xs font-bold text-accent">{progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-emerald-400 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Steps with improved styling */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent mb-4">
              <Sparkles className="h-3 w-3" />
              AI Processing
            </div>

            <h2 className="mb-3 text-3xl sm:text-4xl font-bold tracking-tight">
              Creating your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-400">
                3D design
              </span>
            </h2>

            {currentProject?.initialPrompt && (
              <p className="mb-6 text-sm text-muted-foreground bg-secondary/50 rounded-lg px-4 py-3 border border-border/50">
                <span className="text-foreground font-medium">Your prompt:</span>{" "}
                {currentProject.initialPrompt.slice(0, 100)}
                {currentProject.initialPrompt.length > 100 && "..."}
              </p>
            )}

            <div className="space-y-3">
              {processingSteps.map((step, index) => {
                const isCompleted = completedSteps.includes(index)
                const isCurrent = currentStep === index && !isCompleted
                const isPending = index > currentStep

                return (
                  <div
                    key={step.id}
                    className={cn(
                      "flex items-center gap-4 rounded-xl border p-4 transition-all duration-300",
                      isCompleted && "border-accent/30 bg-accent/5",
                      isCurrent && "border-accent bg-accent/10 shadow-lg shadow-accent/10",
                      isPending && "border-border/30 bg-card/30 opacity-40",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all",
                        isCompleted && "bg-accent text-accent-foreground shadow-md shadow-accent/20",
                        isCurrent && "bg-accent/20 text-accent",
                        isPending && "bg-secondary text-muted-foreground",
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : isCurrent ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className={cn("font-semibold", isPending && "text-muted-foreground")}>{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0%, 100% { top: 10%; }
          50% { top: 90%; }
        }
      `}</style>
    </div>
  )
}
