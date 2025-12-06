# Backend API Specification for ARID Frontend

This document explains exactly what the frontend expects from the backend so the Backend/ML engineers can implement their part without guessing.

The goal: **Input = floor plan image + prompt, Output = public `.glb` URL** that the frontend can load in a 3D viewer.

---

## 1. High-Level Flow

1. User uploads a floor plan image and writes a text prompt.
2. Frontend sends `POST /api/generate` with `multipart/form-data`:
   - `file`: the image
   - `prompt`: the text description
3. Backend runs the full pipeline:
   - YOLOv8 segmentation → wall/door/window mask.
   - Builder script (OpenCV + Shapely + Trimesh) → 3D walls.
   - LLM (GPT-4o / Gemini) → furniture placement JSON.
   - Assembles assets (e.g. `bed.glb`, `sofa.glb`) into a full `scene.glb`.
4. Backend uploads `scene.glb` to some storage and returns a **public URL**.
5. Frontend stores that URL on the current project and loads it using `useGLTF` inside a React-Three-Fiber `<Canvas>`.

---

## 2. Main Endpoint Contract

### 2.1. URL and Method

- **Frontend URL**: `"/api/generate"`
- **Backend URL**: suggested `"/generate"` (FastAPI)
- **HTTP Method**: `POST`
- **Content-Type**: `multipart/form-data`

In production, `/api/generate` can be:
- A Next.js route that **proxies** to the FastAPI backend, or
- Directly pointed to the FastAPI URL (e.g. `https://backend.example.com/generate`).

### 2.2. Request Body (what frontend sends)

Form-data fields:

- `file` (required)
  - The uploaded floor plan image from the user.
  - Content types to support:
    - `image/png`
    - `image/jpeg`
    - `image/jpg`
    - `image/webp`

- `prompt` (optional but usually present)
  - Type: string
  - The natural language description of the desired room (style, mood, furniture, etc.).

Example pseudocode from the frontend (`components/upload-section.tsx`):

```ts
const formData = new FormData()
formData.append("file", file)
formData.append("prompt", prompt)

const res = await fetch("/api/generate", {
  method: "POST",
  body: formData,
})
```

### 2.3. Success Response (what backend must return)

The frontend expects **JSON** like this on success:

```json
{
  "projectId": "string-unique-id",
  "name": "optional-human-readable-name",
  "roomType": "living-room",
  "stylePreset": "modern",
  "glbUrl": "https://your-storage/scene.glb"
}
```

Field details:

- `projectId` (string, required)
  - Unique ID for this design session (e.g. UUID v4).
  - Frontend uses this as `Project.id`.

- `name` (string, optional)
  - Human-readable name for the project.
  - If empty, the frontend will fall back to using `prompt` or `"Untitled Design"`.

- `roomType` (string, required)
  - Must be one of these values (matches `RoomType` in `lib/types.ts`):
    - `"living-room"`
    - `"bedroom"`
    - `"kitchen"`
    - `"bathroom"`
    - `"office"`
    - `"dining-room"`

- `stylePreset` (string, required)
  - Must be one of these values (matches `StylePreset` in `lib/types.ts`):
    - `"modern"`
    - `"minimalist"`
    - `"industrial"`
    - `"scandinavian"`
    - `"bohemian"`
    - `"traditional"`

- `glbUrl` (string, required)
  - A **public HTTP(S) URL** to the generated `.glb` scene.
  - This URL is used directly by `useGLTF(glbUrl)` in the React frontend.
  - Must be accessible from the browser and properly served as a static file.

### 2.4. Error Response

On failure (validation error, ML error, etc.):

- Return a **non-2xx** HTTP status (e.g. `400`, `422`, `500`).
- Body should be JSON with an `error` message:

```json
{ "error": "Human readable error message" }
```

The frontend shows this message in an error banner under the upload card.

---

## 3. How the Frontend Uses the Response

When the response is OK, frontend does roughly this (simplified):

```ts
const data = await res.json()

const project: Project = {
  id: data.projectId,
  name: data.name || prompt.slice(0, 30) || "Untitled Design",
  description: prompt,
  initialPrompt: prompt,
  floorPlanImage: previewBase64,
  chatHistory: [],
  versions: [],
  currentVersionId: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  roomType: data.roomType,
  stylePreset: data.stylePreset,
  aiAnalysis: undefined,
  glbUrl: data.glbUrl,
}

addProject(project)
setCurrentProjectId(project.id)
setAppState("processing")
```

Then, after a short animated "processing" screen, the app switches to the workspace view:

