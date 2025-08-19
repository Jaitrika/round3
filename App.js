// import React, { useState } from "react";
// import FileUploader from "./components/FileUploader";
// import FileList from "./components/FileList";
// import PDFViewer from "./components/PDFViewer";
// import analysis from "./output/output.json";
// import "./App.css";

// function App() {
//   const [selectedUrl, setSelectedUrl] = useState(null);
//   const [jumpCommand, setJumpCommand] = useState(null);
//   const [isMenuMode, setIsMenuMode] = useState(false);
//   const [relevantSections, setRelevantSections] = useState([]);
//   const [activeSectionIdx, setActiveSectionIdx] = useState(null); // ✅ new state
//   const [originalPdfUrl, setOriginalPdfUrl] = useState(null);

//   const [allSections] = useState(
//     analysis.subsection_analysis?.map((sec, idx) => {
//       const sectionData = analysis.extracted_sections[idx];
//       return { sec, sectionData, originalIdx: idx };
//     }) || []
//   );

//   const ADOBE_CLIENT_ID = "fe1b11d2eeb245a6bfb854a1ff276c5c";

//   const handleSectionClick = (sectionData, sec, idx) => {
//     const cleanDocName = sectionData.document.replace(/^\/+|\/+$/g, '');
//     const documentUrl = http://127.0.0.1:8000/files/${cleanDocName};
//     console.log("Setting URL:", documentUrl);
//     setSelectedUrl(documentUrl);

//     // ✅ mark this section active
//     setActiveSectionIdx(idx);

//     setTimeout(() => {
//       const jumpData = {
//         page: sectionData.page_number,
//         text: sec.refined_text?.trim()
//       };
//       console.log("Setting jump command:", jumpData);
//       setJumpCommand(jumpData);
//     }, 1000);
//   };

//   const handleTextSelection = (selectedText) => {
//     if (selectedText && selectedText.trim()) {
//   const relevant = allSections.filter(({ sec }) => {
//     const sectionText = sec.refined_text?.toLowerCase() || '';
//     const searchText = selectedText.toLowerCase();
//     return sectionText.includes(searchText) || searchText.includes(sectionText.substring(0, 50));
//   });

//   setRelevantSections(relevant);
//   setIsMenuMode(true);
//   setActiveSectionIdx(null);

//   // ✅ Save current PDF as original
//   if (selectedUrl) setOriginalPdfUrl(selectedUrl);
// } else {
//   setIsMenuMode(false);
//   setRelevantSections([]);
//   setActiveSectionIdx(null);
// }
//   };

//   const toggleMenuMode = () => {
//     setIsMenuMode(!isMenuMode);
//   };
//   const handleRestoreOriginal = () => {
//   if (originalPdfUrl) {
//     setSelectedUrl(originalPdfUrl);   // restore original PDF
//     setActiveSectionIdx(null);        // remove purple highlight
//   }
// };

//   return (
//     <div className="App">
//       <div className="main-container">
//         <div className={content-grid ${isMenuMode ? 'menu-mode' : ''}}>
//           <div className={sidebar ${isMenuMode ? 'sidebar-hidden' : ''}}>
//             <FileUploader onUploadComplete={(url) => {
//   setSelectedUrl(url);
//   setOriginalPdfUrl(url);
//   setJumpCommand(null);
//   setActiveSectionIdx(null);
// }} />

//             <FileList onSelect={(url) => {
//   setSelectedUrl(url);
//   setOriginalPdfUrl(url); // ✅ set original PDF here
//   setJumpCommand(null);
//   setActiveSectionIdx(null);
// }} />

//           </div>

//           <div className={pdf-container ${isMenuMode ? 'pdf-expanded' : ''}}>
//   {selectedUrl ? (
//     <>
//       <PDFViewer
//         fileUrl={selectedUrl}
//         clientId={ADOBE_CLIENT_ID}
//         jumpCommand={jumpCommand}
//         onTextSelection={handleTextSelection}
//       />
//       {originalPdfUrl && selectedUrl !== originalPdfUrl && (
//   <button className="restore-btn" onClick={handleRestoreOriginal}>
//     Restore Original PDF
//   </button>
// )}

