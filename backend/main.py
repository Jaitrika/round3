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
from fastapi import FastAPI, File, UploadFile, Request, BackgroundTasks
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
from brains_1b import r_1b, bulb
import tts_generator


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

# Global state for async processing
processing_status = {"is_processing": False, "status": "idle", "message": "", "result": None, "error": None}


# Add CORS headers for PDF files
@app.middleware("http")
async def add_pdf_cors_headers(request, call_next):
    response = await call_next(request)

    # Add CORS headers specifically for PDF files
    if request.url.path.startswith("/files/") and request.url.path.endswith(".pdf"):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, HEAD, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "*"
        response.headers["Cross-Origin-Resource-Policy"] = "cross-origin"
        response.headers["Cross-Origin-Embedder-Policy"] = "unsafe-none"

    return response


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

    saved_file_urls = [f"/files/{quote(name)}" for name in saved_files]

    return JSONResponse(
        {
            "message": "Upload complete",
            "saved_files": saved_file_urls,
            "skipped_files": skipped_files,
        }
    )


@app.get("/embeddings-status")
async def check_embeddings_status():
    """Check if embeddings cache exists and is up to date"""
    try:
        cache_file = CACHE_DIR / "embeddings.pkl"

        if not cache_file.exists():
            return {"embeddings_exist": False, "reason": "No cache file found"}

        # Check if we have PDF files
        pdf_files = [
            f
            for f in os.listdir(UPLOAD_DIR)
            if os.path.isfile(os.path.join(UPLOAD_DIR, f)) and f.lower().endswith(".pdf")
        ]

        if not pdf_files:
            return {"embeddings_exist": False, "reason": "No PDF files found"}

        # Check if cache is up to date by comparing file hashes
        from brains_1b.r_1b import md5_of_file

        current_hashes = {}
        for file in pdf_files:
            full_path = os.path.join(UPLOAD_DIR, file)
            try:
                current_hashes[file] = md5_of_file(full_path)
            except Exception:
                continue

        # Load cached hashes
        try:
            import pickle

            with open(cache_file, "rb") as f:
                cache_data = pickle.load(f)
            cached_hashes = cache_data.get("file_hashes", {})

            if cached_hashes == current_hashes:
                return {"embeddings_exist": True, "cache_valid": True, "files_count": len(pdf_files)}
            else:
                return {
                    "embeddings_exist": False,
                    "reason": "Cache outdated - files changed",
                    "files_count": len(pdf_files),
                }
        except Exception:
            return {"embeddings_exist": False, "reason": "Cache file corrupted"}

    except Exception as e:
        print(f"Error checking embeddings status: {e}")
        return {"embeddings_exist": False, "reason": f"Error: {str(e)}"}


@app.post("/generate-embeddings")
async def generate_embeddings():
    """Pre-generate embeddings for all uploaded PDFs to speed up future processing"""
    try:
        files = [
            f
            for f in os.listdir(UPLOAD_DIR)
            if os.path.isfile(os.path.join(UPLOAD_DIR, f)) and f.lower().endswith(".pdf")
        ]

        if not files:
            return {"error": "No PDF files found"}

        # Create a minimal input.json for embeddings generation
        input_data = {
            "documents": [{"filename": f, "title": os.path.splitext(f)[0]} for f in files],
            "selected_text": "sample text for embeddings generation",
        }

        with open(INPUT_FILE, "w") as f:
            json.dump(input_data, f, indent=4)

        # Call the core embeddings generation function
        print(f"Pre-generating embeddings for {len(files)} PDFs...")

        # Use r_1b.core() which handles caching properly
        r_1b.core()

        print("Embeddings generation completed using r_1b.core()")

        # Verify cache was created
        cache_file = CACHE_DIR / "embeddings.pkl"
        sections_count = 0
        if cache_file.exists():
            try:
                import pickle

                with open(cache_file, "rb") as f:
                    cache_data = pickle.load(f)
                sections_count = len(cache_data.get("all_sections", []))
            except Exception:
                sections_count = 0

        return {
            "message": f"Embeddings generated successfully for {len(files)} PDFs",
            "files_processed": files,
            "sections_count": sections_count,
        }

    except Exception as e:
        print(f"Error generating embeddings: {e}")
        return {"error": f"Failed to generate embeddings: {str(e)}"}


@app.get("/list-files/")
async def list_files():
    files = sorted([p.name for p in UPLOAD_DIR.iterdir() if p.is_file() and p.suffix.lower() == ".pdf"])
    return {"files": [{"name": name, "url": f"/files/{quote(name)}"} for name in files]}


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


# Global state for async processing
processing_status = {"is_processing": False, "status": "idle", "message": "", "result": None, "error": None}


# Background task for heavy processing
def process_analysis_background(selected_text: str):
    """Background task to process analysis without blocking the API"""
    global processing_status

    try:
        processing_status["is_processing"] = True
        processing_status["status"] = "processing"
        processing_status["message"] = "Analyzing documents..."
        processing_status["error"] = None

        print(f"Starting background analysis for text: {selected_text[:50]}...")

        # Call the heavy processing function
        r_1b.core()

        # Read the generated output.json
        output_file = ROOT_DIR / "output" / "output.json"
        if output_file.exists():
            with open(output_file, "r") as f:
                output_data = json.load(f)
            processing_status["result"] = output_data
            processing_status["status"] = "completed"
            processing_status["message"] = "Analysis completed successfully"
        else:
            processing_status["status"] = "completed"
            processing_status["message"] = "Analysis completed but no results generated"
            processing_status["result"] = None

    except Exception as e:
        print(f"Error in background processing: {e}")
        processing_status["status"] = "error"
        processing_status["error"] = str(e)
        processing_status["message"] = f"Analysis failed: {str(e)}"
    finally:
        processing_status["is_processing"] = False


