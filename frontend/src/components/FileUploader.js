// // frontend/src/components/FileUploader.js
// import React, { useState } from "react";

// function FileUploader({ onUploadComplete }) {
//   const [files, setFiles] = useState([]);
//   const [uploadResult, setUploadResult] = useState(null);

//   const handleFileChange = (e) => {
//     setFiles(Array.from(e.target.files));
//   };

//   const handleUpload = async () => {
//     if (files.length === 0) return;
//     const formData = new FormData();
//     files.forEach((f) => formData.append("files", f));

//     try {
//       const res = await fetch("http://127.0.0.1:8000/upload/", {
//         method: "POST",
//         body: formData,
//       });
//       const data = await res.json();
//       setUploadResult(data);
//       if (data.saved_files && data.saved_files.length > 0 && onUploadComplete) {
//         // pass the first saved file URL to parent so it can be viewed
//         onUploadComplete(data.saved_files[0]);
//       }
//     } catch (err) {
//       console.error("Upload failed", err);
//     }
//   };

//   return (
//     <div style={{ padding: 12 }}>
//       <h3>Upload PDFs</h3>
//       <input type="file" accept="application/pdf" multiple onChange={handleFileChange} />
//       <button onClick={handleUpload} style={{ marginLeft: 8 }}>Upload</button>

//       {uploadResult && (
//         <div style={{ marginTop: 12 }}>
//           <div>
//             <strong>Saved URLs:</strong>
//             <ul>
//               {uploadResult.saved_files?.map((url, i) => (
//                 <li key={i}><a href={url} target="_blank" rel="noreferrer">{url}</a></li>
//               ))}
//             </ul>
//           </div>

//           <div>
//             <strong>Skipped (already existed):</strong>
//             <ul>
//               {uploadResult.skipped_files?.map((name, i) => (<li key={i}>{name}</li>))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default FileUploader;
import React, { useState } from "react";

function FileUploader({ onUploadComplete }) {
  const [files, setFiles] = useState([]);
  const [uploadResult, setUploadResult] = useState(null);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    try {
      // const res = await fetch("http://127.0.0.1:8000/upload/", {
      //   method: "POST",
      //   body: formData,
      // });
      const res = await fetch("/upload/", {
      method: "POST",
      body: formData,
      });

      const data = await res.json();
      setUploadResult(data);
      if (data.saved_files && data.saved_files.length > 0 && onUploadComplete) {
        // pass the first saved file URL to parent so it can be viewed
        onUploadComplete(data.saved_files[0]);
      }
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <div className="upload-section">
      <h3 style={{ color:"#6a1cce"}}>Upload PDFs</h3>

      <div className="file-input-container">
        <input 
          type="file" 
          accept="application/pdf" 
          multiple 
          onChange={handleFileChange} 
        />
      </div>
      <button className="upload-btn" onClick={handleUpload}>
        Upload
      </button>
      
      {uploadResult && (
        <div className="upload-results">
          <div>
            <strong>Saved URLs:</strong>
            <ul>
              {uploadResult.saved_files?.map((url, i) => (
                <li key={i}>
                  <a href={url} target="_blank" rel="noreferrer">{url}</a>
                </li>
              ))}
            </ul>
          </div>
          {/* <div>
            <strong>Skipped (already existed):</strong>
            <ul>
              {uploadResult.skipped_files?.map((name, i) => (
                <li key={i}>{name}</li>
              ))}
            </ul>
          </div> */}
        </div>
      )}
    </div>
  );
}

export default FileUploader;
