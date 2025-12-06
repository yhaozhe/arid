"use client"

import { Suspense, useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, ContactShadows, PresentationControls, Text } from "@react-three/drei"
import { useAppStore } from "@/lib/store"
import type { RoomType, FurnitureItem } from "@/lib/types"

function Room() {
  const { getCurrentProject, showMeasurements, lighting } = useAppStore()
  const project = getCurrentProject()
  const version = project?.versions.find((v) => v.id === project.currentVersionId)
  const sceneConfig = version?.sceneConfig
  const furnitureItems = version?.furnitureItems || []
  const roomType = project?.roomType || "living-room"

  const isNight = lighting === "night"

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color={sceneConfig?.floorColor || "#1a1a1a"} />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 1.5, -4]} receiveShadow>
        <boxGeometry args={[8, 4, 0.2]} />
        <meshStandardMaterial color={sceneConfig?.wallColor || "#141414"} />
      </mesh>
      <mesh position={[-4, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[8, 4, 0.2]} />
        <meshStandardMaterial color={sceneConfig?.wallColor || "#141414"} />
      </mesh>

      {/* Window */}
      <group position={[0, 2, -3.85]}>
        <mesh>
          <boxGeometry args={[2.5, 1.8, 0.05]} />
          <meshStandardMaterial
            color={isNight && sceneConfig?.windowEmission ? "#1a2a3a" : "#0a1015"}
            emissive={isNight && sceneConfig?.windowEmission ? "#3a5060" : "#000000"}
            emissiveIntensity={isNight && sceneConfig?.windowEmission ? 0.5 : 0}
          />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[2.6, 0.05, 0.08]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0, 0.9, 0.03]}>
          <boxGeometry args={[2.6, 0.05, 0.08]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0, -0.9, 0.03]}>
          <boxGeometry args={[2.6, 0.05, 0.08]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>

      <DynamicFurniture
        items={furnitureItems}
        roomType={roomType}
        accentColor={sceneConfig?.accentColor || "#10b981"}
        isNight={isNight}
      />

      {showMeasurements && (
        <group>
          <Text position={[0, 0.1, 2]} fontSize={0.2} color="#666" anchorX="center">
            4.0m
          </Text>
          <Text position={[2, 0.1, -1]} fontSize={0.2} color="#666" rotation={[0, -Math.PI / 2, 0]} anchorX="center">
            4.0m
          </Text>
        </group>
      )}
    </group>
  )
}

function DynamicFurniture({
  items,
  roomType,
  accentColor,
  isNight,
}: {
  items: FurnitureItem[]
  roomType: RoomType
  accentColor: string
  isNight: boolean
}) {
  return (
    <group>
      {items.map((item) => {
        if (!item.visible) return null

        switch (item.category) {
          case "seating":
            if (item.name.includes("Sofa")) {
              return <Sofa key={item.id} position={item.position} color={item.color} accent={accentColor} />
            }
            if (item.name.includes("Armchair") || item.name.includes("Chair")) {
              return (
                <Chair
                  key={item.id}
                  position={item.position}
                  rotation={item.rotation}
                  color={item.color}
                  isOffice={item.name.includes("Office")}
                />
              )
            }
            break
          case "tables":
            if (item.name.includes("Coffee")) {
              return <CoffeeTable key={item.id} position={item.position} color={item.color} />
            }
            if (item.name.includes("Nightstand")) {
              return <Nightstand key={item.id} position={item.position} color={item.color} />
            }
            break
          case "lighting":
            return (
              <FloorLamp
                key={item.id}
                position={item.position}
                color={accentColor}
                scale={item.scale}
                isNight={isNight}
              />
            )
          case "plants":
            return <Plant key={item.id} position={item.position} scale={item.scale} />
          case "storage":
            if (item.name.includes("Bookshelf") || item.name.includes("Shelf")) {
              return <Bookshelf key={item.id} position={item.position} color={item.color} />
            }
            if (item.name.includes("TV")) {
              return <TVStand key={item.id} position={item.position} rotation={item.rotation} />
            }
            if (item.name.includes("Wardrobe")) {
              return <Wardrobe key={item.id} position={item.position} color={item.color} />
            }
            if (item.name.includes("Dresser")) {
              return <Dresser key={item.id} position={item.position} rotation={item.rotation} color={item.color} />
            }
            if (item.name.includes("Cabinet")) {
              return (
                <FilingCabinet key={item.id} position={item.position} rotation={item.rotation} color={item.color} />
              )
            }
            break
          case "decor":
            return <Rug key={item.id} position={item.position} color={item.color} scale={item.scale} />
          case "bed":
            return <Bed key={item.id} position={item.position} color={item.color} accent={accentColor} />
          case "desk":
            return <Desk key={item.id} position={item.position} color={item.color} />
        }
        return null
      })}
    </group>
  )
}

