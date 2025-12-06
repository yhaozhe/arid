import { create } from "zustand"
import type {
  Project,
  ChatMessage,
  DesignVersion,
  AppState,
  SceneConfig,
  ViewMode3D,
  FurnitureItem,
  RoomType,
  StylePreset,
} from "./types"

export const defaultSceneConfigs: Record<string, SceneConfig> = {
  modern: {
    wallColor: "#141414",
    floorColor: "#1a1a1a",
    accentColor: "#10b981",
    ambientIntensity: 0.4,
    windowEmission: false,
  },
  minimalist: {
    wallColor: "#181818",
    floorColor: "#1f1f1f",
    accentColor: "#f5f5f5",
    ambientIntensity: 0.5,
    windowEmission: false,
  },
  scandinavian: {
    wallColor: "#1e1e1e",
    floorColor: "#282828",
    accentColor: "#f59e0b",
    ambientIntensity: 0.45,
    windowEmission: false,
  },
  industrial: {
    wallColor: "#121212",
    floorColor: "#1a1a1a",
    accentColor: "#71717a",
    ambientIntensity: 0.35,
    windowEmission: false,
  },
  bohemian: {
    wallColor: "#1a1815",
    floorColor: "#252218",
    accentColor: "#ea580c",
    ambientIntensity: 0.4,
    windowEmission: false,
  },
  traditional: {
    wallColor: "#1a1818",
    floorColor: "#221e1e",
    accentColor: "#a8763e",
    ambientIntensity: 0.4,
    windowEmission: false,
  },
}

