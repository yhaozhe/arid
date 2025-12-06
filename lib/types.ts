export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  action?: AIAction
}

export interface AIAction {
  type:
    | "change_wall_color"
    | "change_floor_color"
    | "toggle_furniture"
    | "change_lighting"
    | "change_style"
    | "change_accent"
    | "detect_room"
  payload: Record<string, string | boolean | number>
}

export interface AIAnalysisResponse {
  roomType: RoomType
  suggestedStyle: StylePreset
  wallColor: string
  floorColor: string
  accentColor: string
  lighting: "day" | "night" | "warm" | "cool"
  confidence: number
  description: string
  dimensions: {
    width: number
    height: number
    area: number
  }
}

export interface SceneConfig {
  wallColor: string
  floorColor: string
  accentColor: string
  ambientIntensity: number
  windowEmission: boolean
}

export interface DesignVersion {
  id: string
  name: string
  timestamp: Date
  thumbnail?: string
  stylePreset: StylePreset
  furnitureItems: FurnitureItem[]
  sceneConfig: SceneConfig
}

export interface Project {
  id: string
  name: string
  description: string
  initialPrompt: string
  floorPlanImage: string
  chatHistory: ChatMessage[]
  versions: DesignVersion[]
  currentVersionId: string
  createdAt: Date
  updatedAt: Date
  roomType: RoomType
  stylePreset: StylePreset
  aiAnalysis?: AIAnalysisResponse
}

export interface FurnitureItem {
  id: string
  name: string
  category: FurnitureCategory
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  color: string
  visible: boolean
}

export interface Annotation {
  id: string
  position: [number, number, number]
  label: string
  type: "dimension" | "note" | "material"
}

export type RoomType = "living-room" | "bedroom" | "kitchen" | "bathroom" | "office" | "dining-room"

export type StylePreset = "modern" | "minimalist" | "industrial" | "scandinavian" | "bohemian" | "traditional"

export type FurnitureCategory = "seating" | "tables" | "storage" | "lighting" | "decor" | "plants" | "bed" | "desk"

export type AppState = "upload" | "processing" | "workspace"

export type ViewMode3D = "immersive" | "blueprint"

export type ExportFormat = "png" | "pdf" | "obj" | "gltf"
