"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Sparkles, User, Wand2, Zap, Palette, Lightbulb, Sofa, Paintbrush } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useAppStore, defaultSceneConfigs } from "@/lib/store"
import type { Project, ChatMessage, AIAction, RoomType } from "@/lib/types"

interface ChatPanelProps {
  project: Project
}

const quickPrompts = [
  { text: "Make it warmer", icon: Palette, category: "style" },
  { text: "Night mode", icon: Lightbulb, category: "lighting" },
  { text: "Minimalist style", icon: Paintbrush, category: "style" },
  { text: "Hide the sofa", icon: Sofa, category: "furniture" },
]

function parseUserIntent(input: string, project: Project): { response: string; action?: AIAction } {
  const lower = input.toLowerCase()
  const currentVersion = project.versions.find((v) => v.id === project.currentVersionId)

  const roomKeywords: { keywords: string[]; type: RoomType; name: string }[] = [
    { keywords: ["living", "lounge", "sitting"], type: "living-room", name: "living room" },
    { keywords: ["bed", "sleep", "master"], type: "bedroom", name: "bedroom" },
    { keywords: ["office", "work", "study", "desk"], type: "office", name: "office" },
    { keywords: ["kitchen", "cook", "dining"], type: "kitchen", name: "kitchen" },
    { keywords: ["bath", "shower", "toilet"], type: "bathroom", name: "bathroom" },
  ]

  if (
    (lower.includes("change") && lower.includes("room")) ||
    (lower.includes("make it") && lower.includes("room")) ||
    lower.includes("this is a")
  ) {
    for (const room of roomKeywords) {
      if (room.keywords.some((k) => lower.includes(k))) {
        return {
          response: `Got it! I've reconfigured the space as a **${room.name}** with appropriate furniture. The layout has been optimized for this room type.`,
          action: { type: "detect_room", payload: { roomType: room.type } },
        }
      }
    }
  }

  // Wall color changes
  if (lower.includes("wall") && (lower.includes("dark") || lower.includes("black"))) {
    return {
      response: "Done! I've darkened the walls for a more dramatic atmosphere.",
      action: { type: "change_wall_color", payload: { color: "#0a0a0a" } },
    }
  }
  if (lower.includes("wall") && (lower.includes("light") || lower.includes("white") || lower.includes("bright"))) {
    return {
      response: "Walls lightened for a fresh, airy feel.",
      action: { type: "change_wall_color", payload: { color: "#2a2a2a" } },
    }
  }
  if ((lower.includes("warm") && !lower.includes("light")) || lower.includes("cozy walls")) {
    return {
      response: "Added warm tones for a cozy vibe.",
      action: { type: "change_wall_color", payload: { color: "#2a2520" } },
    }
  }

  // Lighting changes
  if (lower.includes("night") || lower.includes("evening") || lower.includes("dark mode")) {
    return {
      response: "Switched to night mode with cozy evening lighting. Windows now glow softly.",
      action: { type: "change_lighting", payload: { lighting: "night", windowEmission: true } },
    }
  }
  if (lower.includes("day") || lower.includes("bright") || lower.includes("daytime")) {
    return {
      response: "Switched to bright daytime lighting.",
      action: { type: "change_lighting", payload: { lighting: "day", windowEmission: false } },
    }
  }
  if (lower.includes("warm") && lower.includes("light")) {
    return {
      response: "Set warm lighting for a cozy atmosphere.",
      action: { type: "change_lighting", payload: { lighting: "warm" } },
    }
  }

  // Furniture toggles
  if (lower.includes("hide") || lower.includes("remove")) {
    const furnitureKeywords = [
      { keywords: ["sofa", "couch"], id: "sofa-1", name: "sofa" },
      { keywords: ["table", "coffee"], id: "table-1", name: "coffee table" },
      { keywords: ["chair", "armchair"], id: "chair-1", name: "armchair" },
      { keywords: ["lamp", "light"], id: "lamp-1", name: "floor lamp" },
      { keywords: ["plant"], id: "plant-1", name: "plant" },
      { keywords: ["shelf", "bookshelf", "book"], id: "shelf-1", name: "bookshelf" },
      { keywords: ["rug", "carpet"], id: "rug-1", name: "rug" },
      { keywords: ["bed"], id: "bed-1", name: "bed" },
      { keywords: ["desk"], id: "desk-1", name: "desk" },
    ]

    for (const item of furnitureKeywords) {
      if (item.keywords.some((k) => lower.includes(k))) {
        return {
          response: `Hidden the ${item.name}. Say "show ${item.name}" to bring it back.`,
          action: { type: "toggle_furniture", payload: { furnitureId: item.id } },
        }
      }
    }
  }

  if (lower.includes("show") && !lower.includes("hide")) {
    const furnitureKeywords = [
      { keywords: ["sofa", "couch"], id: "sofa-1", name: "sofa" },
      { keywords: ["table", "coffee"], id: "table-1", name: "coffee table" },
      { keywords: ["chair", "armchair"], id: "chair-1", name: "armchair" },
      { keywords: ["lamp", "light"], id: "lamp-1", name: "floor lamp" },
      { keywords: ["plant"], id: "plant-1", name: "plant" },
      { keywords: ["shelf", "bookshelf", "book"], id: "shelf-1", name: "bookshelf" },
      { keywords: ["rug", "carpet"], id: "rug-1", name: "rug" },
      { keywords: ["bed"], id: "bed-1", name: "bed" },
      { keywords: ["desk"], id: "desk-1", name: "desk" },
    ]

    for (const item of furnitureKeywords) {
      if (item.keywords.some((k) => lower.includes(k))) {
        const furniture = currentVersion?.furnitureItems.find((f) => f.id === item.id)
        if (furniture && !furniture.visible) {
          return {
            response: `Restored the ${item.name}.`,
            action: { type: "toggle_furniture", payload: { furnitureId: item.id } },
          }
        }
      }
    }
  }

  // Style changes
  const styles = ["modern", "minimalist", "scandinavian", "industrial", "bohemian", "traditional"]
  for (const style of styles) {
    if (lower.includes(style)) {
      const config = defaultSceneConfigs[style]
      return {
        response: `Transformed to **${style}** style! Colors, materials, and atmosphere have been updated to match.`,
        action: { type: "change_style", payload: { style, ...config } },
      }
    }
  }

  // Accent color changes
  if (lower.includes("accent") || lower.includes("highlight") || lower.includes("pop of")) {
    if (lower.includes("blue")) {
      return {
        response: "Changed accent to sophisticated blue.",
        action: { type: "change_accent", payload: { color: "#3b82f6" } },
      }
    }
    if (lower.includes("gold") || lower.includes("yellow")) {
      return {
        response: "Applied warm golden accents.",
        action: { type: "change_accent", payload: { color: "#eab308" } },
      }
    }
    if (lower.includes("green")) {
      return {
        response: "Set natural green accents.",
        action: { type: "change_accent", payload: { color: "#22c55e" } },
      }
    }
    if (lower.includes("orange") || lower.includes("terracotta")) {
      return {
        response: "Added warm terracotta accents.",
        action: { type: "change_accent", payload: { color: "#ea580c" } },
      }
    }
  }

  // Floor changes
  if (lower.includes("floor")) {
    if (lower.includes("wood") || lower.includes("warm")) {
      return {
        response: "Updated to warm wood flooring.",
        action: { type: "change_floor_color", payload: { color: "#3a3020" } },
      }
    }
    if (lower.includes("dark") || lower.includes("black")) {
      return {
        response: "Darkened the floor for a sleek look.",
        action: { type: "change_floor_color", payload: { color: "#0f0f0f" } },
      }
    }
    if (lower.includes("light") || lower.includes("grey") || lower.includes("gray")) {
      return {
        response: "Lightened the floor with modern grey tones.",
        action: { type: "change_floor_color", payload: { color: "#2a2a2a" } },
      }
    }
  }

  // Default response with helpful suggestions
  const helpResponses = [
    `I can help you:\n• Change styles: "minimalist", "bohemian", "industrial"\n• Adjust lighting: "night mode", "warm light"\n• Modify colors: "darker walls", "wood floor"\n• Toggle furniture: "hide sofa", "show plant"`,
    `Try asking me to:\n• "Make it more modern"\n• "Switch to night mode"\n• "Add warm wood floors"\n• "Hide the coffee table"`,
  ]

  return {
    response: helpResponses[Math.floor(Math.random() * helpResponses.length)],
  }
}