// Furniture components
function Sofa({ position, color, accent }: { position: [number, number, number]; color: string; accent: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[3, 0.6, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.7, -0.35]} castShadow>
        <boxGeometry args={[3, 0.8, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {[-0.8, 0, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 0.55, 0.1]} castShadow>
          <boxGeometry args={[0.8, 0.3, 0.7]} />
          <meshStandardMaterial color={accent} />
        </mesh>
      ))}
      <mesh position={[-1.4, 0.4, 0]} castShadow>
        <boxGeometry args={[0.2, 0.5, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[1.4, 0.4, 0]} castShadow>
        <boxGeometry args={[0.2, 0.5, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}

function Chair({
  position,
  rotation,
  color,
  isOffice,
}: { position: [number, number, number]; rotation: [number, number, number]; color: string; isOffice?: boolean }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.8, 0.1, 0.8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.8, -0.35]} castShadow>
        <boxGeometry args={[0.8, 0.7, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {[
        [-0.3, 0.3],
        [0.3, 0.3],
        [-0.3, -0.3],
        [0.3, -0.3],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.2, z]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
          <meshStandardMaterial color={isOffice ? "#0f0f0f" : "#1a1a1a"} />
        </mesh>
      ))}
      {isOffice && (
        <mesh position={[0, 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} />
          <meshStandardMaterial color="#0f0f0f" />
        </mesh>
      )}
    </group>
  )
}

function CoffeeTable({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.05, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.35, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  )
}

function FloorLamp({
  position,
  color,
  scale = [1, 1, 1],
  isNight,
}: { position: [number, number, number]; color: string; scale?: [number, number, number]; isNight: boolean }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.05, 32]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 2, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 2.1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.2, 0.4, 32, 1, true]} />
        <meshStandardMaterial
          color="#e8e0d8"
          side={2}
          emissive={isNight ? "#fff5e6" : "#000"}
          emissiveIntensity={isNight ? 0.3 : 0}
        />
      </mesh>
      <pointLight position={[0, 2, 0]} intensity={isNight ? 1 : 0.3} color="#fff5e6" distance={5} />
    </group>
  )
}

function Bookshelf({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[0.8, 2, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {[0.3, 0.9, 1.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0.05]} castShadow>
          <boxGeometry args={[0.7, 0.02, 0.25]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
      <mesh position={[-0.2, 0.55, 0]} castShadow>
        <boxGeometry args={[0.15, 0.4, 0.2]} />
        <meshStandardMaterial color="#7c3a3a" />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.1, 0.35, 0.18]} />
        <meshStandardMaterial color="#3a5a7c" />
      </mesh>
      <mesh position={[0.15, 0.52, 0]} castShadow>
        <boxGeometry args={[0.12, 0.38, 0.19]} />
        <meshStandardMaterial color="#4a7c4a" />
      </mesh>
    </group>
  )
}

