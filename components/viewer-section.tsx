"use client"

import { Suspense, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, ContactShadows, PresentationControls } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { RotateCcw, Download, Share2, Maximize2, Sun, Moon, Grid3X3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ViewerSectionProps {
  onReset: () => void
}

function Room() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 1.5, -4]} receiveShadow>
        <boxGeometry args={[8, 4, 0.2]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[-4, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[8, 4, 0.2]} />
        <meshStandardMaterial color="#1f1f1f" />
      </mesh>

      {/* Sofa */}
      <group position={[0, 0, -2.5]}>
        {/* Base */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[3, 0.6, 1]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>
        {/* Back */}
        <mesh position={[0, 0.7, -0.35]} castShadow>
          <boxGeometry args={[3, 0.8, 0.3]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>
        {/* Cushions */}
        <mesh position={[-0.8, 0.55, 0.1]} castShadow>
          <boxGeometry args={[0.8, 0.3, 0.7]} />
          <meshStandardMaterial color="#d4a574" />
        </mesh>
        <mesh position={[0, 0.55, 0.1]} castShadow>
          <boxGeometry args={[0.8, 0.3, 0.7]} />
          <meshStandardMaterial color="#d4a574" />
        </mesh>
        <mesh position={[0.8, 0.55, 0.1]} castShadow>
          <boxGeometry args={[0.8, 0.3, 0.7]} />
          <meshStandardMaterial color="#d4a574" />
        </mesh>
      </group>

      {/* Coffee Table */}
      <group position={[0, 0, -0.5]}>
        {/* Top */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.6, 0.05, 32]} />
          <meshStandardMaterial color="#8b7355" />
        </mesh>
        {/* Leg */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.35, 16]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
        {/* Base */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      </group>

      {/* Chair */}
      <group position={[2.5, 0, -1]} rotation={[0, -Math.PI / 4, 0]}>
        {/* Seat */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[0.8, 0.1, 0.8]} />
          <meshStandardMaterial color="#5a5a5a" />
        </mesh>
        {/* Back */}
        <mesh position={[0, 0.8, -0.35]} castShadow>
          <boxGeometry args={[0.8, 0.7, 0.1]} />
          <meshStandardMaterial color="#5a5a5a" />
        </mesh>
        {/* Legs */}
        {[
          [-0.3, 0, 0.3],
          [0.3, 0, 0.3],
          [-0.3, 0, -0.3],
          [0.3, 0, -0.3],
        ].map((pos, i) => (
          <mesh key={i} position={[pos[0], 0.2, pos[2]]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>
        ))}
      </group>

      {/* Floor Lamp */}
      <group position={[-2.5, 0, -2.5]}>
        {/* Base */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.05, 32]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
        {/* Pole */}
        <mesh position={[0, 1, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 2, 16]} />
          <meshStandardMaterial color="#d4a574" />
        </mesh>
        {/* Shade */}
        <mesh position={[0, 2.1, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.2, 0.4, 32, 1, true]} />
          <meshStandardMaterial color="#e8ddd0" side={2} />
        </mesh>
        {/* Light */}
        <pointLight position={[0, 2, 0]} intensity={0.5} color="#fff5e6" />
      </group>

      {/* Rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, -1]} receiveShadow>
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial color="#3d3d3d" />
      </mesh>

      {/* Plant */}
      <group position={[3, 0, -3]}>
        {/* Pot */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.15, 0.4, 16]} />
          <meshStandardMaterial color="#4a3728" />
        </mesh>
        {/* Plant spheres */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#2d5a27" />
        </mesh>
        <mesh position={[0.15, 0.75, 0.1]} castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#3a7a32" />
        </mesh>
        <mesh position={[-0.1, 0.7, -0.1]} castShadow>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#2d5a27" />
        </mesh>
      </group>

      {/* Bookshelf */}
      <group position={[-3.5, 0, 0]}>
        {/* Frame */}
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[0.8, 2, 0.3]} />
          <meshStandardMaterial color="#5c4a3a" />
        </mesh>
        {/* Shelves (cutouts simulated with smaller boxes) */}
        {[0.3, 0.9, 1.5].map((y, i) => (
          <mesh key={i} position={[0, y, 0.05]} castShadow>
            <boxGeometry args={[0.7, 0.02, 0.25]} />
            <meshStandardMaterial color="#4a3a2a" />
          </mesh>
        ))}
        {/* Books */}
        <mesh position={[-0.2, 0.55, 0]} castShadow>
          <boxGeometry args={[0.15, 0.4, 0.2]} />
          <meshStandardMaterial color="#8b4a4a" />
        </mesh>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.1, 0.35, 0.18]} />
          <meshStandardMaterial color="#4a6a8b" />
        </mesh>
        <mesh position={[0.15, 0.52, 0]} castShadow>
          <boxGeometry args={[0.12, 0.38, 0.19]} />
          <meshStandardMaterial color="#6a8b5a" />
        </mesh>
      </group>
    </group>
  )
}