# ------------------------
# Save input (now non-blocking)
# ------------------------
@app.post("/save-input")
async def save_input(request: Request, background_tasks: BackgroundTasks):
    data = await request.json()
    persona = data.get("persona", "")
    job = data.get("job", "")
    selected_text = data.get("selected_text", "")

    # Get all PDF files from the upload directory
    try:
        files = [
            f
            for f in os.listdir(UPLOAD_DIR)
            if os.path.isfile(os.path.join(UPLOAD_DIR, f)) and f.lower().endswith(".pdf")
        ]
        print(f"Found {len(files)} PDF files in {UPLOAD_DIR}: {files}")
    except Exception as e:
        print(f"Error listing files in {UPLOAD_DIR}: {e}")
        return {"error": "Could not access documents folder"}

    if not files:
        print("No PDF files found in documents folder")
        return {"error": "No PDF files found"}

    input_data = {
        "documents": [{"filename": f, "title": os.path.splitext(f)[0]} for f in files],
        "selected_text": selected_text,
    }

    with open(INPUT_FILE, "w") as f:
        json.dump(input_data, f, indent=4)

    print(f"Saved input data to: {INPUT_FILE}")
    print(f"Documents folder location: {UPLOAD_DIR}")
    print(f"Input data: {input_data}")

    # Start processing in background (non-blocking)
    background_tasks.add_task(process_analysis_background, selected_text)

    return {
        "message": "Analysis started in background",
        "status": "processing",
        "processing_id": "current",  # Simple ID for now
    }


# ------------------------
# Check processing status
# ------------------------
@app.get("/processing-status")
async def get_processing_status():
    """Get the current status of background processing"""
    return processing_status


@app.post("/reset-processing-status")
async def reset_processing_status():
    """Reset processing status (for debugging stuck states)"""
    global processing_status
    processing_status = {"is_processing": False, "status": "idle", "message": "", "result": None, "error": None}
    return {"message": "Processing status reset"}


# ------------------------
# Generate podcast
# ------------------------
@app.post("/generate-podcast")
async def generate_podcast(request: Request):
    # Get selected text from request or use cached insights
    data = await request.json()
    selected_text = data.get("selected_text", "")

    if not selected_text:
        return {"error": "No selected text provided for podcast generation"}

    print(f"Generating podcast for selected text: {selected_text[:100]}...")

    # Try to get evidence from insights, but don't fail if not available
    evidence_for_gemini = ""
    try:
        evidence_for_gemini, _, _ = r_1b.get_evidence_for_insights()
    except Exception as e:
        print(f"Could not get evidence for insights: {e}")
        evidence_for_gemini = "No additional context available."

    gemini_prompt = f"""You are an AI assistant helping users create a podcast script based on their selected text.

Selected text: "{selected_text}"
Related content: {evidence_for_gemini}

Generate a podcast script with two speakers (Speaker 1 and Speaker 2) discussing the selected text. The podcast should be less than 1 minute. Alternate between the speakers and ensure the script is engaging and conversational. Use the following format:

Speaker 1: [Text]
Speaker 2: [Text]

Keep the script concise and focused on the selected text. Make sure each speaker says at least 2-3 sentences."""

    messages = [{"role": "user", "content": gemini_prompt}]
    script_response = bulb.get_llm_response(messages)

    # Convert script to conversation with voices
    conversation = []
    voices = ["en+m1", "en+f2"]  # Male and female voices
    speaker_index = 0

    print(f"Script response from Gemini: {script_response}")

    for line in script_response.splitlines():
        if line.startswith("Speaker 1:") or line.startswith("Speaker 2:"):
            text = line.split(":", 1)[1].strip()
            if text:  # Only add non-empty text
                conversation.append({"text": text, "voice": voices[speaker_index % len(voices)]})
                speaker_index += 1

    print(f"Parsed conversation: {conversation}")

    if not conversation:
        # Fallback conversation if parsing failed
        conversation = [
            {"text": "Welcome to our podcast about your selected text.", "voice": "en+m1"},
            {"text": "Today we're discussing some interesting content from your documents.", "voice": "en+f2"},
            {"text": "Let's dive into the key points you've highlighted.", "voice": "en+m1"},
        ]
        print("Using fallback conversation due to parsing failure")

    try:
        podcast_file = UPLOAD_DIR / "podcast.mp3"
        tts_generator.generate_conversation_tts(conversation, str(podcast_file))
        return FileResponse(podcast_file, media_type="audio/mpeg", filename="podcast.mp3")
    except Exception as e:
        print(f"Error generating podcast: {e}")
        return {"error": f"Failed to generate podcast: {str(e)}"}


# Serve frontend build - MUST be last to avoid catching API routes
frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "build")
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
