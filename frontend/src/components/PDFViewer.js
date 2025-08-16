// // frontend/src/components/PDFViewer.js
// import React, { useEffect, useRef } from "react";

// function PDFViewer({ fileUrl, clientId }) {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     if (!fileUrl) return;

        // if (!isNaN(pageNumber)) {
        //   console.log("Jumping to page:", pageNumber);
        //   // Adobe's API uses 0-based page numbers, so subtract 1 if the input is 1-based
        //   const zeroBasedPage = Math.max(0, pageNumber - 1);
        //   await apis.gotoLocation(zeroBasedPage);
          
        //   // Give the page navigation time to complete
        //   await new Promise(resolve => setTimeout(resolve, 300));
        // }const initViewer = () => {
//       if (!window.AdobeDC) {
//         console.warn("AdobeDC not loaded yet");
//         return;
//       }
//       // clear previous
//       if (containerRef.current) containerRef.current.innerHTML = "";
//       const adobeDCView = new window.AdobeDC.View({
//         clientId: clientId,
//         divId: containerRef.current.id,
//       });
//       adobeDCView.previewFile(
//         {
//           content: { location: { url: fileUrl } },
//           metaData: { fileName: fileUrl.split("/").pop() },
//         },
//         { embedMode: "SIZED_CONTAINER" }
//       );
//     };

//     if (window.AdobeDC) {
//       initViewer();
//     } else {
//       const s = document.createElement("script");
//       s.src = "https://documentcloud.adobe.com/view-sdk/main.js";
//       s.onload = initViewer;
//       document.body.appendChild(s);
//     }
//   }, [fileUrl, clientId]);

//   return (
//     <div style={{ marginTop: 12 }}>
//       <div id="adobe-dc-viewer" ref={containerRef} style={{ height: "720px", width: "100%" }} />
//     </div>
//   );
// }

// export default PDFViewer;
// import React, { useEffect, useRef, useState } from "react";

// function PDFViewer({ fileUrl, clientId, jumpCommand }) {
//   const containerRef = useRef(null);
//   const [viewerRef, setViewerRef] = useState(null);

//   useEffect(() => {
//     if (!fileUrl) return;

//     const initViewer = () => {
//       if (!window.AdobeDC) {
//         console.warn("AdobeDC not loaded yet");
//         return;
//       }
//       if (containerRef.current) containerRef.current.innerHTML = "";

//       const adobeDCView = new window.AdobeDC.View({
//         clientId: clientId,
//         divId: containerRef.current.id,
//       });

//       const previewFilePromise = adobeDCView.previewFile(
//         {
//           content: { location: { url: fileUrl } },
//           metaData: { fileName: fileUrl.split("/").pop() },
//         },
//         { embedMode: "SIZED_CONTAINER" }
//       );

//       previewFilePromise.then(adobeViewer => {
//         setViewerRef(adobeViewer);
//       });
//     };

//     if (window.AdobeDC) {
//       initViewer();
//     } else {
//       const s = document.createElement("script");
//       s.src = "https://documentcloud.adobe.com/view-sdk/main.js";
//       s.onload = initViewer;
//       document.body.appendChild(s);
//     }
//   }, [fileUrl, clientId]);

//   // Listen for jump commands
//   // useEffect(() => {
//   //   if (jumpCommand && viewerRef) {
//   //     if (jumpCommand.page !== undefined) {
//   //       viewerRef.getAPIs().then(apis => {
//   //         apis.gotoLocation(jumpCommand.page); // jump to page
//   //         if (jumpCommand.text) {
//   //           apis.search(jumpCommand.text); // highlight search term
//   //         }
//   //       });
//   //     }
//   //   }
//   // }, [jumpCommand, viewerRef]);
//   useEffect(() => {
//     if (jumpCommand && viewerRef.current) {
//       const { page, text } = jumpCommand;

//       // Example: Navigate to the page and highlight the text
//       viewerRef.current.goToPage(page - 1); // Assuming page is 1-based
//       viewerRef.current.highlightText(text);
//     }
//   }, [jumpCommand]);

//   return (
//     // <div style={{ marginTop: 12 }}>
//     //   <div id="adobe-dc-viewer" ref={containerRef} style={{ height: "720px", width: "100%" }} />
//     // </div>
//     <div style={{ height: "100%", width: "100%" }}>
//       <div id="adobe-dc-viewer"
//         ref={viewerRef}
//         fileUrl={fileUrl}
//         clientId={clientId}
//         style={{ height: "100%", width: "100%" }}
//       />
//     </div>
//   );
// }

// export default PDFViewer;
import React, { useEffect, useRef, useState } from "react";