//     </>
//   ) : (
//     <div className="placeholder-text">
//       No PDF selected. Upload or choose from the list.
//     </div>
//   )}
// </div>

//           <div className={relevant-sections ${isMenuMode ? 'relevant-sections-visible' : ''}}>
//             <div className="relevant-sections-header">
//               <h3>Relevant Sections</h3>
//               <button className="toggle-menu-btn" onClick={toggleMenuMode}>
//                 <span className="arrow-icon">{'←'}</span>
//               </button>
//             </div>

//             <div className="relevant-sections-content">
//               {relevantSections.length > 0 ? (
//                 relevantSections.map(({ sec, sectionData, originalIdx }) => (
//                   <button
//                     key={originalIdx}
//                     className={relevant-section-btn ${activeSectionIdx === originalIdx ? "active" : ""}}
//                     onClick={() => handleSectionClick(sectionData, sec, originalIdx)}
//                   >
//                     <div className="section-title">{sectionData.section_title}</div>
//                     <div className="section-preview">
//                       {sec.refined_text?.substring(0, 100)}...
//                     </div>
//                   </button>
//                 ))
//               ) : (
//                 <div className="no-sections">
//                   {allSections.length > 0 ? (
//                     <>
//                       {/* <h4 style={{ color: '#6a1cce', marginBottom: '15px' }}>All Document Sections</h4> */}
//                       {allSections.map(({ sec, sectionData, originalIdx }) => (
//                         <button
//                           key={originalIdx}
//                           className={relevant-section-btn ${activeSectionIdx === originalIdx ? "active" : ""}}
//                           onClick={() => handleSectionClick(sectionData, sec, originalIdx)}
//                         >
//                           <div className="section-title">{sectionData.section_title}</div>
//                           <div className="section-preview">
//                             {sec.refined_text?.substring(0, 100)}...
//                           </div>
//                         </button>
//                       ))}
//                     </>
//                   ) : (
//                     "Select text in the PDF to see relevant sections"
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
// import React, { useState, useEffect } from "react";
// import FileUploader from "./components/FileUploader";
// import FileList from "./components/FileList";
// import PDFViewer from "./components/PDFViewer";
// import analysis from "./output/output.json";
// import "./App.css";

// function App() {
//   const [selectedUrl, setSelectedUrl] = useState(null);
//   const [jumpCommand, setJumpCommand] = useState(null);
//   const [isMenuMode, setIsMenuMode] = useState(false);
//   const [relevantSections, setRelevantSections] = useState([]);
//   const [activeSectionIdx, setActiveSectionIdx] = useState(null);
//   const [originalPdfUrl, setOriginalPdfUrl] = useState(null);

//   const [allSections] = useState(
//     analysis.subsection_analysis?.map((sec, idx) => {
//       const sectionData = analysis.extracted_sections[idx];
//       return { sec, sectionData, originalIdx: idx };
//     }) || []
//   );

//   const ADOBE_CLIENT_ID = "fe1b11d2eeb245a6bfb854a1ff276c5c";

//   // Cleanup on window close
//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       console.log("Sending cleanup request...");
//       try {
//         const success = navigator.sendBeacon(
//           "http://127.0.0.1:8000/cleanup-on-exit"
//         );
//         console.log("Cleanup request sent successfully:", success);
//       } catch (e) {
//         console.error("sendBeacon failed, falling back to fetch:", e);
//         fetch("http://127.0.0.1:8000/cleanup-on-exit", { method: "POST" })
//           .then(() => console.log("Cleanup request sent via fetch."))
//           .catch((err) => console.error("Fetch cleanup request failed:", err));
//       }
//     };
//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => window.removeEventListener("beforeunload", handleBeforeUnload);
//   }, []);

