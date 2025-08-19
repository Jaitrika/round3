// frontend/src/App.js
// import React, { useState } from "react";
// import FileUploader from "./components/FileUploader";
// import FileList from "./components/FileList";
// import PDFViewer from "./components/PDFViewer";
// import PersonaJobForm from "./components/PersonaJobForm"; 

// function App() {
//   const [selectedUrl, setSelectedUrl] = useState(null);
//   const ADOBE_CLIENT_ID = "fe1b11d2eeb245a6bfb854a1ff276c5c"; 

//   return (
   
//     <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 12 }}>
//       <div>
//         {/* Persona + Job form at the top */}
//         <PersonaJobForm />

//         <hr style={{ margin: "12px 0" }} />

//         {/* File uploader + list */}
//         <FileUploader onUploadComplete={(url) => setSelectedUrl(url)} />
//         <FileList onSelect={(url) => setSelectedUrl(url)} />
//       </div>
//       <div>
//         {selectedUrl ? (
//           <PDFViewer fileUrl={selectedUrl} clientId={ADOBE_CLIENT_ID} />
//         ) : (
//           <div style={{ padding: 20 }}>
//             No PDF selected. Upload or choose from the list.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;

// import React, { useState, useEffect } from "react";
// import FileUploader from "./components/FileUploader";
// import FileList from "./components/FileList";
// import PDFViewer from "./components/PDFViewer";

// function App() {
//   const [selectedUrl, setSelectedUrl] = useState(null);
//   const [adobeClientId, setAdobeClientId] = useState(null);

//   useEffect(() => {
//     // Fetch Adobe client ID from backend
//     fetch("http://127.0.0.1:8000/adobe-client-id")
//       .then((res) => res.json())
//       .then((data) => setAdobeClientId(data.clientId))
//       .catch((err) => console.error("Failed to load Adobe Client ID", err));
//   }, []);

//   if (!adobeClientId) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 12 }}>
//       <div>
//         <FileUploader onUploadComplete={(url) => setSelectedUrl(url)} />
//         <FileList onSelect={(url) => setSelectedUrl(url)} />
//       </div>

//       <div>
//         {selectedUrl ? (
//           <PDFViewer fileUrl={selectedUrl} clientId={adobeClientId} />
//         ) : (
//           <div style={{ padding: 20 }}>
//             No PDF selected. Upload or choose from the list.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

//export default App;
// import React, { useState } from "react";
// import FileUploader from "./components/FileUploader";
// import FileList from "./components/FileList";
// import PDFViewer from "./components/PDFViewer";
// import PersonaJobForm from "./components/PersonaJobForm";
// import analysis from "../../backend/output/output.json"; // this has subsection_analysis

// function App() {
//   const [selectedUrl, setSelectedUrl] = useState(null);
//   const [jumpCommand, setJumpCommand] = useState(null);
//   const ADOBE_CLIENT_ID = "fe1b11d2eeb245a6bfb854a1ff276c5c";

//   return (
//     <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 12 }}>
//       <div>
//         <PersonaJobForm />
//         <hr style={{ margin: "12px 0" }} />

//         <FileUploader onUploadComplete={(url) => setSelectedUrl(url)} />
//         <FileList onSelect={(url) => setSelectedUrl(url)} />

//         {analysis.subsection_analysis?.map((sec, idx) => (
//           <button
//             key={idx}
//             style={{ display: "block", marginTop: 8 }}
//             onClick={() =>
//               setJumpCommand({ page: sec.page, text: sec.text })
//             }
//           >
//             Go to {sec.section}
//           </button>
//         ))}
//       </div>

//       <div>
//         {selectedUrl ? (
//           <PDFViewer
//             fileUrl={selectedUrl}
//             clientId={ADOBE_CLIENT_ID}
//             jumpCommand={jumpCommand}
//           />
//         ) : (
//           <div style={{ padding: 20 }}>
//             No PDF selected. Upload or choose from the list.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;
import React, { useState, useEffect } from "react";
import FileUploader from "./components/FileUploader";
import FileList from "./components/FileList";
import PDFViewer from "./components/PDFViewer";
import analysis from "./output/output.json";
import "./App.css";

