from fastapi import FastAPI, File, UploadFile, Request, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from pathlib import Path
from typing import List
from urllib.parse import quote
import os, glob
from pydantic import BaseModel
from brains_1b import custom_parser
from brains_1b import r_1b, bulb
from tts_generator import generate_conversation_tts
from sentence_transformers import SentenceTransformer
import json
import shutil

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

UPLOAD_DIR = Path(__file__).parent / "documents"
# root dir (same as this script’s directory)
ROOT_DIR = Path(__file__).parent
CACHE_DIR = ROOT_DIR / "cache_embeddings"
@app.post("/cleanup-on-exit")
async def cleanup_on_exit():
    deleted = []

    # 1. Delete all files inside UPLOAD_DIR (documents/)
    if UPLOAD_DIR.exists():
        for file in UPLOAD_DIR.glob("*"):  # matches everything inside documents/
            if file.is_file():  # only remove files, not subfolders
                try:
                    os.remove(file)
                    deleted.append(str(file))
                except Exception as e:
                    print(f"Failed to delete {file}: {e}")

    # 2. Delete all .mp3 files in ROOT_DIR
    if CACHE_DIR.exists() and CACHE_DIR.is_dir():
        try:
            shutil.rmtree(CACHE_DIR)
            deleted.append(str(CACHE_DIR))
        except Exception as e:
            print(f"Failed to delete folder {CACHE_DIR}: {e}")

    # 3. Delete input.json and output.json
    input_file = ROOT_DIR / "input" / "input.json"
    output_file = ROOT_DIR / "output" / "output.json"

    for file in [input_file, output_file]:
        if file.exists():
            try:
                os.remove(file)
                deleted.append(str(file))
            except Exception as e:
                print(f"Failed to delete {file}: {e}")

    # 4. Delete output.json in frontend/src/output
    frontend_dir = ROOT_DIR / "../frontend"
    output_dir_frontend = frontend_dir / "src" / "output" / "output.json"

    if output_dir_frontend.exists():
        try:
            os.remove(output_dir_frontend)
            deleted.append(str(output_dir_frontend))
        except Exception as e:
            print(f"Failed to delete {output_dir_frontend}: {e}")

    print("Deleted files:", deleted)
    return {"deleted": deleted}
# OUTPUT_DIR = ROOT_DIR / "output"
# INPUT_DIR = ROOT_DIR / "input"
# @app.post("/cleanup-on-exit")
# async def cleanup_on_exit():
#     deleted = []
#     # 1. Delete all files inside UPLOAD_DIR (documents/)
#     if UPLOAD_DIR.exists():
#         for file in UPLOAD_DIR.glob("*"):  # matches everything inside documents/
#             if file.is_file():  # only remove files, not subfolders
#                 try:
#                     os.remove(file)
#                     deleted.append(str(file))
#                 except Exception as e:
#                     print(f"Failed to delete {file}: {e}")
#     if OUTPUT_DIR.exists():
#         for file in UPLOAD_DIR.glob("*"):  # matches everything inside documents/
#             if file.is_file():  # only remove files, not subfolders
#                 try:
#                     os.remove(file)
#                     deleted.append(str(file))
#                 except Exception as e:
#                     print(f"Failed to delete {file}: {e}")
#     if INPUT_DIR.exists():
#         for file in UPLOAD_DIR.glob("*"):  # matches everything inside documents/
#             if file.is_file():  # only remove files, not subfolders
#                 try:
#                     os.remove(file)
#                     deleted.append(str(file))
#                 except Exception as e:
#                     print(f"Failed to delete {file}: {e}")
    
#     # 2. Delete all .mp3 files in ROOT_DIR
#     if CACHE_DIR.exists() and CACHE_DIR.is_dir():
#         try:
#             shutil.rmtree(CACHE_DIR)
#             deleted.append(str(CACHE_DIR))
#         except Exception as e:
#             print(f"Failed to delete folder {CACHE_DIR}: {e}")
#     print("delllll", deleted)

#     return {"deleted": deleted}

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


INPUT_FILE = Path(__file__).parent / "input" / "input.json"
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

# @app.post("/generate-audio/")
# async def generate_audio_endpoint(text: str = Form(...), voice: str = Form(None)):
#     output_file = "output.mp3"
#     try:
#         conversation = [
#     {"text": "Hello, welcome to our podcast!", "voice": "en+m1"},  # male voice
#     {"text": "Hi! I'm excited to join today.", "voice": "en+f2"},  # female voice
#     {"text": "Let's dive into the topic.", "voice": "en+m2"},
# ]
#         generate_conversation_tts(conversation, "testingpls.mp3")
#         return FileResponse(output_file, media_type="audio/mpeg", filename="testingpls.mp3")
#     except Exception as e:
#         return {"error": str(e)}

@app.post("/generate-podcast")
async def generate_podcast(request: Request):
    # Parse the selected text from the request
    # data = await request.json()
    # selected_text = data.get("selected_text", "")
    evidence_for_gemini, selected_text, evidence_nuggets = r_1b.get_evidence_for_insights()
    print("generatinggg")
    # Create prompt for Gemini to generate podcast script
    gemini_prompt = f"""You are an AI assistant helping users create a podcast script based on their selected text.

    Selected text: "{selected_text}"
    Related content {evidence_for_gemini}

    Generate a podcast script with two speakers (Speaker 1 and Speaker 2) discussing the selected text. The podcast should be of less than 1 minutes. Alternate between the speakers and ensure the script is engaging and conversational. Use the following format:

    Speaker 1: [Text]
    Speaker 2: [Text]

    Keep the script concise and focused on the selected text."""

    messages = [{"role": "user", "content": gemini_prompt}]
    script_response = bulb.get_llm_response(messages)

    # Parse the script into a conversation format
    conversation = []
    voices = ["en+m1", "en+f2"]  # Male and female voices
    conversation = []
    speaker_index = 0
    for line in script_response.splitlines():
        if line.startswith("Speaker 1:") or line.startswith("Speaker 2:"):
            text = line.split(":", 1)[1].strip()
            conversation.append({
                "text": text,
                "voice": voices[speaker_index % len(voices)]
            })
            speaker_index += 1

    print("done with script")
    # Generate the podcast
    podcast_file = UPLOAD_DIR / "podcast.mp3"
    generate_conversation_tts(conversation, str(podcast_file))
    print("done with recording")
    return FileResponse(
        podcast_file, 
        media_type="audio/mpeg", 
        filename="podcast.mp3"
    )