//   const handleSectionClick = (sectionData, sec, idx) => {
//     const cleanDocName = sectionData.document.replace(/^\/+|\/+$/g, "");
//     const documentUrl = http://127.0.0.1:8000/files/${cleanDocName};
//     setSelectedUrl(documentUrl);
//     setActiveSectionIdx(idx);

//     setTimeout(() => {
//       setJumpCommand({
//         page: sectionData.page_number,
//         text: sec.refined_text?.trim(),
//       });
//     }, 1000);
//   };

//   const handleTextSelection = (selectedText) => {
//     if (selectedText && selectedText.trim()) {
//       const relevant = allSections.filter(({ sec }) => {
//         const sectionText = sec.refined_text?.toLowerCase() || "";
//         const searchText = selectedText.toLowerCase();
//         return (
//           sectionText.includes(searchText) ||
//           searchText.includes(sectionText.substring(0, 50))
//         );
//       });

//       setRelevantSections(relevant);
//       setIsMenuMode(true);
//       setActiveSectionIdx(null);

//       if (selectedUrl) setOriginalPdfUrl(selectedUrl);
//     } else {
//       setIsMenuMode(false);
//       setRelevantSections([]);
//       setActiveSectionIdx(null);
//     }
//   };

//   const toggleMenuMode = () => setIsMenuMode(!isMenuMode);

//   const handleRestoreOriginal = () => {
//     if (originalPdfUrl) {
//       setSelectedUrl(originalPdfUrl);
//       setActiveSectionIdx(null);
//     }
//   };

//   return (
//     <div className="App">
//       <div className="main-container">
//         <div className={content-grid ${isMenuMode ? "menu-mode" : ""}}>
//           {/* Sidebar */}
//           <div className={sidebar ${isMenuMode ? "sidebar-hidden" : ""}}>
//             <FileUploader
//               onUploadComplete={(url) => {
//                 setSelectedUrl(url);
//                 setOriginalPdfUrl(url);
//                 setJumpCommand(null);
//                 setActiveSectionIdx(null);
//               }}
//             />
//             <FileList
//               onSelect={(url) => {
//                 setSelectedUrl(url);
//                 setOriginalPdfUrl(url);
//                 setJumpCommand(null);
//                 setActiveSectionIdx(null);
//               }}
//             />
//           </div>

//           {/* PDF Viewer */}
//           <div className={`pdf-container ${isMenuMode ? "pdf-expanded" : ""}`}>
//             {selectedUrl ? (
//               <>
//                 <PDFViewer
//                   fileUrl={selectedUrl}
//                   clientId={ADOBE_CLIENT_ID}
//                   jumpCommand={jumpCommand}
//                   onTextSelection={handleTextSelection}
//                 />
//                 {originalPdfUrl && selectedUrl !== originalPdfUrl && (
//                   <button
//                     className="restore-btn"
//                     onClick={handleRestoreOriginal}
//                   >
//                     Restore Original PDF
//                   </button>
//                 )}
//               </>
//             ) : (
//               <div className="placeholder-text">
//                 No PDF selected. Upload or choose from the list.
//               </div>
//             )}
//           </div>

//           {/* Relevant Sections */}
//           <div
//             className={`relevant-sections ${
//               isMenuMode ? "relevant-sections-visible" : ""
//             }`}
//           >
//             <div className="relevant-sections-header">
//               <h3>Relevant Sections</h3>
//               <button className="toggle-menu-btn" onClick={toggleMenuMode}>
//                 <span className="arrow-icon">{'←'}</span>
//               </button>
//             </div>

