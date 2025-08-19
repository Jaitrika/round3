/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

/* Main App container with gradient background */
.App {
  min-height: 100vh;
  background: linear-gradient(90deg, #5171ff8a 0%, #ff66c477 100%);
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Keep flex-start for top alignment */
  padding-top: 40px; /* Add some top padding for better centering */
  padding-bottom: 40px; /* Add bottom padding for consistency */
}

/* Main content container - white transparent box */
.main-container {
  background: rgba(255, 255, 255, 0.46);
  border-radius: 24px;
  padding: 32px;
  width: 100%;
  max-width: 1300px;
  /* Remove fixed min-height and let it adapt to content */
  /* min-height: calc(100vh - 40px); */
  height: fit-content; /* Adapt to content height */
  min-height: 400px; /* Small minimum to prevent collapse */
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin: auto; /* Center the container */
}

/* Grid layout for the main content with smooth transitions */
.content-grid {
  display: grid;
  grid-template-columns: 320px 1fr 0fr;
  gap: 24px;
  /* Remove fixed height */
  /* height: 100%; */
  min-height: 300px; /* Small minimum for grid */
  transition: all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
}

/* Menu mode - slide layout */
.content-grid.menu-mode {
  grid-template-columns: 0fr 1fr 320px;
}

/* Left sidebar styling with slide animation */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  min-width: 320px;
  opacity: 1;
  transform: translateX(0);
}

.sidebar.sidebar-hidden {
  transform: translateX(-100%);
  opacity: 0;
  min-width: 0;
  pointer-events: none;
}

