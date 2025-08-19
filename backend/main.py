# backend/main.py
from fastapi import FastAPI, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from pathlib import Path
from typing import List
from urllib.parse import quote
import os
from pydantic import BaseModel
# from backend.brains_1b import custom_parser
from .brains_1b import r_1b
# from dotenv import load_dotenv
import json
from .brains_1b import bulb
from sentence_transformers import SentenceTransformer
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In dev: allow all origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve frontend build
frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "build")
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")

# Example API endpoint
@app.get("/api/hello")
def hello():
    return {"message": "Hello from backend!"}

ADOBE_CLIENT_ID = os.getenv("ADOBE_CLIENT_ID")

# @app.get("/adobe-client-id")
# def get_adobe_client_id():
#     return {"clientId": ADOBE_CLIENT_ID}


# Use documents folder inside backend directory
UPLOAD_DIR = Path(__file__).parent / "documents"
UPLOAD_DIR.mkdir(exist_ok=True)

# Serve static files from /files/<filename>
app.mount("/files", StaticFiles(directory=UPLOAD_DIR), name="files")


@app.post("/upload/")
async def upload(request: Request, files: List[UploadFile] = File(...)):
    saved_files = []
    skipped_files = []

    for file in files:
        dest = UPLOAD_DIR / file.filename
        if dest.exists():
            skipped_files.append(file.filename)
        else:
            with open(dest, "wb") as f:
                f.write(await file.read())
            saved_files.append(file.filename)

    # return full URL-encoded URLs for saved files
    base_url = str(request.base_url)  # e.g. "http://localhost:8080/"
    # saved_file_urls = [
    #     f"http://127.0.0.1:8000/files/{quote(name)}" for name in saved_files
    # ]
    saved_file_urls = [
        f"{base_url}files/{quote(name)}" for name in saved_files
    ]

    return JSONResponse(
        {
            "message": "Upload complete",
            "saved_files": saved_file_urls,     # full URLs (for immediate viewing)
            "skipped_files": skipped_files,    # names of skipped files
        }
    )

# @app.get("/list-files/")
# async def list_files():
#     files = sorted([p.name for p in UPLOAD_DIR.iterdir() if p.is_file()])
#     file_objs = [
#         {"name": name, "url": f"http://127.0.0.1:8000/files/{quote(name)}"}
#         for name in files
#     ]
#     return {"files": file_objs}
@app.get("/list-files/")
async def list_files(request: Request):
    files = sorted([p.name for p in UPLOAD_DIR.iterdir() if p.is_file()])
    base_url = str(request.base_url)  # adapts automatically to 127.0.0.1:8000, localhost:8080, etc.
    
    file_objs = [
        {"name": name, "url": f"{base_url}files/{quote(name)}"}
        for name in files
    ]
    return {"files": file_objs}

class InsightsRequest(BaseModel):
    text: str

# @app.post("/insights")
# async def get_insights(req: InsightsRequest):
#     messages = [{"role": "user", "content": req.text}]
#     response = bulb.get_llm_response(messages)
#     return {"insight": response}

@app.post("/insights") 
async def get_insights(req: InsightsRequest):
    # Get everything we need in one call
    evidence_for_gemini, selected_text, evidence_nuggets = r_1b.get_evidence_for_insights()
    
    # Create prompt and get response
    gemini_prompt = f"""You are an AI assistant helping users discover connections and insights from their uploaded documents.

    Selected text: "{selected_text}"

    Related content from your documents:
    {evidence_for_gemini}

    Based on the selected text and related content, provide helpful insights such as:
    - Similar or contrasting information found in other documents
    - Additional details, examples, or context that enhance understanding
    - Interesting connections or patterns across documents
    - Related facts or information that might be useful
    - Questions or topics this might lead you to explore further

    Keep your insights:
    - Based only on the provided documents (cite document names when relevant)
    - Practical and easy to understand
    - Focused on what adds value to your understanding of the selected text

    Provide specific, actionable insights rather than generic observations."""

    messages = [{"role": "user", "content": gemini_prompt}]
    response = bulb.get_llm_response(messages)
    return {"insight": response}

# Use input folder inside backend directory
INPUT_FILE = Path(__file__).parent / "input" / "input.json"
# Create input directory if it doesn't exist
Path(INPUT_FILE).parent.mkdir(exist_ok=True)
@app.post("/save-input")
async def save_input(request: Request):
    # Parse JSON body directly
    data = await request.json()
    persona = data.get("persona", "")
    job = data.get("job", "")
    selected_text = data.get("selected_text", "")

    # List uploaded files in uploads folder
    files = [
        f for f in os.listdir(UPLOAD_DIR)
        if os.path.isfile(os.path.join(UPLOAD_DIR, f))
    ]

    # Create JSON structure
    input_data = {
        
        "documents": [
            {
                "filename": f,
                "title": os.path.splitext(f)[0]
            }
            for f in files
        ],
        
        "selected_text": selected_text
    }
    # Save to input.json
    with open(INPUT_FILE, "w") as f:
        json.dump(input_data, f, indent=4)
    
    print(f"Saved input data to: {INPUT_FILE}")
    print(f"Documents folder location: {UPLOAD_DIR}")
    
    r_1b.core()
    return {"message": "Input data saved successfully!"}