//             <div className="relevant-sections-content">
//               {relevantSections.length > 0
//                 ? relevantSections.map(({ sec, sectionData, originalIdx }) => (
//                     <button
//                       key={originalIdx}
//                       className={`relevant-section-btn ${
//                         activeSectionIdx === originalIdx ? "active" : ""
//                       }`}
//                       onClick={() =>
//                         handleSectionClick(sectionData, sec, originalIdx)
//                       }
//                     >
//                       <div className="section-title">
//                         {sectionData.section_title}
//                       </div>
//                       <div className="section-preview">
//                         {sec.refined_text?.substring(0, 100)}...
//                       </div>
//                     </button>
//                   ))
//                 : allSections.length > 0
//                 ? allSections.map(({ sec, sectionData, originalIdx }) => (
//                     <button
//                       key={originalIdx}
//                       className={`relevant-section-btn ${
//                         activeSectionIdx === originalIdx ? "active" : ""
//                       }`}
//                       onClick={() =>
//                         handleSectionClick(sectionData, sec, originalIdx)
//                       }
//                     >
//                       <div className="section-title">
//                         {sectionData.section_title}
//                       </div>
//                       <div className="section-preview">
//                         {sec.refined_text?.substring(0, 100)}...
//                       </div>
//                     </button>
//                   ))
//                 : "Select text in the PDF to see relevant sections"}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
// import React, { useState, useEffect } from "react";
// import FileUploader from "./components/FileUploader";
// import FileList from "./components/FileList";
// import PDFViewer from "./components/PDFViewer";
// import analysis from "./output/output.json";
// import "./App.css";

// function App() {
//   const [selectedUrl, setSelectedUrl] = useState(null);
//   const [jumpCommand, setJumpCommand] = useState(null);
//   const [isMenuMode, setIsMenuMode] = useState(false);
//   const [relevantSections, setRelevantSections] = useState([]);
//   const [activeSectionIdx, setActiveSectionIdx] = useState(null);
//   const [originalPdfUrl, setOriginalPdfUrl] = useState(null);

//   const ADOBE_CLIENT_ID = "fe1b11d2eeb245a6bfb854a1ff276c5c";

//   // Map subsection_analysis to extracted_sections correctly
//   const allSections = (analysis.subsection_analysis || []).map((sec, idx) => {
//     const sectionData = analysis.extracted_sections[idx];
//     return { sec, sectionData, originalIdx: idx };
//   });

//   // Cleanup on window close
//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       try {
//         navigator.sendBeacon("/cleanup-on-exit");
//       } catch (e) {
//         fetch("/cleanup-on-exit", { method: "POST" });
//       }
//     };
//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => window.removeEventListener("beforeunload", handleBeforeUnload);
//   }, []);

//   const handleSectionClick = (sectionData, sec, idx) => {
//     // Build proper URL for the PDF
//     const documentUrl = sectionData.document.startsWith("http")
//       ? sectionData.document
//       : ${window.location.origin}/files/${sectionData.document.replace(/^\/+|\/+$/g, "")};

//     setSelectedUrl(documentUrl);
//     setActiveSectionIdx(idx);

//     // setTimeout(() => {
//     //   setJumpCommand({
//     //     page: sectionData.page_number,
//     //     text: sec.refined_text?.trim(),
//     //   });
//     // }, 1000);
//     setTimeout(() => {
//                         const jumpData = {
//                           page: sectionData.page_number,
//                           text: sec.refined_text?.trim()
//                         };
//                         console.log("Setting jump command:", jumpData);
//                         setJumpCommand(jumpData);
//                       }, 1000);
//   };

//   const handleTextSelection = (selectedText) => {
//     if (selectedText && selectedText.trim()) {
//       const relevant = allSections.filter(({ sec }) => {
//         const sectionText = sec.refined_text?.toLowerCase() || "";
//         const searchText = selectedText.toLowerCase();
//         return (
//           sectionText.includes(searchText) ||
//           searchText.includes(sectionText.substring(0, 50))
//         );
//       });

//       setRelevantSections(relevant);
//       setIsMenuMode(true);
//       setActiveSectionIdx(null);

//       if (selectedUrl) setOriginalPdfUrl(selectedUrl);
//     } else {
//       setIsMenuMode(false);
//       setRelevantSections([]);
//       setActiveSectionIdx(null);
//     }
//   };

