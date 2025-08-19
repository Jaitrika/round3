# # backend/main.py
# from fastapi import FastAPI, File, UploadFile, Request
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.staticfiles import StaticFiles
# from fastapi.responses import JSONResponse, FileResponse
# from pathlib import Path
# from typing import List
# from urllib.parse import quote
# import os
# from pydantic import BaseModel
# # from backend.brains_1b import custom_parser
# from .brains_1b import r_1b
# # from dotenv import load_dotenv
# import json
# from .brains_1b import bulb
# from sentence_transformers import SentenceTransformer
# app = FastAPI()
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # In dev: allow all origin
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# ADOBE_CLIENT_ID = os.getenv("ADOBE_CLIENT_ID")

# # @app.get("/adobe-client-id")
# # def get_adobe_client_id():
# #     return {"clientId": ADOBE_CLIENT_ID}


# # Use documents folder inside backend directory
# UPLOAD_DIR = Path(__file__).parent / "documents"
# UPLOAD_DIR.mkdir(exist_ok=True)

# # Serve static files from /files/<filename>
# app.mount("/files", StaticFiles(directory=UPLOAD_DIR), name="files")


# @app.post("/upload/")
# async def upload(files: List[UploadFile] = File(...)):
#     saved_files = []
#     skipped_files = []

#     for file in files:
#         dest = UPLOAD_DIR / file.filename
#         if dest.exists():
#             skipped_files.append(file.filename)
#         else:
#             with open(dest, "wb") as f:
#                 f.write(await file.read())
#             saved_files.append(file.filename)

#     # return full URL-encoded URLs for saved files
#     saved_file_urls = [
#         f"http://127.0.0.1:8000/files/{quote(name)}" for name in saved_files
#     ]

#     return JSONResponse(
#         {
#             "message": "Upload complete",
#             "saved_files": saved_file_urls,     # full URLs (for immediate viewing)
#             "skipped_files": skipped_files,    # names of skipped files
#         }
#     )

# @app.get("/list-files/")
# async def list_files():
#     files = sorted([p.name for p in UPLOAD_DIR.iterdir() if p.is_file()])
#     file_objs = [
#         {"name": name, "url": f"http://127.0.0.1:8000/files/{quote(name)}"}
#         for name in files
#     ]
#     return {"files": file_objs}

# class InsightsRequest(BaseModel):
#     text: str

# # @app.post("/insights")
# # async def get_insights(req: InsightsRequest):
# #     messages = [{"role": "user", "content": req.text}]
# #     response = bulb.get_llm_response(messages)
# #     return {"insight": response}

# @app.post("/insights") 
# async def get_insights(req: InsightsRequest):
#     # Get everything we need in one call
#     evidence_for_gemini, selected_text, evidence_nuggets = r_1b.get_evidence_for_insights()
    
#     # Create prompt and get response
#     gemini_prompt = f"""You are an AI assistant helping users discover connections and insights from their uploaded documents.

#     Selected text: "{selected_text}"

#     Related content from your documents:
#     {evidence_for_gemini}

#     Based on the selected text and related content, provide helpful insights such as:
#     - Similar or contrasting information found in other documents
#     - Additional details, examples, or context that enhance understanding
#     - Interesting connections or patterns across documents
#     - Related facts or information that might be useful
#     - Questions or topics this might lead you to explore further

#     Keep your insights:
#     - Based only on the provided documents (cite document names when relevant)
#     - Practical and easy to understand
#     - Focused on what adds value to your understanding of the selected text

#     Provide specific, actionable insights rather than generic observations."""

#     messages = [{"role": "user", "content": gemini_prompt}]
#     response = bulb.get_llm_response(messages)
#     return {"insight": response}

# # Use input folder inside backend directory
# INPUT_FILE = Path(__file__).parent / "input" / "input.json"
# # Create input directory if it doesn't exist
# Path(INPUT_FILE).parent.mkdir(exist_ok=True)
# @app.post("/save-input")
# async def save_input(request: Request):
#     # Parse JSON body directly
#     data = await request.json()
#     persona = data.get("persona", "")
#     job = data.get("job", "")
#     selected_text = data.get("selected_text", "")

#     # List uploaded files in uploads folder
#     files = [
#         f for f in os.listdir(UPLOAD_DIR)
#         if os.path.isfile(os.path.join(UPLOAD_DIR, f))
#     ]

#     # Create JSON structure
#     input_data = {
        
#         "documents": [
#             {
#                 "filename": f,
#                 "title": os.path.splitext(f)[0]
#             }
#             for f in files
#         ],
        
#         "selected_text": selected_text
#     }
#     # Save to input.json
#     with open(INPUT_FILE, "w") as f:
#         json.dump(input_data, f, indent=4)
    
#     print(f"Saved input data to: {INPUT_FILE}")
#     print(f"Documents folder location: {UPLOAD_DIR}")
    
#     r_1b.core()
#     return {"message": "Input data saved successfully!"}
# backend/main.py
from fastapi import FastAPI, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from pathlib import Path
from typing import List
from urllib.parse import quote
import os
import shutil
from pydantic import BaseModel
import json