function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent mx-auto" />
        <p className="text-sm text-muted-foreground">Loading 3D scene...</p>
      </div>
    </div>
  )
}

export function ViewerSection({ onReset }: ViewerSectionProps) {
  const [lighting, setLighting] = useState<"day" | "night">("day")
  const [showGrid, setShowGrid] = useState(false)

  return (
    <div className="min-h-screen pt-16">
      {/* Stats Bar */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm text-muted-foreground">Generation Complete</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
              <span>4 walls</span>
              <span className="text-border">•</span>
              <span>8 furniture items</span>
              <span className="text-border">•</span>
              <span>Living room</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowGrid(!showGrid)}>
              <Grid3X3 className={cn("h-4 w-4", showGrid && "text-accent")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setLighting(lighting === "day" ? "night" : "day")}
            >
              {lighting === "day" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 3D Viewer */}
      <div className="relative h-[calc(100vh-8rem)]">
        <Suspense fallback={<Loader />}>
          <Canvas shadows camera={{ position: [8, 6, 8], fov: 45 }} className="bg-background">
            <color attach="background" args={[lighting === "day" ? "#141414" : "#0a0a0a"]} />

            <ambientLight intensity={lighting === "day" ? 0.4 : 0.15} />
            <directionalLight
              position={[5, 10, 5]}
              intensity={lighting === "day" ? 1 : 0.3}
              castShadow
              shadow-mapSize={[2048, 2048]}
            />

            <PresentationControls
              global
              rotation={[0.1, 0.4, 0]}
              polar={[-0.4, 0.4]}
              azimuth={[-0.8, 0.8]}
              config={{ mass: 2, tension: 400 }}
              snap={{ mass: 4, tension: 400 }}
            >
              <Room />
            </PresentationControls>

            <ContactShadows position={[0, -0.49, 0]} opacity={0.4} blur={2} far={10} />

            {showGrid && <gridHelper args={[10, 10, "#333333", "#222222"]} position={[0, -0.48, 0]} />}

            <Environment preset={lighting === "day" ? "apartment" : "night"} />
            <OrbitControls
              enablePan={false}
              minPolarAngle={0.2}
              maxPolarAngle={Math.PI / 2 - 0.1}
              minDistance={5}
              maxDistance={15}
            />
          </Canvas>
        </Suspense>

        {/* Floating Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card/90 p-1.5 shadow-lg backdrop-blur-xl">
            <Button variant="ghost" size="sm" className="gap-2 rounded-full" onClick={onReset}>
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">New Design</span>
            </Button>
            <div className="h-6 w-px bg-border" />
            <Button variant="ghost" size="sm" className="gap-2 rounded-full">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 rounded-full">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-6 right-6 hidden lg:block">
          <div className="rounded-lg border border-border bg-card/90 p-3 text-xs text-muted-foreground backdrop-blur-xl">
            <p className="font-medium text-foreground mb-1">Controls</p>
            <p>Drag to rotate • Scroll to zoom</p>
          </div>
        </div>
      </div>
    </div>
  )
}