//   const toggleMenuMode = () => setIsMenuMode(!isMenuMode);

//   const handleRestoreOriginal = () => {
//     if (originalPdfUrl) {
//       setSelectedUrl(originalPdfUrl);
//       setActiveSectionIdx(null);
//     }
//   };

//   return (
//     <div className="App">
//       <div className="main-container">
//         <div className={content-grid ${isMenuMode ? "menu-mode" : ""}}>
//           {/* Sidebar */}
//           <div className={sidebar ${isMenuMode ? "sidebar-hidden" : ""}}>
//             <FileUploader
//               onUploadComplete={(url) => {
//                 setSelectedUrl(url);
//                 setOriginalPdfUrl(url);
//                 setJumpCommand(null);
//                 setActiveSectionIdx(null);
//               }}
//             />
//             <FileList
//               onSelect={(url) => {
//                 setSelectedUrl(url);
//                 setOriginalPdfUrl(url);
//                 setJumpCommand(null);
//                 setActiveSectionIdx(null);
//               }}
//             />
//           </div>

//           {/* PDF Viewer */}
//           <div className={`pdf-container ${isMenuMode ? "pdf-expanded" : ""}`}>
//             {selectedUrl ? (
//               <>
//                 <PDFViewer
//                   fileUrl={selectedUrl}
//                   clientId={ADOBE_CLIENT_ID}
//                   jumpCommand={jumpCommand}
//                   onTextSelection={handleTextSelection}
//                 />
//                 {originalPdfUrl && selectedUrl !== originalPdfUrl && (
//                   <button
//                     className="restore-btn"
//                     onClick={handleRestoreOriginal}
//                   >
//                     Restore Original PDF
//                   </button>
//                 )}
//               </>
//             ) : (
//               <div className="placeholder-text">
//                 No PDF selected. Upload or choose from the list.
//               </div>
//             )}
//           </div>

//           {/* Relevant Sections */}
//           <div
//             className={`relevant-sections ${
//               isMenuMode ? "relevant-sections-visible" : ""
//             }`}
//           >
//             <div className="relevant-sections-header">
//               <h3>Relevant Sections</h3>
//               <button className="toggle-menu-btn" onClick={toggleMenuMode}>
//                 <span className="arrow-icon">{'←'}</span>
//               </button>
//             </div>

//             <div className="relevant-sections-content">
//               {relevantSections.length > 0
//                 ? relevantSections.map(({ sec, sectionData, originalIdx }) => (
//                     <button
//                       key={originalIdx}
//                       className={`relevant-section-btn ${
//                         activeSectionIdx === originalIdx ? "active" : ""
//                       }`}
//                       onClick={() =>
//                         handleSectionClick(sectionData, sec, originalIdx)
//                       }
//                     >
//                       <div className="section-title">
//                         {sectionData.section_title}
//                       </div>
//                       <div className="section-preview">
//                         {sec.refined_text?.substring(0, 100)}...
//                       </div>
//                     </button>
//                   ))
//                 : allSections.length > 0
//                 ? allSections.map(({ sec, sectionData, originalIdx }) => (
//                     <button
//                       key={originalIdx}
//                       className={`relevant-section-btn ${
//                         activeSectionIdx === originalIdx ? "active" : ""
//                       }`}
//                       onClick={() =>
//                         handleSectionClick(sectionData, sec, originalIdx)
//                       }
//                     >
//                       <div className="section-title">
//                         {sectionData.section_title}
//                       </div>
//                       <div className="section-preview">
//                         {sec.refined_text?.substring(0, 100)}...
//                       </div>
//                     </button>
//                   ))
//                 : "Select text in the PDF to see relevant sections"}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
import React, { useState, useEffect } from "react";
import FileUploader from "./components/FileUploader";
import FileList from "./components/FileList";
import PDFViewer from "./components/PDFViewer";
import { fetchInsights } from "./components/useInsights"; // Import fetchInsights
import analysis from "./output/output.json";
// import insightIcon from "./insight-icon.png";