/* Upload section styling */
.upload-section {
  background: rgba(255, 255, 255, 0.79);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.upload-section h3 {
  margin-bottom: 16px;
  color: #333;
  font-weight: 600;
  font-size: 18px;
}

/* File input styling */
.file-input-container {
  margin-bottom: 16px;
}

.file-input-container input[type="file"] {
  width: 100%;
  padding: 12px;
  border: 2px dashed rgba(182, 25, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  color: #919191;
  cursor: pointer;
  transition: all 0.3s ease;
}

.file-input-container input[type="file"]::file-selector-button {
  background: #919191;
  color: #ffffff;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  margin-right: 12px;
}

.file-input-container input[type="file"]::file-selector-button:hover {
  transform: scale(1.02);
  transition: all 0.3s ease;
}

/* Button styling */
.upload-btn, .refresh-btn {
  background: #6a1cce;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 750;
  cursor: pointer;
  transition: all 0.5s ease;
  font-size: 14px;
}

.upload-btn:hover, .refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(81, 112, 255, 0.4);
}

/* File list styling */
.file-list {
  background: rgba(255, 255, 255);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.file-list h3 {
  margin-bottom: 16px;
  color: #333;
  font-weight: 600;
  font-size: 18px;
}

.file-list ul {
  list-style: none;
  margin-top: 16px;
}

.file-list li {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background: #fee5ff;
  border-radius: 10px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.file-list li:hover {
  background: #fee5ff;
  transform: translateX(10px);
}

.file-list li.active {
  background: #6a1cce;
  color: rgb(255, 255, 255);
  font-weight: 600;
}

.active-text {
  color: white;
  font-weight: 600;
}
.restore-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #6a1cce; /* purple */
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  z-index: 2000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
}

.restore-btn:hover {
  background: #5a1aa8;
  transform: scale(1.05);
}


/* Section buttons - removed from sidebar */
.view-btn, .section-btn {
  background: #6A1CCE;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  margin-right: 12px;
  transition: all 0.3s ease;
  min-width: 50px;
}

.view-btn:hover, .section-btn:hover {
  background: rgba(81, 112, 255, 1);
  transform: scale(1.05);
}

.pdf-container {
  background: rgba(255, 255, 255);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  /* Remove height: fit-content and let it be natural */
  height: auto;
  min-height: 400px; /* Minimum height for PDF viewer */
  transition: all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
}


/* Relevant sections panel - smooth slide-in animation */
.relevant-sections {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 0; /* keep padding only when visible */
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  min-width: 0;
  opacity: 0;
  transform: translateX(100%);
  pointer-events: none;
  height: auto;        /* 🔥 auto-height */
  align-self: flex-start; /* 🔥 makes it shrink to content */
}
.relevant-sections.relevant-sections-visible {
  padding: 20px;
  min-width: 320px;
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
  height: auto;         /* 🔥 shrink-wrap */
}

.relevant-sections-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(106, 28, 206, 0.2);
}

.relevant-sections-header h3 {
  color: #6a1cce;
  font-weight: 600;
  font-size: 18px;
  margin: 0;
}


.toggle-menu-btn {
  
  background: #6a1cce;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 45px;
  height: 45px;
}

.toggle-menu-btn:hover {
  background: #5a1aa8;
  transform: scale(1.02);
  box-shadow: 0 4px 15px rgba(106, 28, 206, 0.4);
}

.arrow-icon {
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.relevant-sections-content {
  max-height: 600px;
  overflow-y: auto;
  padding-right: 5px;
}

/* Smooth scrollbar for relevant sections */
/* .relevant-sections-content::-webkit-scrollbar {
  width: 8px;
} */

.relevant-sections-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.relevant-sections-content::-webkit-scrollbar-thumb {
  background: rgba(106, 28, 206, 0.3);
  border-radius: 4px;
}

.relevant-sections-content::-webkit-scrollbar-thumb:hover {
  background: rgba(106, 28, 206, 0.5);
}
.relevant-section-btn {
  background: #fee5ff; /* pink like file-item */
  border: none;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  width: 100%;
  text-align: left;
  display: block;
  transform: translateY(0);
  color: rgb(85, 84, 84); /* default text color */
}

.relevant-section-btn:hover {
  background: #fee5ff;
   /* same hover effect as file list */
}

.relevant-section-btn.active {
  background: #6a1cce; /* purple */
  color: white;       /* white text */
  font-weight: 600;
}
.no-animate * {
  transition: none !important;
}

/* 
.section-title {
  font-weight: 600;
  color: #7b7b7b;
  font-size: 14px;
  margin-bottom: 8px;
}


.section-preview {
  color: #5f5e5e;
  font-size: 12px;
  line-height: 1.4;
} */

.no-sections {
  text-align: left;
  color: #888;
  padding: 20px 0;
}

.no-sections h4 {
  text-align: center;
  margin-bottom: 20px;
}

/* PDF viewer styling */
#adobe-dc-viewer {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Insights section */
.insights-section {
  margin-top: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.circular-btn {
  background-color: #ff66c4; /* pink */
  border: none;
  border-radius: 50%; /* circular */
  width: 50px;
  height: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -8px; /* shift left */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.circular-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 102, 196, 0.4);
}

.btn-icon {
  width: 32px;
  height: 32px;
}

/* Selected text display */
.selected-text {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(5px);
}

.selected-text strong {
  color: #333;
  font-weight: 600;
}

.selected-text p {
  margin-top: 8px;
  color: #555;
  line-height: 1.5;
  white-space: pre-wrap;
}

/* Upload results */
.upload-results {
  margin-top: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  backdrop-filter: blur(5px);
}

.upload-results ul {
  list-style: none;
  margin-top: 8px;
}

.upload-results li {
  padding: 4px 0;
  font-size: 14px;
}

.upload-results a {
  color: #5170ff;
  text-decoration: none;
  font-weight: 500;
}

.upload-results a:hover {
  text-decoration: underline;
}

/* Placeholder text */
.placeholder-text {
  text-align: center;
  color: #666;
  font-size: 18px;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(5px);
  border: 2px dashed rgba(255, 255, 255, 0.4);
}

/* File list header */
.file-list .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.refresh-btn {
  background-color: #6a1cce;
  border: none;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.refresh-btn:hover {
  background-color: #6a1cce;
}

.refresh-icon {
  width: 20px;
  height: 20px;
}

/* Responsive design */
@media (max-width: 1024px) {
  .content-grid {
  grid-template-columns: 320px 1fr 320px; /* reserve space for relevant sections */
  gap: 16px; /* a bit smaller gap */
}

.content-grid.menu-mode {
  grid-template-columns: 0fr 1fr 320px;
}

  
  .sidebar {
    min-width: unset;
  }
  
  .sidebar.sidebar-hidden {
    display: none;
  }
  
  .relevant-sections {
    min-width: unset;
    position: fixed;
    top: 20px;
    right: 20px;
    bottom: 20px;
    width: 300px;
    z-index: 1000;
  }
  
  .main-container {
    padding: 20px;
    margin: 10px;
    min-height: calc(100vh - 20px);
  }
  
  .App {
    padding: 10px;
  }
}

/* Legacy styles (keeping for compatibility) */
.App-logo {
  height: 40vmin;
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  .App-logo {
    animation: App-logo-spin infinite 20s linear;
  }
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-link {
  color: #61dafb;
}

@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