function App() {
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [jumpCommand, setJumpCommand] = useState(null);
  const ADOBE_CLIENT_ID = "fe1b11d2eeb245a6bfb854a1ff276c5c";

  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log("Sending cleanup request...");
      try {
        const success = navigator.sendBeacon("http://127.0.0.1:8000/cleanup-on-exit");
        console.log("Cleanup request sent successfully:", success);
      } catch (e) {
        console.error("sendBeacon failed, falling back to fetch:", e);
        fetch("http://127.0.0.1:8000/cleanup-on-exit", { method: "POST" })
          .then(() => console.log("Cleanup request sent via fetch."))
          .catch((err) => console.error("Fetch cleanup request failed:", err));
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  return (
    <div className="App">
      <div className="main-container">
        <div className="content-grid">
          <div className="sidebar">
            <FileUploader 
              onUploadComplete={(url) => {
                setSelectedUrl(url);
                setJumpCommand(null); // Reset jump command for normal viewing
              }} 
            />
            <FileList 
              onSelect={(url) => {
                setSelectedUrl(url);
                setJumpCommand(null); // Reset jump command for normal viewing
              }} 
            />
            <div className="section-buttons">
              {analysis.subsection_analysis?.map((sec, idx) => {
                const sectionData = analysis.extracted_sections[idx];
                
                return (
                  <button
                    key={idx}
                    className="section-btn"
                    onClick={() => {
                      // // Ensure clean path without any double slashes
                      // const cleanDocName = sectionData.document.replace(/^\/+|\/+$/g, '');
                      // const documentUrl = `http://127.0.0.1:8000/files/${cleanDocName}`;
                      // console.log("Setting URL:", documentUrl);
                      // setSelectedUrl(documentUrl);
                      // Here sectionData.document should already be a full URL if you return it that way from backend
                      //Build full URL if backend only returned filename
                      const documentUrl = sectionData.document.startsWith("http")
                        ? sectionData.document
                        : `${window.location.origin}/files/${sectionData.document}`;

                      console.log("Setting URL:", documentUrl);
                      setSelectedUrl(documentUrl);
                      
                      // Add a small delay before setting the jump command
                      setTimeout(() => {
                        const jumpData = {
                          page: sectionData.page_number,
                          text: sec.refined_text?.trim()
                        };
                        console.log("Setting jump command:", jumpData);
                        setJumpCommand(jumpData);
                      }, 1000);
                    }}
                  >
                    Go to {sectionData.section_title}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="pdf-container">
            {selectedUrl ? (
              <PDFViewer
                fileUrl={selectedUrl}
                clientId={ADOBE_CLIENT_ID}
                jumpCommand={jumpCommand}
              />
            ) : (
              <div className="placeholder-text">
                No PDF selected. Upload or choose from the list.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

// newwww
// import React, { useState, useEffect } from "react";
// import FileUploader from "./components/FileUploader";
// import FileList from "./components/FileList";
// import PDFViewer from "./components/PDFViewer";
// import analysis from "./output/output.json";
// import "./App.css";

// function App() {
//   const [selectedUrl, setSelectedUrl] = useState(null);
//   const [jumpCommand, setJumpCommand] = useState(null);
//   const ADOBE_CLIENT_ID = "fe1b11d2eeb245a6bfb854a1ff276c5c";

//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       navigator.sendBeacon("http://127.0.0.1:8000/cleanup-on-exit");
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);

//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, []); // empty deps → runs only once on mount/unmount

//   return (
//     <div className="App">
//       <div className="main-container">
//         <div className="content-grid">
//           <div className="sidebar">
//             <FileUploader
//               onUploadComplete={(url) => {
//                 setSelectedUrl(url);
//                 setJumpCommand(null);
//               }}
//             />
//             <FileList
//               onSelect={(url) => {
//                 setSelectedUrl(url);
//                 setJumpCommand(null);
//               }}
//             />

//             <div className="section-buttons">
//               {analysis.subsection_analysis?.map((sec, idx) => {
//                 const sectionData = analysis.extracted_sections[idx];
//                 return (
//                   <button
//                     key={idx}
//                     className="section-btn"
//                     onClick={() => {
//                       const cleanDocName = sectionData.document.replace(
//                         /^\/+|\/+$/g,
//                         ""
//                       );
//                       const documentUrl = `http://127.0.0.1:8000/files/${cleanDocName}`;
//                       setSelectedUrl(documentUrl);

//                       setTimeout(() => {
//                         setJumpCommand({
//                           page: sectionData.page_number,
//                           text: sec.refined_text?.trim(),
//                         });
//                       }, 1000);
//                     }}
//                   >
//                     Go to {sectionData.section_title}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           <div className="pdf-container">
//             {selectedUrl ? (
//               <PDFViewer
//                 fileUrl={selectedUrl}
//                 clientId={ADOBE_CLIENT_ID}
//                 jumpCommand={jumpCommand}
//               />
//             ) : (
//               <div className="placeholder-text">
//                 No PDF selected. Upload or choose from the list.
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

// // frontend/src/App.js
// import React, { useState } from "react";
// import FileUploader from "./components/FileUploader";
// import FileList from "./components/FileList";
// import PDFViewer from "./components/PDFViewer";
// import PersonaJobForm from "./components/PersonaJobForm"; 

// function App() {
//   const [selectedUrl, setSelectedUrl] = useState(null);
//   const ADOBE_CLIENT_ID = "fe1b11d2eeb245a6bfb854a1ff276c5c"; 

//   return (
//     <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 12 }}>
//       <div>
//         {/* Persona + Job form at the top */}
//         <PersonaJobForm />

//         <hr style={{ margin: "12px 0" }} />

//         {/* File uploader + list */}
//         <FileUploader onUploadComplete={(url) => setSelectedUrl(url)} />
//         <FileList onSelect={(url) => setSelectedUrl(url)} />
//       </div>

//       <div>
//         {selectedUrl ? (
//           <PDFViewer fileUrl={selectedUrl} clientId={ADOBE_CLIENT_ID} />
//         ) : (
//           <div style={{ padding: 20 }}>
//             No PDF selected. Upload or choose from the list.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;
