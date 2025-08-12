import React, { useState } from "react";

function App() {
  const [files, setFiles] = useState([]);
  const [uploadResult, setUploadResult] = useState(null);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setUploadResult(data);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>PDF Uploader</h2>

      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
        Upload
      </button>

      {uploadResult && (
        <div style={{ marginTop: "20px" }}>
          {uploadResult.saved_files?.length > 0 && (
            <div>
              <strong>✅ Uploaded:</strong>
              <ul>
                {uploadResult.saved_files.map((file, idx) => (
                  <li key={idx}>{file}</li>
                ))}
              </ul>
            </div>
          )}

          {uploadResult.skipped_files?.length > 0 && (
            <div>
              <strong>⚠️ Skipped (already exists):</strong>
              <ul>
                {uploadResult.skipped_files.map((file, idx) => (
                  <li key={idx}>{file}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
