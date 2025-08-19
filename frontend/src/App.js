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
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false); // Loading state for insights
  const [isGeneratingPodcast, setIsGeneratingPodcast] = useState(false); // Loading state for podcast
  const [insightsSuccess, setInsightsSuccess] = useState(false); // Success state for insights
  const [podcastSuccess, setPodcastSuccess] = useState(false); // Success state for podcast

  const ADOBE_CLIENT_ID = process.env.REACT_APP_ADOBE_EMBED_API_KEY;

  // Check if Adobe API key is provided
  if (!ADOBE_CLIENT_ID) {
    console.error(
      "REACT_APP_ADOBE_EMBED_API_KEY environment variable is required"
    );
  }

  // Only use dynamic sections (no default/static sections)
  const allSections = dynamicSections
    ? (dynamicSections.subsection_analysis || [])
        .map((sec, idx) => {
          const sectionData = dynamicSections.extracted_sections[idx];
          return { sec, sectionData, originalIdx: idx };
        })
        .filter(({ sec, sectionData }) => {
          // Keep sections that have either refined_text or a meaningful section_title
          return (
            (sec.refined_text && sec.refined_text.trim()) ||
            (sectionData.section_title && sectionData.section_title.trim())
          );
        })
    : []; // No default sections - only show after analysis

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

  // Check embeddings status on app load
  useEffect(() => {
    const checkEmbeddingsOnLoad = async () => {
      // Give the app a moment to load, then check embeddings
      setTimeout(async () => {
        try {
          const response = await fetch("/list-files/");
          const data = await response.json();

          if (data.files && data.files.length > 0) {
            console.log("PDFs found on load, checking embeddings status...");
            await ensureEmbeddingsReady();
          }
        } catch (error) {
          console.error("Error checking files on load:", error);
        }
      }, 1000); // Wait 1 second after app loads
    };

    checkEmbeddingsOnLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ensureEmbeddingsReady is defined in the same component, safe to omit

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

    // Clear previous insights when navigating to a different section
    setInsight("");

    setTimeout(() => {
      const jumpData = {
        page: sectionData.page_number,
        text: sec.refined_text?.trim(),
        section_title: sectionData.section_title, // Add section title for fallback search
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

  // Manual function to check and update results (for debugging stuck states)
  const checkForResults = async () => {
    try {
      const response = await fetch("/processing-status");
      const status = await response.json();
      console.log("Manual check - current status:", status);

      if (status.status === "completed" && status.result) {
        updateDynamicSections(status.result);
        console.log("Manual update completed");
      }
    } catch (error) {
      console.error("Error in manual check:", error);
    }
  };

  // Expose checkForResults to window for debugging
  window.checkForResults = checkForResults;

  // Poll processing status for async results
  const pollProcessingStatus = async () => {
    const maxAttempts = 60; // Poll for up to 60 seconds
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch("/processing-status");
        const status = await response.json();

        console.log("Processing status:", status);

        if (status.status === "completed") {
          if (status.result) {
            updateDynamicSections(status.result);
            console.log("Polling stopped - processing completed successfully");
          } else {
            console.log("Processing completed but no results available");
          }
          return; // Stop polling
        } else if (status.status === "error") {
          console.error("Processing failed:", status.error);
          console.log("Polling stopped - processing failed");
          return; // Stop polling
        } else if (status.status === "processing" || status.is_processing) {
          if (attempts < maxAttempts) {
            attempts++;
            setTimeout(poll, 1000); // Poll every second
          } else {
            console.log("Polling stopped - max attempts reached");
            return; // Stop polling
          }
        } else {
          console.log("Polling stopped - unknown status:", status);
          return; // Stop polling
        }
      } catch (error) {
        console.error("Error polling status:", error);
        return; // Stop polling on error
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

      // Show menu mode and indicate processing is starting
      setIsMenuMode(true);
      setActiveSectionIdx(null);

      // Clear previous sections and insights when text selection changes
      setRelevantSections([]);
      setDynamicSections(null);
      setInsight(""); // Clear previous insights when text selection changes
    } else {
      setIsMenuMode(false);
      setRelevantSections([]);
      setActiveSectionIdx(null);
      setInsight(""); // Clear insights when no text is selected
    }
  };

  const handleInsights = async () => {
    if (!selectedText) {
      alert("Please select text in the PDF before generating insights.");
      return;
    }

    setIsGeneratingInsights(true);
    setInsightsSuccess(false);
    try {
      const result = await fetchInsights(selectedText);
      setInsight(result);
      setInsightsSuccess(true);
      // Reset success state after animation
      setTimeout(() => setInsightsSuccess(false), 2000);
    } catch (error) {
      console.error("Error generating insights:", error);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const handlePodcast = async () => {
    if (!selectedText) {
      alert("Please select text in the PDF before generating podcast.");
      return;
    }

    setIsGeneratingPodcast(true);
    setPodcastSuccess(false);
    try {
      const { fetchPodcast } = await import("./components/fetchPodcast");
      const result = await fetchPodcast(selectedText);
      if (result && result !== "Error generating podcast.") {
        // Create audio element and play
        const audio = new Audio(result);
        audio.play();
        setPodcastSuccess(true);
        // Reset success state after animation
        setTimeout(() => setPodcastSuccess(false), 2000);
      } else {
        alert("Failed to generate podcast. Please try again.");
      }
    } catch (error) {
      console.error("Error generating podcast:", error);
      alert("Failed to generate podcast. Please try again.");
    } finally {
      setIsGeneratingPodcast(false);
    }
  };

  const toggleMenuMode = () => setIsMenuMode(!isMenuMode);

  const handleRestoreOriginal = () => {
    if (originalPdfUrl) {
      setSelectedUrl(originalPdfUrl);
      setActiveSectionIdx(null);
      setJumpCommand(null);
      setInsight(""); // Clear insights when restoring original PDF
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

  // Check if embeddings exist and generate if needed
  const ensureEmbeddingsReady = async () => {
    try {
      const response = await fetch("/embeddings-status");
      const status = await response.json();

      if (!status.embeddings_exist) {
        console.log("Embeddings not found, generating automatically...");
        await generateEmbeddings();
      } else {
        console.log("Embeddings already exist, ready for fast processing");
      }
    } catch (error) {
      console.error("Error checking embeddings status:", error);
      // Fallback: try to generate embeddings anyway
      await generateEmbeddings();
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
                setInsight(""); // Clear previous insights
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
              onSelect={async (url) => {
                // Only re-mount if URL actually changed
                if (url !== selectedUrl) {
                  setPdfViewerKey((prev) => prev + 1); // Force re-mount for new PDF
                }

                // Clear text selection and relevant sections when switching PDFs
                setSelectedText("");
                setRelevantSections([]);
                setDynamicSections(null); // Clear dynamic sections
                setInsight(""); // Clear previous insights
                setIsMenuMode(false);

                // Now switch to the new PDF
                setSelectedUrl(url);
                setOriginalPdfUrl(url); // This becomes the new starting point
                setJumpCommand(null);
                setActiveSectionIdx(null);

                // Ensure embeddings are ready for fast processing
                await ensureEmbeddingsReady();
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
                  onInsights={handleInsights} // Pass insights handler
                  onPodcast={handlePodcast} // Pass podcast handler
                  isGeneratingInsights={isGeneratingInsights} // Pass loading state
                  isGeneratingPodcast={isGeneratingPodcast} // Pass loading state
                  insightsSuccess={insightsSuccess} // Pass success state
                  podcastSuccess={podcastSuccess} // Pass success state
                  hasRelevantSections={allSections.length > 0} // Pass sections availability
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
              {relevantSections.length > 0 ? (
                relevantSections.map(({ sec, sectionData, originalIdx }) => (
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
                      {sec.refined_text && sec.refined_text.trim()
                        ? `${sec.refined_text.substring(0, 100)}...`
                        : `Page ${sectionData.page_number} - Click to navigate`}
                    </div>
                  </button>
                ))
              ) : selectedText && !dynamicSections ? (
                <div className="loading-sections">
                  <div
                    style={{
                      color: "#6a1cce",
                      fontWeight: "600",
                      marginBottom: "10px",
                    }}
                  >
                    🔄 Analyzing your text...
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Finding relevant sections across all documents
                  </div>
                </div>
              ) : (
                <div className="no-sections-message">
                  Select text in the PDF to see relevant sections
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
