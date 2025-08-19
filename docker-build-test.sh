#!/bin/bash

# Test script for Docker build and run
echo "Testing Docker build..."

# Build the Docker image
echo "Building Docker image..."
docker build --platform linux/amd64 -t yourimageidentifier .

if [ $? -eq 0 ]; then
    echo "✅ Docker build successful!"
    
    echo "Testing Docker run..."
    # Test run command (replace with actual environment variables)
    docker run -d \
        -v /path/to/credentials:/credentials \
        -e ADOBE_EMBED_API_KEY=<ADOBE_EMBED_API_KEY> \
        -e LLM_PROVIDER=gemini \
        -e GOOGLE_APPLICATION_CREDENTIALS=/credentials/adbe-gcp.json \
        -e GEMINI_MODEL=gemini-2.5-flash \
        -e TTS_PROVIDER=azure \
        -e AZURE_TTS_KEY=TTS_KEY \
        -e AZURE_TTS_ENDPOINT=TTS_ENDPOINT \
        -p 8080:8080 \
        yourimageidentifier
    
    if [ $? -eq 0 ]; then
        echo "✅ Docker run successful!"
        echo "Application should be accessible at http://localhost:8080"
        echo "Check docker logs with: docker logs <container_id>"
    else
        echo "❌ Docker run failed"
        exit 1
    fi
else
    echo "❌ Docker build failed"
    exit 1
fi
