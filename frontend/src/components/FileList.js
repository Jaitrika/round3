// // frontend/src/components/FileList.js
// import React, { useEffect, useState } from "react";

// function FileList({ onSelect }) {
//   const [files, setFiles] = useState([]);

//   const fetchFiles = async () => {
//     try {
//       const res = await fetch("/list-files/");
//       const data = await res.json();
//       setFiles(data.files || []);
//     } catch (err) {
//       console.error("Could not fetch files", err);
//     }
//   };

//   useEffect(() => {
//     fetchFiles();
//     // optionally poll every so often: setInterval(fetchFiles, 5000)
//   }, []);

//   return (
//     <div style={{ padding: 12 }}>
//       <h3>Uploaded PDFs</h3>
//       <button onClick={fetchFiles}>Refresh list</button>
//       <ul>
//         {files.map((f, idx) => (
//           <li key={idx}>
//             <button onClick={() => onSelect(f.url)} style={{ marginRight: 8 }}>
//               View
//             </button>
//             {f.name}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default FileList;

// import React, { useEffect, useState } from "react";

// function FileList({ onSelect }) {
//   const [files, setFiles] = useState([]);
//   const [activeFile, setActiveFile] = useState(null); // 🔥 track selected file

//   const fetchFiles = async () => {
//     try {
//       const res = await fetch("/list-files/");
//       const data = await res.json();
//       setFiles(data.files || []);
//     } catch (err) {
//       console.error("Could not fetch files", err);
//     }
//   };

//   useEffect(() => {
//     fetchFiles();
//   }, []);

//   const handleView = (file) => {
//     setActiveFile(file.url); // set active
//     onSelect(file.url);      // pass to parent
//   };

//   return (
//     <div className="file-list">
//       <div className="header">
//         <h3 style={{ color: "#6a1cce" }}>Past Uploads</h3>
//         <button className="refresh-btn" onClick={fetchFiles}>
//           <img src="/refresh.png" alt="refresh" className="refresh-icon" />
//         </button>
//       </div>

//       <ul>
//         {files.map((f, idx) => (
//           <li
//             key={idx}
//             className={`file-item ${activeFile === f.url ? "active" : ""}`} // 🔥 conditional styling
//           >
//             {activeFile === f.url ? (
//               <span className="active-text">{f.name}</span> // 🔥 replace button with styled text
//             ) : (
//               <>
//                 <button
//                   className="view-btn"
//                   onClick={() => handleView(f)}
//                 >
//                   View
//                 </button>
//                 {f.name}
//               </>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default FileList;

import React, { useEffect, useState } from "react";

function FileList({ onSelect }) {
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);

  const fetchFiles = async () => {
    try {
      const res = await fetch("/list-files/");
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error("Could not fetch files", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleClick = (file) => {
    setActiveFile(file.url);
    onSelect(file.url);
  };

  return (
    <div className="file-list">
      <div className="header">
        <h3 style={{ color: "#6a1cce" }}>Past Uploads</h3>
        <button className="refresh-btn" onClick={fetchFiles}>
          <img src="/refresh.png" alt="refresh" className="refresh-icon" />
        </button>
      </div>

      <ul>
        {files.map((f, idx) => (
          <li
            key={idx}
            className={`file-item ${activeFile === f.url ? "active" : ""}`}
            onClick={() => handleClick(f)} // 🔥 entire box is clickable
            style={{ cursor: "pointer" }}
          >
            <span className={activeFile === f.url ? "active-text" : ""}>
              {f.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileList;
