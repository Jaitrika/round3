// frontend/src/components/FileList.js
import React, { useEffect, useState } from "react";

function FileList({ onSelect }) {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/list-files/");
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error("Could not fetch files", err);
    }
  };

  useEffect(() => {
    fetchFiles();
    // optionally poll every so often: setInterval(fetchFiles, 5000)
  }, []);

  return (
    <div style={{ padding: 12 }}>
      <h3>Uploaded PDFs</h3>
      <button onClick={fetchFiles}>Refresh list</button>
      <ul>
        {files.map((f, idx) => (
          <li key={idx}>
            <button onClick={() => onSelect(f.url)} style={{ marginRight: 8 }}>
              View
            </button>
            {f.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileList;