function Plant({
  position,
  scale = [1, 1, 1],
}: { position: [number, number, number]; scale?: [number, number, number] }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.15, 0.4, 16]} />
        <meshStandardMaterial color="#3a2a18" />
      </mesh>
      <mesh position={[0, 0.6, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      <mesh position={[0.15, 0.75, 0.1]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>
    </group>
  )
}

function Rug({
  position,
  color,
  scale = [1, 1, 1],
}: { position: [number, number, number]; color: string; scale?: [number, number, number] }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[position[0], -0.48, position[2]]} scale={scale} receiveShadow>
      <planeGeometry args={[4, 3]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function TVStand({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[2, 0.5, 0.4]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[1.8, 1, 0.05]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
    </group>
  )
}

function Bed({ position, color, accent }: { position: [number, number, number]; color: string; accent: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[2.2, 0.3, 2.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[2, 0.2, 2.3]} />
        <meshStandardMaterial color="#e0d8d0" />
      </mesh>
      <mesh position={[-0.5, 0.7, -0.9]} castShadow>
        <boxGeometry args={[0.6, 0.15, 0.4]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh position={[0.5, 0.7, -0.9]} castShadow>
        <boxGeometry args={[0.6, 0.15, 0.4]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh position={[0, 1.2, -1.2]} castShadow>
        <boxGeometry args={[2.2, 1.2, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}

function Nightstand({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.15, 0.15]} castShadow>
        <boxGeometry args={[0.35, 0.12, 0.02]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
    </group>
  )
}

function Wardrobe({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[1.5, 2.2, 0.6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.1, 0.31]} castShadow>
        <boxGeometry args={[0.02, 1.8, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  )
}

function Dresser({
  position,
  rotation,
  color,
}: { position: [number, number, number]; rotation: [number, number, number]; color: string }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.2, 0.9, 0.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {[0.2, 0.5, 0.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0.26]} castShadow>
          <boxGeometry args={[1, 0.02, 0.02]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      ))}
    </group>
  )
}

function Desk({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[1.8, 0.05, 0.8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {[
        [-0.8, -0.3],
        [0.8, -0.3],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.35, z]} castShadow>
          <boxGeometry args={[0.05, 0.7, 0.05]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}
      <mesh position={[0, 1.1, -0.2]} castShadow>
        <boxGeometry args={[0.8, 0.5, 0.03]} />
        <meshStandardMaterial color="#0f0f0f" />
      </mesh>
      <mesh position={[0, 0.85, -0.2]} castShadow>
        <boxGeometry args={[0.1, 0.15, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  )
}

function FilingCabinet({
  position,
  rotation,
  color,
}: { position: [number, number, number]; rotation: [number, number, number]; color: string }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.5, 1.1, 0.6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {[0.25, 0.6, 0.95].map((y, i) => (
        <mesh key={i} position={[0, y, 0.31]} castShadow>
          <boxGeometry args={[0.35, 0.02, 0.02]} />
          <meshStandardMaterial color="#0f0f0f" />
        </mesh>
      ))}
    </group>
  )
}

function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent mx-auto" />
        <p className="text-sm text-muted-foreground">Loading 3D scene...</p>
      </div>
    </div>
  )
}

export function ViewerPanel() {
  const { lighting, showGrid, viewMode, viewMode3D } = useAppStore()

  const cameraPositions = useMemo(
    () => ({
      perspective: [8, 6, 8] as [number, number, number],
      top: [0, 12, 0] as [number, number, number],
      front: [0, 3, 10] as [number, number, number],
      side: [10, 3, 0] as [number, number, number],
    }),
    [],
  )

  const lightingConfig = useMemo(
    () => ({
      day: { ambient: 0.4, directional: 1, preset: "apartment" as const },
      night: { ambient: 0.1, directional: 0.2, preset: "night" as const },
      warm: { ambient: 0.35, directional: 0.8, preset: "sunset" as const },
      cool: { ambient: 0.4, directional: 0.9, preset: "dawn" as const },
    }),
    [],
  )

  const config = lightingConfig[lighting]

  const effectiveViewMode = viewMode3D === "blueprint" ? "top" : viewMode
  const cameraPosition = cameraPositions[effectiveViewMode]

  return (
    <div className="h-full relative">
      <Suspense fallback={<Loader />}>
        <Canvas
          shadows
          camera={{ position: cameraPosition, fov: viewMode3D === "blueprint" ? 35 : 45 }}
          className="bg-background"
        >
          <color attach="background" args={[lighting === "night" ? "#030305" : "#0a0a0c"]} />

          <ambientLight intensity={config.ambient} />
          <directionalLight
            position={[5, 10, 5]}
            intensity={config.directional}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />

          {viewMode3D === "immersive" ? (
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
          ) : (
            <Room />
          )}

          <ContactShadows position={[0, -0.49, 0]} opacity={0.4} blur={2} far={10} />

          {showGrid && <gridHelper args={[10, 10, "#222", "#181818"]} position={[0, -0.48, 0]} />}

          <Environment preset={config.preset} />
          <OrbitControls
            enablePan
            minPolarAngle={viewMode3D === "blueprint" ? 0 : 0.2}
            maxPolarAngle={viewMode3D === "blueprint" ? 0.1 : Math.PI / 2 - 0.1}
            minDistance={3}
            maxDistance={20}
          />
        </Canvas>
      </Suspense>

      {/* Hint badge */}
      <div className="absolute bottom-4 right-4 rounded-lg border border-border/40 bg-card/90 px-3 py-2 text-xs text-muted-foreground">
        Drag to rotate · Scroll to zoom
      </div>
    </div>
  )
}
