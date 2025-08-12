// frontend/src/components/PDFViewer.js
import React, { useEffect, useRef } from "react";

function PDFViewer({ fileUrl, clientId }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!fileUrl) return;

    const initViewer = () => {
      if (!window.AdobeDC) {
        console.warn("AdobeDC not loaded yet");
        return;
      }
      // clear previous
      if (containerRef.current) containerRef.current.innerHTML = "";
      const adobeDCView = new window.AdobeDC.View({
        clientId: clientId,
        divId: containerRef.current.id,
      });
      adobeDCView.previewFile(
        {
          content: { location: { url: fileUrl } },
          metaData: { fileName: fileUrl.split("/").pop() },
        },
        { embedMode: "SIZED_CONTAINER" }
      );
    };

    if (window.AdobeDC) {
      initViewer();
    } else {
      const s = document.createElement("script");
      s.src = "https://documentcloud.adobe.com/view-sdk/main.js";
      s.onload = initViewer;
      document.body.appendChild(s);
    }
  }, [fileUrl, clientId]);

  return (
    <div style={{ marginTop: 12 }}>
      <div id="adobe-dc-viewer" ref={containerRef} style={{ height: "720px", width: "100%" }} />
    </div>
  );
}

export default PDFViewer;