- `ViewerPanel` checks `project.glbUrl`:
  - If present, it renders `<GeneratedModel url={project.glbUrl} />`.
  - `GeneratedModel` uses `useGLTF(glbUrl)` to load and display the 3D scene in a `<Canvas>`.
  - If `glbUrl` is missing, it falls back to a procedural demo scene.

---

## 4. Suggested FastAPI Endpoint Implementation (Skeleton)

Below is a **skeleton** FastAPI implementation matching the frontend contract.
It omits the actual ML steps, but shows where to plug YOLO, Trimesh, and LLM.

```python
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uuid
import os

app = FastAPI()

# Update this to your frontend origin in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["https://your-frontend.domain"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "/tmp/arid_uploads"
SCENE_DIR = "/tmp/arid_scenes"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(SCENE_DIR, exist_ok=True)

@app.post("/generate")
async def generate(
    file: UploadFile = File(...),
    prompt: str = Form("")
):
    # 1) Validate file type
    if file.content_type not in ["image/png", "image/jpeg", "image/jpg", "image/webp"]:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    # 2) Save uploaded image to disk
    image_id = str(uuid.uuid4())
    input_path = os.path.join(UPLOAD_DIR, f"{image_id}.png")
    with open(input_path, "wb") as f:
        f.write(await file.read())

    # TODO: 3) Run YOLOv8 segmentation to produce wall mask
    # mask_path = run_yolo_and_save_mask(input_path)

    # TODO: 4) Call LLM (GPT-4o / Gemini) to get furniture layout JSON
    # layout = call_llm_for_layout(room_size, prompt, room_type, furniture_list)

    # TODO: 5) Run builder script with OpenCV + Shapely + Trimesh
    # scene_glb_path = run_builder(mask_path, layout, assets_dir, SCENE_DIR)

    # For now, assume you produced a GLB file at scene_glb_path
    scene_id = str(uuid.uuid4())
    scene_glb_path = os.path.join(SCENE_DIR, f"{scene_id}.glb")

    # TODO: 6) Upload scene_glb_path to a public storage (S3/GCS/etc.) and get URL
    glb_url = "https://your-storage.example.com/scenes/" + f"{scene_id}.glb"

    # TODO: 7) Derive roomType & stylePreset from analysis (for now, hardcode)
    room_type = "living-room"   # must be a valid RoomType
    style_preset = "modern"      # must be a valid StylePreset

    project_id = str(uuid.uuid4())

    return {
        "projectId": project_id,
        "name": "",  # optional: you can fill from analysis or prompt
        "roomType": room_type,
        "stylePreset": style_preset,
        "glbUrl": glb_url,
    }
```

You can replace all `TODO` sections with real calls to:

- YOLOv8 (`ultralytics`)
- OpenCV (`cv2`)
- Shapely + Trimesh
- OpenAI/Gemini SDKs
- Cloud storage SDK (S3, GCS, Supabase, etc.)

---

## 5. Non-Functional Requirements for Backend

To make frontend integration smooth:

1. **CORS**
   - Ensure the frontend origin can call the backend.
   - In dev, `allow_origins=["*"]` is OK; in prod, restrict to your domain.

2. **File Size Limits**
   - Define a max upload size (e.g. 5–10MB) and return a clear error message if exceeded.

3. **Timeouts**
   - ML pipeline can be heavy; try to keep total request time reasonable (< 20–30s for hackathon).
   - If it becomes too slow, consider:
     - Kicking off a background job
     - Returning a job ID
     - Frontend polls a `/status` endpoint (not implemented yet).

4. **GLB Validity**
   - Test one generated `.glb` using online glTF viewers.
   - Ensure the coordinate system and scale make sense for the camera settings used in the frontend.

5. **Stable JSON Shape**
   - Always return the same keys on success: `projectId`, `roomType`, `stylePreset`, `glbUrl` (and `name` if you want).
   - Always return `{ "error": "..." }` on failure.

---

## 6. Quick Test Commands (for Backend)

Once your FastAPI server is running at `http://localhost:8000`, you can test it with `curl`:

```bash
curl -X POST \
  -F "file=@/path/to/floorplan.png" \
  -F "prompt=Modern cozy living room with big sofa" \
  http://localhost:8000/generate
```

Expected response shape:

```json
{
  "projectId": "...",
  "name": "...",
  "roomType": "living-room",
  "stylePreset": "modern",
  "glbUrl": "https://.../scene.glb"
}
```

Once this works, the frontend (this repo) will automatically:

1. Create a project in its store.
2. Show a processing screen.
3. Navigate to the workspace.
4. Load `glbUrl` with `useGLTF` and render the 3D room.

That’s all the backend needs to implement to be fully compatible with this frontend.