# Import your custom modules
from .brains_1b import r_1b, bulb,tts_generator


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In dev: allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ADOBE_CLIENT_ID = os.getenv("ADOBE_CLIENT_ID")

# Directories
ROOT_DIR = Path(__file__).parent
UPLOAD_DIR = ROOT_DIR / "documents"
UPLOAD_DIR.mkdir(exist_ok=True)
INPUT_FILE = ROOT_DIR / "input" / "input.json"
Path(INPUT_FILE).parent.mkdir(exist_ok=True)
CACHE_DIR = ROOT_DIR / "cache_embeddings"

# Serve uploaded files
app.mount("/files", StaticFiles(directory=UPLOAD_DIR), name="files")

# ------------------------
# File upload & listing
# ------------------------
@app.post("/upload/")
async def upload(files: List[UploadFile] = File(...)):
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

    saved_file_urls = [
        f"http://127.0.0.1:8000/files/{quote(name)}" for name in saved_files
    ]

    return JSONResponse(
        {
            "message": "Upload complete",
            "saved_files": saved_file_urls,
            "skipped_files": skipped_files,
        }
    )

@app.get("/list-files/")
async def list_files():
    files = sorted([p.name for p in UPLOAD_DIR.iterdir() if p.is_file() and p.suffix.lower() == ".pdf"])
    return {
        "files": [
            {"name": name, "url": f"http://127.0.0.1:8000/files/{quote(name)}"}
            for name in files
        ]
    }

# ------------------------
# Cleanup on exit
# ------------------------
@app.post("/cleanup-on-exit")
async def cleanup_on_exit():
    deleted = []

    # Delete all files inside documents/
    if UPLOAD_DIR.exists():
        for file in UPLOAD_DIR.glob("*"):
            if file.is_file():
                try:
                    os.remove(file)
                    deleted.append(str(file))
                except Exception as e:
                    print(f"Failed to delete {file}: {e}")

    # Delete cache folder
    if CACHE_DIR.exists() and CACHE_DIR.is_dir():
        try:
            shutil.rmtree(CACHE_DIR)
            deleted.append(str(CACHE_DIR))
        except Exception as e:
            print(f"Failed to delete folder {CACHE_DIR}: {e}")

    print("Deleted:", deleted)
    return {"deleted": deleted}

# ------------------------
# Insights generation
# ------------------------
class InsightsRequest(BaseModel):
    text: str

@app.post("/insights") 
async def get_insights(req: InsightsRequest):
    evidence_for_gemini, selected_text, evidence_nuggets = r_1b.get_evidence_for_insights()
    
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

# ------------------------
# Save input
# ------------------------
@app.post("/save-input")
async def save_input(request: Request):
    data = await request.json()
    persona = data.get("persona", "")
    job = data.get("job", "")
    selected_text = data.get("selected_text", "")

    files = [
        f for f in os.listdir(UPLOAD_DIR)
        if os.path.isfile(os.path.join(UPLOAD_DIR, f))
    ]

    input_data = {
        "documents": [{"filename": f, "title": os.path.splitext(f)[0]} for f in files],
        "selected_text": selected_text
    }

    with open(INPUT_FILE, "w") as f:
        json.dump(input_data, f, indent=4)
    
    print(f"Saved input data to: {INPUT_FILE}")
    print(f"Documents folder location: {UPLOAD_DIR}")
    
    r_1b.core()
    return {"message": "Input data saved successfully!"}

# ------------------------
# Generate podcast
# ------------------------
@app.post("/generate-podcast")
async def generate_podcast(request: Request):
    evidence_for_gemini, selected_text, evidence_nuggets = r_1b.get_evidence_for_insights()

    gemini_prompt = f"""You are an AI assistant helping users create a podcast script based on their selected text.

Selected text: "{selected_text}"
Related content {evidence_for_gemini}

Generate a podcast script with two speakers (Speaker 1 and Speaker 2) discussing the selected text. The podcast should be of less than 1 minutes. Alternate between the speakers and ensure the script is engaging and conversational. Use the following format:

Speaker 1: [Text]
Speaker 2: [Text]

Keep the script concise and focused on the selected text."""

    messages = [{"role": "user", "content": gemini_prompt}]
    script_response = bulb.get_llm_response(messages)

    # Convert script to conversation with voices
    conversation = []
    voices = ["en+m1", "en+f2"]  # Male and female voices
    speaker_index = 0
    for line in script_response.splitlines():
        if line.startswith("Speaker 1:") or line.startswith("Speaker 2:"):
            text = line.split(":", 1)[1].strip()
            conversation.append({"text": text, "voice": voices[speaker_index % len(voices)]})
            speaker_index += 1

    podcast_file = UPLOAD_DIR / "podcast.mp3"
    tts_generator.generate_conversation_tts(conversation, str(podcast_file))
    return FileResponse(
        podcast_file, 
        media_type="audio/mpeg", 
        filename="podcast.mp3"
    )