export function ChatPanel({ project }: ChatPanelProps) {
  const { addMessage, updateSceneConfig, toggleFurniture, setLighting, setRoomType } = useAppStore()
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [project.chatHistory])

  const executeAction = (action: AIAction) => {
    switch (action.type) {
      case "change_wall_color":
        updateSceneConfig(project.id, { wallColor: action.payload.color as string })
        break
      case "change_floor_color":
        updateSceneConfig(project.id, { floorColor: action.payload.color as string })
        break
      case "change_accent":
        updateSceneConfig(project.id, { accentColor: action.payload.color as string })
        break
      case "change_lighting":
        if (action.payload.lighting) {
          setLighting(action.payload.lighting as "day" | "night" | "warm" | "cool")
        }
        if (action.payload.windowEmission !== undefined) {
          updateSceneConfig(project.id, { windowEmission: action.payload.windowEmission as boolean })
        }
        break
      case "toggle_furniture":
        toggleFurniture(project.id, action.payload.furnitureId as string)
        break
      case "change_style":
        updateSceneConfig(project.id, {
          wallColor: action.payload.wallColor as string,
          floorColor: action.payload.floorColor as string,
          accentColor: action.payload.accentColor as string,
          ambientIntensity: action.payload.ambientIntensity as number,
        })
        break
      case "detect_room":
        setRoomType(project.id, action.payload.roomType as RoomType)
        break
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    addMessage(project.id, userMessage)
    const userInput = input.trim()
    setInput("")
    setIsTyping(true)

    setTimeout(
      () => {
        const { response, action } = parseUserIntent(userInput, project)

        if (action) {
          executeAction(action)
        }

        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
          action,
        }

        addMessage(project.id, assistantMessage)
        setIsTyping(false)
      },
      600 + Math.random() * 400,
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
    textareaRef.current?.focus()
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border/40 px-4 py-3 bg-gradient-to-r from-accent/5 to-transparent">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-emerald-500 shadow-lg shadow-accent/20">
          <Wand2 className="h-5 w-5 text-accent-foreground" />
        </div>
        <div>
          <span className="font-semibold">Design Assistant</span>
          <p className="text-xs text-muted-foreground">Refine your space with AI</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {project.chatHistory.map((message) => (
            <div key={message.id} className={cn("flex gap-3", message.role === "user" && "flex-row-reverse")}>
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  message.role === "assistant"
                    ? "bg-gradient-to-br from-accent/20 to-accent/10 text-accent"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                {message.role === "assistant" ? <Sparkles className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              <div className="flex flex-col gap-1.5 max-w-[85%]">
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 text-sm",
                    message.role === "assistant"
                      ? "bg-secondary/80 text-foreground rounded-tl-sm"
                      : "bg-accent text-accent-foreground rounded-tr-sm",
                  )}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
                {message.action && (
                  <div className="flex items-center gap-1.5 text-xs text-accent font-medium">
                    <Zap className="h-3 w-3" />
                    Change applied
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 text-accent">
                <Sparkles className="h-4 w-4 animate-pulse" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-secondary/80 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-accent" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-accent" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-accent" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick prompts */}
      <div className="border-t border-border/40 px-4 py-3 bg-secondary/20">
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt.text}
              onClick={() => handleQuickPrompt(prompt.text)}
              className="flex items-center gap-1.5 rounded-full border border-border/50 bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-accent/10 hover:text-accent hover:border-accent/30 hover:scale-105"
            >
              <prompt.icon className="h-3 w-3" />
              {prompt.text}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border/40 p-4">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe changes or ask for suggestions..."
            className="min-h-[44px] max-h-28 resize-none bg-secondary/50 border-border/50 text-sm"
            rows={1}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="h-11 w-11 shrink-0 bg-gradient-to-r from-accent to-emerald-500 text-accent-foreground hover:opacity-90 shadow-lg shadow-accent/20"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