import "./App.css";

function App() {
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [jumpCommand, setJumpCommand] = useState(null);
  const [isMenuMode, setIsMenuMode] = useState(false);
  const [relevantSections, setRelevantSections] = useState([]);
  const [activeSectionIdx, setActiveSectionIdx] = useState(null);
  const [originalPdfUrl, setOriginalPdfUrl] = useState(null);
  const [selectedText, setSelectedText] = useState(""); // Add selectedText state
  const [insight, setInsight] = useState(""); // Add insight state
  const [dynamicSections, setDynamicSections] = useState(null); // Add dynamic sections state
  const [isNavigatingToSection, setIsNavigatingToSection] = useState(false); // Flag to prevent re-processing during navigation
  const [pdfViewerKey, setPdfViewerKey] = useState(0); // Stable key for PDF viewer
  const [isGeneratingEmbeddings, setIsGeneratingEmbeddings] = useState(false); // Loading state for embeddings

  const ADOBE_CLIENT_ID = "fe1b11d2eeb245a6bfb854a1ff276c5c";

  // Use dynamic sections if available, otherwise fall back to static analysis
  const allSections = dynamicSections
    ? (dynamicSections.subsection_analysis || []).map((sec, idx) => {
        const sectionData = dynamicSections.extracted_sections[idx];
        return { sec, sectionData, originalIdx: idx };
      })
    : (analysis.subsection_analysis || []).map((sec, idx) => {
        const sectionData = analysis.extracted_sections[idx];
        return { sec, sectionData, originalIdx: idx };
      });

  // Cleanup on window close
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        navigator.sendBeacon("/cleanup-on-exit");
      } catch (e) {
        fetch("/cleanup-on-exit", { method: "POST" });
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleSectionClick = (sectionData, sec, idx) => {
    // Set navigation flag to prevent re-processing
    setIsNavigatingToSection(true);

    // Build proper URL for the PDF
    const documentUrl = sectionData.document.startsWith("http")
      ? sectionData.document
      : `${window.location.origin}/files/${sectionData.document.replace(
          /^\/+|\/+$/g,
          ""
        )}`;

    setSelectedUrl(documentUrl);
    setActiveSectionIdx(idx);

    setTimeout(() => {
      const jumpData = {
        page: sectionData.page_number,
        text: sec.refined_text?.trim(),
      };
      console.log("Setting jump command:", jumpData);
      setJumpCommand(jumpData);

      // Clear navigation flag after jump is set
      setTimeout(() => setIsNavigatingToSection(false), 2000);
    }, 1000);
  };

  // Handle response from save-input endpoint (now async)
  const handleSaveInputResponse = (responseData) => {
    if (responseData.status === "processing") {
      console.log("Analysis started in background, polling for results...");
      // Start polling for results
      pollProcessingStatus();
    } else if (responseData.analysis_results) {
      // Handle immediate results (fallback)
      updateDynamicSections(responseData.analysis_results);
    }
  };

  // Poll processing status for async results
  const pollProcessingStatus = async () => {
    const maxAttempts = 60; // Poll for up to 60 seconds
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch("/processing-status");
        const status = await response.json();

        console.log("Processing status:", status);

        if (status.status === "completed" && status.result) {
          updateDynamicSections(status.result);
          return;
        } else if (status.status === "error") {
          console.error("Processing failed:", status.error);
          return;
        } else if (status.is_processing && attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 1000); // Poll every second
        }
      } catch (error) {
        console.error("Error polling status:", error);
      }
    };

    poll();
  };

  // Update dynamic sections with analysis results
  const updateDynamicSections = (analysisResults) => {
    console.log("Received dynamic analysis results:", analysisResults);
    setDynamicSections(analysisResults);

    // Update relevant sections with the new dynamic data
    const newAllSections = (analysisResults.subsection_analysis || []).map(
      (sec, idx) => {
        const sectionData = analysisResults.extracted_sections[idx];
        return { sec, sectionData, originalIdx: idx };
      }
    );

    // Filter relevant sections based on the selected text
    const relevant = newAllSections.filter(({ sec }) => {
      const sectionText = sec.refined_text?.toLowerCase() || "";
      const searchText = selectedText.toLowerCase();

      const searchWords = searchText
        .split(/\s+/)
        .filter((word) => word.length > 2);

      const hasMatchingWords = searchWords.some((word) =>
        sectionText.includes(word)
      );

      const hasDirectMatch =
        sectionText.includes(searchText) ||
        searchText.includes(sectionText.substring(0, 50));

      return hasMatchingWords || hasDirectMatch;
    });

    setRelevantSections(relevant);
    setIsMenuMode(true);
  };

  const handleTextSelection = (selectedText) => {
    setSelectedText(selectedText); // Store selected text

    if (selectedText && selectedText.trim()) {
      // Set the current PDF as original when text is selected (this enables "Restore" functionality)
      if (selectedUrl) {
        setOriginalPdfUrl(selectedUrl);
      }

      // The actual filtering will happen in handleSaveInputResponse after backend processing
      // For now, just show that text is selected
      setIsMenuMode(true);
      setActiveSectionIdx(null);
    } else {
      setIsMenuMode(false);
      setRelevantSections([]);
      setActiveSectionIdx(null);
    }
  };

  const handleInsights = async () => {
    if (!selectedText) {
      alert("Please select text in the PDF before generating insights.");
      return;
    }
    const result = await fetchInsights(selectedText);
    setInsight(result);
  };

  const toggleMenuMode = () => setIsMenuMode(!isMenuMode);

  const handleRestoreOriginal = () => {
    if (originalPdfUrl) {
      setSelectedUrl(originalPdfUrl);
      setActiveSectionIdx(null);
      setJumpCommand(null);
      // Keep selectedText and relevantSections so user can continue working with them
    }
  };

  // Generate embeddings after upload
  const generateEmbeddings = async () => {
    setIsGeneratingEmbeddings(true);
    try {
      const response = await fetch("/generate-embeddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log("Embeddings generated:", data);
      return data;
    } catch (error) {
      console.error("Error generating embeddings:", error);
      return null;
    } finally {
      setIsGeneratingEmbeddings(false);
    }
  };

  return (
    <div className="App">
      <div className="main-container">
        <div className={`content-grid ${isMenuMode ? "menu-mode" : ""}`}>
          {/* Sidebar */}
          <div className={`sidebar ${isMenuMode ? "sidebar-hidden" : ""}`}>
            <FileUploader
              onUploadComplete={async (url) => {
                setPdfViewerKey((prev) => prev + 1); // Force re-mount for new upload
                setSelectedUrl(url);
                setOriginalPdfUrl(url); // Set as original when first uploaded
                setJumpCommand(null);
                setActiveSectionIdx(null);
                // Clear text selection and relevant sections when uploading new PDF
                setSelectedText("");
                setRelevantSections([]);
                setDynamicSections(null); // Clear dynamic sections
                setIsMenuMode(false);

                // Generate embeddings after upload
                await generateEmbeddings();
              }}
            />

            {/* Loading indicator for embeddings generation */}
            {isGeneratingEmbeddings && (
              <div
                className="upload-section"
                style={{ textAlign: "center", padding: "20px" }}
              >
                <div
                  style={{
                    color: "#6a1cce",
                    fontWeight: "600",
                    marginBottom: "10px",
                  }}
                >
                  🔄 Processing PDFs...
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    marginBottom: "8px",
                  }}
                >
                  Generating embeddings for faster analysis
                </div>
                <div style={{ fontSize: "11px", color: "#999" }}>
                  This may take a moment for multiple files
                </div>
              </div>
            )}

            <FileList
              onSelect={(url) => {
                // Only re-mount if URL actually changed
                if (url !== selectedUrl) {
                  setPdfViewerKey((prev) => prev + 1); // Force re-mount for new PDF
                }

                // Clear text selection and relevant sections when switching PDFs
                setSelectedText("");
                setRelevantSections([]);
                setDynamicSections(null); // Clear dynamic sections
                setIsMenuMode(false);

                // Now switch to the new PDF
                setSelectedUrl(url);
                setOriginalPdfUrl(url); // This becomes the new starting point
                setJumpCommand(null);
                setActiveSectionIdx(null);
              }}
            />
          </div>

          {/* PDF Viewer */}
          <div className={`pdf-container ${isMenuMode ? "pdf-expanded" : ""}`}>
            {selectedUrl ? (
              <>
                <PDFViewer
                  key={pdfViewerKey} // Use stable key that only changes when truly switching PDFs
                  fileUrl={selectedUrl}
                  clientId={ADOBE_CLIENT_ID}
                  jumpCommand={jumpCommand}
                  onTextSelection={handleTextSelection}
                  onSaveInputResponse={handleSaveInputResponse} // Pass callback for save-input response
                  selectedText={selectedText} // Pass selectedText as prop
                  isNavigatingToSection={isNavigatingToSection} // Pass navigation flag
                />
                {originalPdfUrl && selectedUrl !== originalPdfUrl && (
                  <button
                    className="restore-btn"
                    onClick={handleRestoreOriginal}
                  >
                    Restore Original PDF
                  </button>
                )}
              </>
            ) : (
              <div className="placeholder-text">
                No PDF selected. Upload or choose from the list.
              </div>
            )}
          </div>

          {/* Relevant Sections */}
          <div
            className={`relevant-sections ${
              isMenuMode ? "relevant-sections-visible" : ""
            }`}
          >
            <div className="relevant-sections-header">
              <h3>Relevant Sections</h3>
              <button
                onClick={handleInsights}
                disabled={!selectedText}
                className="circular-btn"
              >
                {/* <img src={insightIcon} alt="Insights" className="btn-icon" /> */}
              </button>

              <button className="toggle-menu-btn" onClick={toggleMenuMode}>
                <span className="arrow-icon">{"←"}</span>
              </button>
            </div>

            {/* Display Insights */}
            {insight && (
              <div
                style={{
                  margin: "12px",
                  padding: "12px",
                  background: "rgba(255,255,255,0.8)",
                  borderRadius: "8px",
                  backdropFilter: "blur(5px)",
                  border: "1px solid #e0e0e0",
                }}
              >
                <strong>💡 Insights:</strong>
                <p
                  style={{
                    whiteSpace: "pre-wrap",
                    marginTop: 8,
                    fontSize: "14px",
                  }}
                >
                  {insight}
                </p>
              </div>
            )}

            <div className="relevant-sections-content">
              {relevantSections.length > 0
                ? relevantSections.map(({ sec, sectionData, originalIdx }) => (
                    <button
                      key={originalIdx}
                      className={`relevant-section-btn ${
                        activeSectionIdx === originalIdx ? "active" : ""
                      }`}
                      onClick={() =>
                        handleSectionClick(sectionData, sec, originalIdx)
                      }
                    >
                      <div className="section-title">
                        {sectionData.section_title}
                      </div>
                      <div className="section-preview">
                        {sec.refined_text?.substring(0, 100)}...
                      </div>
                    </button>
                  ))
                : allSections.length > 0
                ? allSections.map(({ sec, sectionData, originalIdx }) => (
                    <button
                      key={originalIdx}
                      className={`relevant-section-btn ${
                        activeSectionIdx === originalIdx ? "active" : ""
                      }`}
                      onClick={() =>
                        handleSectionClick(sectionData, sec, originalIdx)
                      }
                    >
                      <div className="section-title">
                        {sectionData.section_title}
                      </div>
                      <div className="section-preview">
                        {sec.refined_text?.substring(0, 100)}...
                      </div>
                    </button>
                  ))
                : "Select text in the PDF to see relevant sections"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