export const getRoomFurniture = (roomType: RoomType, style: StylePreset): FurnitureItem[] => {
  const accent = defaultSceneConfigs[style]?.accentColor || "#10b981"

  const livingRoomFurniture: FurnitureItem[] = [
    {
      id: "sofa-1",
      name: "Sofa",
      category: "seating",
      position: [0, 0, -2.5],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: "#3a3a3a",
      visible: true,
    },
    {
      id: "table-1",
      name: "Coffee Table",
      category: "tables",
      position: [0, 0, -0.5],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: "#5c4a3a",
      visible: true,
    },
    {
      id: "chair-1",
      name: "Armchair",
      category: "seating",
      position: [2.5, 0, -1],
      rotation: [0, -Math.PI / 4, 0],
      scale: [1, 1, 1],
      color: "#4a4a4a",
      visible: true,
    },
    {
      id: "lamp-1",
      name: "Floor Lamp",
      category: "lighting",
      position: [-2.5, 0, -2.5],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: accent,
      visible: true,
    },
    {
      id: "plant-1",
      name: "Plant",
      category: "plants",
      position: [3, 0, -3],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: "#22c55e",
      visible: true,
    },
    {
      id: "shelf-1",
      name: "Bookshelf",
      category: "storage",
      position: [-3.5, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: "#4a3a2a",
      visible: true,
    },
    {
      id: "rug-1",
      name: "Area Rug",
      category: "decor",
      position: [0, 0, -1],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: "#2a2a2a",
      visible: true,
    },
    {
      id: "tv-1",
      name: "TV Stand",
      category: "storage",
      position: [0, 0, 3],
      rotation: [0, Math.PI, 0],
      scale: [1, 1, 1],
      color: "#1a1a1a",
      visible: true,
    },
  ]

  const bedroomFurniture: FurnitureItem[] = [
    {
      id: "bed-1",
      name: "Bed",
      category: "bed",
      position: [0, 0, -2],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: "#3a3a3a",
      visible: true,
    },
    {
      id: "nightstand-1",
      name: "Nightstand Left",
      category: "tables",
      position: [-1.8, 0, -2],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: "#4a3a2a",
      visible: true,
    },
    {
      id: "nightstand-2",
      name: "Nightstand Right",
      category: "tables",
      position: [1.8, 0, -2],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: "#4a3a2a",
      visible: true,
    },
    {
      id: "lamp-bed-1",
      name: "Bedside Lamp",
      category: "lighting",
      position: [-1.8, 0, -2],
      rotation: [0, 0, 0],
      scale: [0.7, 0.7, 0.7],
      color: accent,
      visible: true,
    },
    {
      id: "wardrobe-1",
      name: "Wardrobe",
      category: "storage",
      position: [-3.5, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: "#3a2a1a",
      visible: true,
    },
    {
      id: "dresser-1",
      name: "Dresser",
      category: "storage",
      position: [3, 0, 0],
      rotation: [0, -Math.PI / 2, 0],
      scale: [1, 1, 1],
      color: "#4a3a2a",
      visible: true,
    },
    {
      id: "rug-bed-1",
      name: "Bedroom Rug",
      category: "decor",
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1.2, 1, 1.5],
      color: "#2a2a2a",
      visible: true,
    },
    {
      id: "plant-bed-1",
      name: "Plant",
      category: "plants",
      position: [3, 0, -3],
      rotation: [0, 0, 0],
      scale: [0.8, 0.8, 0.8],
      color: "#22c55e",
      visible: true,
    },
  ]

  const officeFurniture: FurnitureItem[] = [
    {
      id: "desk-1",
      name: "Desk",
      category: "desk",
      position: [0, 0, -2.5],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: "#4a3a2a",
      visible: true,
    },
    {
      id: "chair-office-1",
      name: "Office Chair",
      category: "seating",
      position: [0, 0, -1],
      rotation: [0, Math.PI, 0],
      scale: [1, 1, 1],
      color: "#1a1a1a",
      visible: true,
    },
    {
      id: "shelf-office-1",
      name: "Bookshelf",
      category: "storage",
      position: [-3.5, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: "#4a3a2a",
      visible: true,
    },
    {
      id: "lamp-desk-1",
      name: "Desk Lamp",
      category: "lighting",
      position: [1, 0, -2.5],
      rotation: [0, 0, 0],
      scale: [0.6, 0.6, 0.6],
      color: accent,
      visible: true,
    },
    {
      id: "plant-office-1",
      name: "Office Plant",
      category: "plants",
      position: [3, 0, -3],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: "#22c55e",
      visible: true,
    },
    {
      id: "cabinet-1",
      name: "Filing Cabinet",
      category: "storage",
      position: [3, 0, 0],
      rotation: [0, -Math.PI / 2, 0],
      scale: [1, 1, 1],
      color: "#2a2a2a",
      visible: true,
    },
    {
      id: "rug-office-1",
      name: "Office Rug",
      category: "decor",
      position: [0, 0, -1],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: "#1a1a1a",
      visible: true,
    },
  ]

  switch (roomType) {
    case "bedroom":
      return bedroomFurniture
    case "office":
      return officeFurniture
    default:
      return livingRoomFurniture
  }
}

interface AppStore {
  appState: AppState
  setAppState: (state: AppState) => void

  projects: Project[]
  currentProjectId: string | null
  setCurrentProjectId: (id: string | null) => void
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void

  getCurrentProject: () => Project | null

  addMessage: (projectId: string, message: ChatMessage) => void

  addVersion: (projectId: string, version: DesignVersion) => void
  setCurrentVersion: (projectId: string, versionId: string) => void
  updateSceneConfig: (projectId: string, config: Partial<SceneConfig>) => void
  toggleFurniture: (projectId: string, furnitureId: string) => void
  setRoomType: (projectId: string, roomType: RoomType) => void

  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  chatOpen: boolean
  setChatOpen: (open: boolean) => void

  selectedFurnitureId: string | null
  setSelectedFurnitureId: (id: string | null) => void
  viewMode: "perspective" | "top" | "front" | "side"
  setViewMode: (mode: "perspective" | "top" | "front" | "side") => void
  lighting: "day" | "night" | "warm" | "cool"
  setLighting: (lighting: "day" | "night" | "warm" | "cool") => void
  showGrid: boolean
  setShowGrid: (show: boolean) => void
  showMeasurements: boolean
  setShowMeasurements: (show: boolean) => void
  viewMode3D: ViewMode3D
  setViewMode3D: (mode: ViewMode3D) => void
  annotationMode: boolean
  setAnnotationMode: (mode: boolean) => void
}

export const useAppStore = create<AppStore>((set, get) => ({
  appState: "upload",
  setAppState: (appState) => set({ appState }),

  projects: [],
  currentProjectId: null,
  setCurrentProjectId: (currentProjectId) => set({ currentProjectId }),
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p)),
    })),
  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProjectId: state.currentProjectId === id ? null : state.currentProjectId,
    })),

  getCurrentProject: () => {
    const state = get()
    return state.projects.find((p) => p.id === state.currentProjectId) || null
  },

  addMessage: (projectId, message) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, chatHistory: [...p.chatHistory, message], updatedAt: new Date() } : p,
      ),
    })),

  addVersion: (projectId, version) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, versions: [...p.versions, version], updatedAt: new Date() } : p,
      ),
    })),
  setCurrentVersion: (projectId, versionId) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === projectId ? { ...p, currentVersionId: versionId } : p)),
    })),

  updateSceneConfig: (projectId, config) =>
    set((state) => ({
      projects: state.projects.map((p) => {
        if (p.id !== projectId) return p
        return {
          ...p,
          versions: p.versions.map((v) =>
            v.id === p.currentVersionId ? { ...v, sceneConfig: { ...v.sceneConfig, ...config } } : v,
          ),
          updatedAt: new Date(),
        }
      }),
    })),

  toggleFurniture: (projectId, furnitureId) =>
    set((state) => ({
      projects: state.projects.map((p) => {
        if (p.id !== projectId) return p
        return {
          ...p,
          versions: p.versions.map((v) =>
            v.id === p.currentVersionId
              ? {
                  ...v,
                  furnitureItems: v.furnitureItems.map((f) =>
                    f.id === furnitureId ? { ...f, visible: !f.visible } : f,
                  ),
                }
              : v,
          ),
          updatedAt: new Date(),
        }
      }),
    })),

  setRoomType: (projectId, roomType) =>
    set((state) => ({
      projects: state.projects.map((p) => {
        if (p.id !== projectId) return p
        const furniture = getRoomFurniture(roomType, p.stylePreset)
        return {
          ...p,
          roomType,
          versions: p.versions.map((v) => (v.id === p.currentVersionId ? { ...v, furnitureItems: furniture } : v)),
          updatedAt: new Date(),
        }
      }),
    })),

  sidebarOpen: true,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  chatOpen: true,
  setChatOpen: (chatOpen) => set({ chatOpen }),

  selectedFurnitureId: null,
  setSelectedFurnitureId: (selectedFurnitureId) => set({ selectedFurnitureId }),
  viewMode: "perspective",
  setViewMode: (viewMode) => set({ viewMode }),
  lighting: "day",
  setLighting: (lighting) => set({ lighting }),
  showGrid: false,
  setShowGrid: (showGrid) => set({ showGrid }),
  showMeasurements: false,
  setShowMeasurements: (showMeasurements) => set({ showMeasurements }),
  viewMode3D: "immersive",
  setViewMode3D: (viewMode3D) => set({ viewMode3D }),
  annotationMode: false,
  setAnnotationMode: (annotationMode) => set({ annotationMode }),
}))
