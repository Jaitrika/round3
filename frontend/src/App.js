// frontend/src/App.js
import React, { useState } from "react";
import FileUploader from "./components/FileUploader";
import FileList from "./components/FileList";
import PDFViewer from "./components/PDFViewer";
import PersonaJobForm from "./components/PersonaJobForm"; 

function App() {
  const [selectedUrl, setSelectedUrl] = useState(null);
  const ADOBE_CLIENT_ID = "fe1b11d2eeb245a6bfb854a1ff276c5c"; 

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 12 }}>
      <div>
        {/* Persona + Job form at the top */}
        <PersonaJobForm />

        <hr style={{ margin: "12px 0" }} />

        {/* File uploader + list */}
        <FileUploader onUploadComplete={(url) => setSelectedUrl(url)} />
        <FileList onSelect={(url) => setSelectedUrl(url)} />
      </div>

      <div>
        {selectedUrl ? (
          <PDFViewer fileUrl={selectedUrl} clientId={ADOBE_CLIENT_ID} />
        ) : (
          <div style={{ padding: 20 }}>
            No PDF selected. Upload or choose from the list.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

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
