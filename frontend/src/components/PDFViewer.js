// import React, { useEffect, useRef, useState } from "react";
// import { fetchInsights } from "./useInsights";

// function PDFViewer({ fileUrl, clientId, jumpCommand, onTextSelection }) {
//   const containerRef = useRef(null);
//   const [adobeViewer, setAdobeViewer] = useState(null);
//   const [apis, setApis] = useState(null);
//   const [selectedText, setSelectedText] = useState("");
//   const [insight, setInsight] = useState("");

//   const viewerConfig = {
//     embedMode: "SIZED_CONTAINER",
//     showZoomControl: true,
//     showDownloadPDF: false,
//     showPrintPDF: false,
//     showAnnotationTools: false,
//     enableFormFilling: false,
//     enableSearchAPIs: true,
//     defaultViewMode: "FIT_WIDTH",
//     startPage: 1,
//   };

//   // Initialize Adobe PDF viewer
//   useEffect(() => {
//     if (!fileUrl) return;

//     const initViewer = async () => {
//       if (!window.AdobeDC) {
//         console.warn("AdobeDC not loaded yet");
//         return;
//       }

//       try {
//         const response = await fetch(fileUrl, { method: "HEAD" });
//         if (!response.ok) {
//           console.error("PDF file not accessible:", fileUrl);
//           return;
//         }
//       } catch (error) {
//         console.error("Error checking PDF file:", error);
//         return;
//       }

//       if (containerRef.current) {
//         containerRef.current.innerHTML = "";
//       }

//       await new Promise((resolve) => setTimeout(resolve, 100));

//       const adobeDCView = new window.AdobeDC.View({
//         clientId: clientId,
//         divId: "adobe-dc-viewer",
//       });

//       const fileName = fileUrl.split("/").pop();
//       console.log("Loading PDF from URL:", fileUrl);

//       try {
//         const viewer = await adobeDCView.previewFile(
//           {
//             content: { location: { url: fileUrl } },
//             metaData: { fileName: fileName },
//           },
//           viewerConfig
//         );

//         setAdobeViewer(viewer);
//         const apis = await viewer.getAPIs();
//         await apis.enableTextSelection(true);
//         setApis(apis);

//         // handle jump command if provided
//         if (jumpCommand) {
//           try {
//             console.log("Jumping to page", jumpCommand.page);
//             await new Promise((resolve) => setTimeout(resolve, 500));
//             await apis.gotoLocation(jumpCommand.page - 1);
//             if (jumpCommand.text) {
//               console.log("Searching for text:", jumpCommand.text);
//               await apis.search(jumpCommand.text);
//             }
//           } catch (error) {
//             console.error("Error executing jump command:", error);
//           }
//         }
//       } catch (error) {
//         console.error("Error initializing PDF viewer:", error);
//       }
//     };

//     if (window.AdobeDC) {
//       initViewer();
//     } else {
//       const script = document.createElement("script");
//       script.src = "https://documentcloud.adobe.com/view-sdk/main.js";
//       script.onload = initViewer;
//       document.body.appendChild(script);
//     }
//   }, [fileUrl, clientId]);

//   // Monitor text selection and notify parent
//   useEffect(() => {
//     if (!apis) return;

//     const interval = setInterval(async () => {
//       try {
//         const result = await apis.getSelectedContent();
//         if (result && result.data && result.data !== selectedText) {
//           setSelectedText(result.data);

//           // Notify parent component about text selection
//           if (onTextSelection) {
//             onTextSelection(result.data);
//           }

//           // Send to backend
//           fetch("/save-input", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               persona: "default_persona",
//               job: "default_job",
//               selected_text: result.data,
//             }),
//           })
//             .then((res) => res.json())
//             .then((data) => console.log("Saved to backend:", data))
//             .catch((err) => console.error("Error saving selected text:", err));
//         }
//       } catch (err) {
//         console.error("Error polling selection:", err);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [apis, selectedText, onTextSelection]);

//   // Handle jump commands after initial load
//   useEffect(() => {
//     if (!jumpCommand || !adobeViewer) return;

//     const handleJump = async () => {
//       try {
//         console.log("Processing jump command:", jumpCommand);
//         const apis = await adobeViewer.getAPIs();
//         const pageNumber = parseInt(jumpCommand.page, 10);

//         if (jumpCommand.page && !isNaN(pageNumber)) {
//           const zeroBasedPage = Math.max(0, pageNumber - 1);
//           await apis.gotoLocation(zeroBasedPage);
//           await new Promise((resolve) => setTimeout(resolve, 500));
//         }

