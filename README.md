# PDF Insights & Podcast Generator

## Overview

A powerful web-based application that transforms PDF documents into actionable insights and conversational podcasts. Built with React frontend and FastAPI backend, featuring AI-powered analysis using Google Gemini and advanced document processing capabilities.

## Features

- **Smart PDF Viewer**: Upload and view PDFs with Adobe Embed API integration
- **Intelligent Text Selection**: Select any text for AI-powered analysis
- **AI-Powered Insights**: Generate contextual insights using Google Gemini 2.5 Flash
- **Podcast Generation**: Create conversational podcasts from selected content
- **Performance Optimized**: Automatic embedding preloading for instant responses
- **Smart Caching**: Intelligent caching system for faster subsequent operations
- **Real-time Processing**: Background processing with live status updates

## Quick Start (Docker - Recommended)

### Prerequisites

- Docker installed on your system
- Adobe Embed API Key 
- Google API Key with Gemini access 

### 1. Build & Run

```bash
# Build the Docker image
docker build --platform linux/amd64 \
  --build-arg REACT_APP_ADOBE_EMBED_API_KEY=fe1b11d2eeb245a6bfb854a1ff276c5c \
  -t pdf-insights-app .

# Run the container
docker run -d \
  -e ADOBE_EMBED_API_KEY=fe1b11d2eeb245a6bfb854a1ff276c5c \
  -e LLM_PROVIDER=gemini \
  -e GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY_HERE \
  -e GEMINI_MODEL=gemini-2.5-flash \
  -e TTS_PROVIDER=azure \
  -e AZURE_TTS_KEY=dummy \
  -e AZURE_TTS_ENDPOINT=dummy \
  -p 8080:8080 \
  pdf-insights-app
```

### 2. Access Application

Open your browser and navigate to: **http://localhost:8080**

## Environment Variables

| Variable                        | Required | Description                      | Example                                   |
| ------------------------------- | -------- | -------------------------------- | ----------------------------------------- |
| `REACT_APP_ADOBE_EMBED_API_KEY` | Yes      | Adobe Embed API Key (build-time) | `fe1b11d2eeb245a6bfb854a1ff276c5c`        |
| `ADOBE_EMBED_API_KEY`           | Yes      | Adobe Embed API Key (runtime)    | `fe1b11d2eeb245a6bfb854a1ff276c5c`        |
| `GOOGLE_API_KEY`                | Yes      | Google API Key for Gemini        | `randomstringapikey1234567890`            |
| `LLM_PROVIDER`                  | Yes      | LLM provider (use "gemini")      | `gemini`                                  |
| `GEMINI_MODEL`                  | Yes      | Gemini model version             | `gemini-2.5-flash`                        |
| `TTS_PROVIDER`                  | No       | Text-to-speech provider          | `azure`                                   |
| `AZURE_TTS_KEY`                 | No       | Azure TTS API key                | `your_azure_key`                          |
| `AZURE_TTS_ENDPOINT`            | No       | Azure TTS endpoint               | `your_azure_endpoint`                     |

## How to Use

### Step 1: Upload PDFs

1. Click "Choose Files" or drag & drop PDF files
2. Wait for "Upload complete" message
3. **Note**: First-time setup will show "Processing PDFs..." - this is normal!

### Step 2: Select a PDF

1. Choose a PDF from the file list
2. The PDF will load in the viewer
3. **Background processing**: Embeddings are generated automatically

### Step 3: Generate Insights

1. **Select text** in the PDF by highlighting it
2. Wait for "Relevant Sections" to appear (usually instant after first load)
3. Click **"Generate Insights"** button
4. View AI-generated insights in the sidebar

### Step 4: Create Podcast

1. With text still selected, click **"Generate Podcast"**
2. Wait for generation (30-60 seconds)
3. Audio will auto-play when ready

## Important Operational Notes

### First Load Performance

- **First PDF upload**: Takes 1-3 minutes for initial processing
- **Embedding generation**: Happens automatically in background
- **Subsequent operations**: Nearly instant due to caching
- **Progress indicators**: Look for "Processing PDFs..." messages

### Performance Optimization

- **Automatic preloading**: Embeddings generated after PDF upload
- **Smart caching**: File hash-based cache invalidation
- **Background processing**: Heavy operations don't block UI
- **Status polling**: Real-time updates every 1 second

### Troubleshooting

#### "No text selected" error

- Ensure you've highlighted text in the PDF
- Wait for "Relevant Sections" to appear first

#### Slow first-time experience

- **Normal behavior**: First analysis takes time
- **Check console**: Look for "Embeddings generated" messages
- **Be patient**: Subsequent operations will be fast

#### PDF not loading

- Verify Adobe API key is correct
- Check browser console for errors
- Try refreshing the page

#### Insights not generating

- Ensure Google API key has Gemini access
- Check if relevant sections appeared first
- Verify text selection is not empty

### File Management

- **Auto-cleanup**: Files cleaned when browser closes
- **Cache persistence**: Embeddings cached between sessions
- **File validation**: Only PDF files accepted
- **Hash checking**: Automatic detection of file changes

## Development Setup

### Backend Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
cd backend
pip install -r ../requirements.txt

# Set environment variables
export GOOGLE_API_KEY=your_key_here
export LLM_PROVIDER=gemini
export GEMINI_MODEL=gemini-2.5-flash

# Start server
uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
# Install dependencies
cd frontend
npm install

# Set environment variables
export REACT_APP_ADOBE_EMBED_API_KEY=your_key_here

# Start development server
npm start

```

## Technologies Used

- **Frontend**: React 18, Adobe PDF Embed API
- **Backend**: FastAPI, Python 3.11
- **AI**: Google Gemini 2.5 Flash, Sentence Transformers
- **Processing**: spaCy, PyMuPDF, scikit-learn
- **Deployment**: Docker, multi-stage builds
- **Caching**: Pickle-based embedding cache with hash validation
