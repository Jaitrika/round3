# Round3 Project

## Overview

It is a web-based application designed to provide insights and generate podcasts from uploaded PDF documents. The project integrates a React-based frontend with a FastAPI backend to deliver a seamless user experience. It leverages Adobe Embed API for document rendering and includes features like text selection, insights generation, and podcast creation.

## Features

- **PDF Upload and Viewing**: Upload PDF files and view them directly in the browser using Adobe PDF Viewer.
- **Text Selection**: Select text from the PDF for further processing.
- **Insights Generation**: Generate actionable insights based on the selected text.
- **Podcast Creation**: Create podcasts from the selected text with conversational scripts.
- **File Management**: Automatically cleans up uploaded files and generated outputs when the user exits the application.

## Project Structure

```
round3/
├── backend/
│   ├── main.py                # FastAPI backend logic
│   ├── tts_generator.py       # Text-to-speech generation logic
│   ├── brains_1b/             # Core processing logic
│   │   ├── custom_parser.py   # Custom parsing utilities
│   │   ├── r_1b.py            # Insights generation logic
│   │   └── bulb.py            # LLM interaction logic
│   ├── documents/             # Uploaded PDF files
│   ├── cache_embeddings/      # Cached embeddings for insights
│   └── output/                # Generated output files
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── App.js             # Main React application
│   │   └── output/            # Frontend output files
│   ├── public/                # Static assets
│   └── package.json           # Frontend dependencies
├── README.md                  # Project documentation
└── requirements.txt           # Backend dependencies
```

## Installation

### Option 1: Docker (Recommended)

1. Build the Docker image:

   ```bash
   docker build --platform linux/amd64 -t yourimageidentifier .
   ```

2. Run the application:

   ```bash
   docker run -v /path/to/credentials:/credentials \
     -e ADOBE_EMBED_API_KEY=<ADOBE_EMBED_API_KEY> \
     -e LLM_PROVIDER=gemini \
     -e GOOGLE_APPLICATION_CREDENTIALS=/credentials/adbe-gcp.json \
     -e GEMINI_MODEL=gemini-2.5-flash \
     -e TTS_PROVIDER=azure \
     -e AZURE_TTS_KEY=TTS_KEY \
     -e AZURE_TTS_ENDPOINT=TTS_ENDPOINT \
     -p 8080:8080 \
     yourimageidentifier
   ```

3. Access the application at: `http://localhost:8080`

4. To check Docker logs after starting:
   ```bash
   docker ps  # Get container ID
   docker logs <container_id>
   ```

### Option 2: Local Development

#### Backend Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   pip install -r ../requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

#### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```

## Usage

1. Open the application in your browser.
2. Upload a PDF file using the file uploader.
3. Select text from the PDF to generate insights or create a podcast.
4. Use the action buttons to view insights or listen to the generated podcast.

## References

- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://reactjs.org/)
- [Adobe PDF Viewer](https://www.adobe.io/apis/documentcloud/dcsdk/)
- [Sentence Transformers](https://www.sbert.net/)