//         if (jumpCommand.text) {
//           try {
//             await new Promise((resolve) => setTimeout(resolve, 500));
//             const searchText = jumpCommand.text.split(":")[0];
//             console.log("Searching for text:", searchText);

//             for (let attempt = 0; attempt < 3; attempt++) {
//               try {
//                 await apis.search(searchText, {
//                   matchCase: false,
//                   wholeWord: false,
//                 });
//                 console.log("Search successful");
//                 break;
//               } catch (error) {
//                 console.log(`Search attempt ${attempt + 1} failed, retrying...`);
//                 await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
//               }
//             }
//           } catch (searchError) {
//             console.error("All search attempts failed:", searchError);
//           }
//         }
//       } catch (error) {
//         console.error("Error during jump operation:", error);
//       }
//     };

//     handleJump();
//   }, [jumpCommand, adobeViewer]);

//   // 🔥 Disable animations while mouse is down (prevents janky transitions while selecting text)
//   useEffect(() => {
//     const handleMouseDown = () => {
//       document.body.classList.add("no-animate");
//     };
//     const handleMouseUp = () => {
//       document.body.classList.remove("no-animate");
//     };

//     window.addEventListener("mousedown", handleMouseDown);
//     window.addEventListener("mouseup", handleMouseUp);

//     return () => {
//       window.removeEventListener("mousedown", handleMouseDown);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, []);

//   const handleInsights = async () => {
//     const result = await fetchInsights(selectedText);
//     setInsight(result);
//   };

//   return (
//     <div>
//       <div
//         id="adobe-dc-viewer"
//         ref={containerRef}
//         style={{ height: "720px", width: "100%" }}
//       />
//       <div className="insights-section">
//         <button className="insights-btn" onClick={handleInsights}>
//           Get Insights
//         </button>
//         {insight && (
//           <div
//             style={{
//               marginTop: "16px",
//               padding: "16px",
//               background: "rgba(255, 255, 255, 0.6)",
//               borderRadius: "12px",
//               backdropFilter: "blur(5px)",
//             }}
//           >
//             {insight}
//           </div>
//         )}
//         <div className="selected-text">
//           <strong>This is your selected text:</strong>
//           <p>{selectedText || <em>No text selected</em>}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PDFViewer;

import React, { useEffect, useRef, useState } from "react";
import { fetchPodcast } from "./fetchPodcast";

