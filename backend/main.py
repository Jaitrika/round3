# backend/main.py
from fastapi import FastAPI, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pathlib import Path
from typing import List
from urllib.parse import quote
import os
# from backend.brains_1b import custom_parser
from .brains_1b import r_1b
# from dotenv import load_dotenv
import json
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In dev: allow all origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

    # return full URL-encoded URLs for saved files
    saved_file_urls = [
        f"http://127.0.0.1:8000/files/{quote(name)}" for name in saved_files
    ]

    return JSONResponse(
        {
            "message": "Upload complete",
            "saved_files": saved_file_urls,     # full URLs (for immediate viewing)
            "skipped_files": skipped_files,    # names of skipped files
        }
    )

@app.get("/list-files/")
async def list_files():
    files = sorted([p.name for p in UPLOAD_DIR.iterdir() if p.is_file()])
    file_objs = [
        {"name": name, "url": f"http://127.0.0.1:8000/files/{quote(name)}"}
        for name in files
    ]
    return {"files": file_objs}

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

    # List uploaded files in uploads folder
    files = [
        f for f in os.listdir(UPLOAD_DIR)
        if os.path.isfile(os.path.join(UPLOAD_DIR, f))
    ]

    # Create JSON structure
    input_data = {
        
        "challenge_info": {
            "challenge_id": "round_1b_001",
            "test_case_name": "menu_planning",
            "description": "Dinner menu planning"
        },
        "documents": [
            {
                "filename": f,
                "title": os.path.splitext(f)[0]
            }
            for f in files
        ],
        "persona": {
        "role": persona
    },
    "job_to_be_done": {
        "task": job
    }
    }
    # Save to input.json
    with open(INPUT_FILE, "w") as f:
        json.dump(input_data, f, indent=4)
    
    print(f"Saved input data to: {INPUT_FILE}")
    print(f"Documents folder location: {UPLOAD_DIR}")
    
    r_1b.core()
    return {"message": "Input data saved successfully!"}