function PDFViewer({ fileUrl, clientId, jumpCommand }) {
  const containerRef = useRef(null);
  const [adobeViewer, setAdobeViewer] = useState(null);
  const viewerConfig = {
    embedMode: "SIZED_CONTAINER",
    showZoomControl: true,
    showDownloadPDF: false,
    showPrintPDF: false,
    showAnnotationTools: false,
    enableFormFilling: false,
    enableSearchAPIs: true,
    defaultViewMode: "FIT_WIDTH",
    startPage: 1
  };

  // Initialize viewer
  useEffect(() => {
    if (!fileUrl) return;

    const initViewer = async () => {
      if (!window.AdobeDC) {
        console.warn("AdobeDC not loaded yet");
        return;
      }

      // Check if the file exists first
      try {
        const response = await fetch(fileUrl, { method: 'HEAD' });
        if (!response.ok) {
          console.error('PDF file not accessible:', fileUrl);
          return;
        }
      } catch (error) {
        console.error('Error checking PDF file:', error);
        return;
      }

      // Clear previous viewer
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }

      try {
        // Wait a bit to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 100));

        // Initialize Adobe DC View
        const adobeDCView = new window.AdobeDC.View({
          clientId: clientId,
          divId: "adobe-dc-viewer",
        });

        // Get filename from URL
        const fileName = fileUrl.split("/").pop();
        console.log("Loading PDF from URL:", fileUrl);

        // Preview the file
        const viewer = await adobeDCView.previewFile(
          {
            content: { location: { url: fileUrl } },
            metaData: { fileName: fileName }
          },
          viewerConfig
        );

        // Store viewer reference
        setAdobeViewer(viewer);
        
        // After setting viewer, handle any pending jump command, we can use this for when user goes back to original PDF
        if (jumpCommand) { 
          try {
            const apis = await viewer.getAPIs();
            console.log("Jumping to page", jumpCommand.page);
            
            // Wait for document to be ready
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Jump to page (page numbers in the API are 0-based)
            await apis.gotoLocation(jumpCommand.page - 1);
            
            // If there's text to highlight, search for it
            if (jumpCommand.text) {
              console.log("Searching for text:", jumpCommand.text);
              await apis.search(jumpCommand.text);
            }
          } catch (error) {
            console.error("Error executing jump command:", error);
          }
        }
      } catch (error) {
        console.error("Error initializing PDF viewer:", error);
      }
    };

    // Load Adobe DC View script if not already loaded
    if (window.AdobeDC) {
      initViewer();
    } else {
      const script = document.createElement("script");
      script.src = "https://documentcloud.adobe.com/view-sdk/main.js";
      script.onload = initViewer;
      document.body.appendChild(script);
    }
  }, [fileUrl, clientId]);

  // Handle jump commands that come after initial load
  useEffect(() => {
    if (!jumpCommand || !adobeViewer) return;

    const handleJump = async () => {
      try {
        console.log("Processing jump command:", jumpCommand);
        const apis = await adobeViewer.getAPIs();
        
        // Ensure we're working with numbers and handle both 0-based and 1-based page numbers
        const pageNumber = parseInt(jumpCommand.page, 10);
        
        // If we have a page number, go to it first
        if (jumpCommand.page) {
          const pageNumber = parseInt(jumpCommand.page, 10);
          if (!isNaN(pageNumber)) {
            console.log("Navigating to page:", pageNumber);
            // Adobe's API uses 0-based page numbers
            const zeroBasedPage = Math.max(0, pageNumber - 1);
            await apis.gotoLocation(zeroBasedPage);
            
            // Give the page navigation time to complete
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }

        // If we have text to search for
        if (jumpCommand.text) {
          try {
            // Wait a bit to ensure the page is loaded
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Get the first 50 characters of text to search (to avoid too long searches)
            const searchText = jumpCommand.text.split(':')[0];
            console.log("Searching for text:", searchText);
            
            // Search multiple times with increasing delay if needed
            for (let attempt = 0; attempt < 3; attempt++) {
              try {
                await apis.search(searchText, {
                  matchCase: false,
                  wholeWord: false
                });
                console.log("Search successful");
                break;
              } catch (error) {
                console.log(`Search attempt ${attempt + 1} failed, retrying...`);
                await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
              }
            }
          } catch (searchError) {
            console.error("All search attempts failed:", searchError);
          }
        }
      } catch (error) {
        console.error("Error during jump operation:", error);
      }
    };

    handleJump();
  }, [jumpCommand, adobeViewer]);

  return (
    <div style={{ marginTop: 12 }}>
      <div 
        id="adobe-dc-viewer" 
        ref={containerRef} 
        style={{ height: "720px", width: "100%" }} 
      />
    </div>
  );
}

export default PDFViewer;

// import React, { useEffect, useRef } from "react";
// // import { PDFViewer as AdobePDFViewer } from "@adobe/react-pdf-viewer"; // Example library

// function PDFViewer({ fileUrl, clientId, jumpCommand }) {
//   const viewerRef = useRef(null);

//   useEffect(() => {
//     if (jumpCommand && viewerRef.current) {
//       const { page, text } = jumpCommand;

//       // Example: Navigate to the page and highlight the text
//       viewerRef.current.goToPage(page - 1); // Assuming page is 1-based
//       viewerRef.current.highlightText(text);
//     }
//   }, [jumpCommand]);

//   return (
//     <div style={{ height: "100%", width: "100%" }}>
//       <AdobePDFViewer
//         ref={viewerRef}
//         fileUrl={fileUrl}
//         clientId={clientId}
//         style={{ height: "100%", width: "100%" }}
//       />
//     </div>
//   );
// }

// export default PDFViewer;