function PDFViewer({
  fileUrl,
  clientId,
  jumpCommand,
  onTextSelection,
  onSaveInputResponse,
  selectedText,
  isNavigatingToSection,
}) {
  const containerRef = useRef(null);
  const [adobeViewer, setAdobeViewer] = useState(null);
  const [apis, setApis] = useState(null);
  const [podcast, setPodcast] = useState("");

  const viewerConfig = {
    embedMode: "SIZED_CONTAINER",
    showZoomControl: true,
    showDownloadPDF: false,
    showPrintPDF: false,
    showAnnotationTools: false,
    enableFormFilling: false,
    enableSearchAPIs: true,
    defaultViewMode: "FIT_WIDTH",
    startPage: 1,
  };

  // Initialize Adobe PDF viewer
  useEffect(() => {
    if (!fileUrl) return;

    const initViewer = async () => {
      if (!window.AdobeDC) {
        console.warn("AdobeDC not loaded yet");
        return;
      }

      try {
        const response = await fetch(fileUrl, { method: "HEAD" });
        if (!response.ok) {
          console.error("PDF file not accessible:", fileUrl);
          return;
        }
      } catch (error) {
        console.error("Error checking PDF file:", error);
        return;
      }

      // Force cleanup of previous viewer instance
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }

      // Reset viewer state
      setAdobeViewer(null);
      setApis(null);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const adobeDCView = new window.AdobeDC.View({
        clientId: clientId,
        divId: "adobe-dc-viewer",
      });

      const fileName = fileUrl.split("/").pop();
      console.log("Loading PDF from URL:", fileUrl);

      try {
        const viewer = await adobeDCView.previewFile(
          {
            content: { location: { url: fileUrl } },
            metaData: { fileName: fileName },
          },
          viewerConfig
        );

        setAdobeViewer(viewer);
        const apis = await viewer.getAPIs();
        await apis.enableTextSelection(true);
        setApis(apis);

        // Jump commands are now handled in a separate useEffect
      } catch (error) {
        console.error("Error initializing PDF viewer:", error);
      }
    };

    if (window.AdobeDC) {
      initViewer();
    } else {
      const script = document.createElement("script");
      script.src = "https://documentcloud.adobe.com/view-sdk/main.js";
      script.onload = initViewer;
      document.body.appendChild(script);
    }

    // Cleanup function to ensure proper disposal when fileUrl changes
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      setAdobeViewer(null);
      setApis(null);
    };
  }, [fileUrl, clientId]);

  // Handle jump commands when they change (for clicking relevant sections)
  useEffect(() => {
    if (!jumpCommand || !apis) return;

    const executeJump = async () => {
      try {
        console.log("Executing jump command:", jumpCommand);

        if (jumpCommand.page) {
          const pageNumber = parseInt(jumpCommand.page, 10);
          if (!isNaN(pageNumber)) {
            const zeroBasedPage = Math.max(0, pageNumber - 1);
            console.log(
              `Jumping to page ${pageNumber} (zero-based: ${zeroBasedPage})`
            );
            await apis.gotoLocation(zeroBasedPage);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for page load
          }
        }

        if (jumpCommand.text) {
          try {
            console.log("Searching for text:", jumpCommand.text);
            // Try to search for a shorter excerpt if the text is very long
            const searchText =
              jumpCommand.text.length > 50
                ? jumpCommand.text.substring(0, 50)
                : jumpCommand.text;

            await apis.search(searchText, {
              matchCase: false,
              wholeWord: false,
            });
            console.log("Search completed successfully");
          } catch (searchError) {
            console.error("Error searching for text:", searchError);
          }
        }
      } catch (error) {
        console.error("Error executing jump command:", error);
      }
    };

    executeJump();
  }, [jumpCommand, apis]);

  // Monitor text selection and notify parent
  useEffect(() => {
    if (!apis) return;

    const interval = setInterval(async () => {
      try {
        const result = await apis.getSelectedContent();
        if (result && result.data && result.data !== selectedText) {
          if (onTextSelection) {
            onTextSelection(result.data);
          }

          // Only call save-input if we're not navigating to a section
          if (!isNavigatingToSection) {
            fetch("/save-input", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                persona: "default_persona",
                job: "default_job",
                selected_text: result.data,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                console.log("Saved to backend:", data);
                if (onSaveInputResponse) {
                  onSaveInputResponse(data);
                }
              })
              .catch((error) => {
                console.error("Error saving input:", error);
              });
          } else {
            console.log("Skipping save-input call during section navigation");
          }
        }
      } catch (err) {
        console.error("Error polling selection:", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [apis, selectedText, onTextSelection]);

  // Disable animations while selecting
  useEffect(() => {
    const handleMouseDown = () => document.body.classList.add("no-animate");
    const handleMouseUp = () => document.body.classList.remove("no-animate");
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handlePodcast = async () => {
    if (!selectedText) {
      alert("Please select text in the PDF before generating a podcast.");
      return;
    }
    const result = await fetchPodcast(selectedText);
    setPodcast(result);
  };

  return (
    <div>
      <div
        id="adobe-dc-viewer"
        ref={containerRef}
        style={{ height: "720px", width: "100%" }}
      />

      <div className="insights-section">
        {/* Action Buttons - Only Podcast button remains */}
        <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
          <button
            onClick={handlePodcast}
            disabled={!selectedText}
            style={{
              padding: "8px 16px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: selectedText ? "pointer" : "not-allowed",
              opacity: selectedText ? 1 : 0.6,
            }}
          >
            Generate Podcast
          </button>
        </div>

        {/* Podcast Player */}
        {podcast && (
          <div
            style={{
              marginTop: "16px",
              padding: "16px",
              background: "rgba(255,255,255,0.6)",
              borderRadius: "12px",
              backdropFilter: "blur(5px)",
            }}
          >
            <strong>🎧 Podcast:</strong>
            <audio
              controls
              style={{ display: "block", marginTop: 8, width: "100%" }}
            >
              <source src={podcast} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Selected Text */}
        <div
          style={{
            marginTop: "16px",
            padding: "16px",
            background: "rgba(255,255,255,0.6)",
            borderRadius: "12px",
            backdropFilter: "blur(5px)",
            minHeight: "60px",
          }}
        >
          <strong>Selected Text:</strong>
          <p style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>
            {selectedText || <em>No text selected</em>}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PDFViewer;
