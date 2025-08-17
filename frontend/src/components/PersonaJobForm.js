// import React, { useState } from "react";

// function PersonaJobForm() {
//   const [persona, setPersona] = useState("");
//   const [job, setJob] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch("http://localhost:8000/save-input", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ persona, job }),
//       });

//       if (res.ok) {
//         setMessage("✅ Input saved successfully!");
//       } else {
//         setMessage("❌ Failed to save input");
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Error connecting to server");
//     }
//   };

//   return (
//     <div style={{ maxWidth: "400px", margin: "auto" }}>
//       <h2>Enter Persona & Job</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Persona:</label>
//           <input
//             type="text"
//             value={persona}
//             onChange={(e) => setPersona(e.target.value)}
//             required
//             style={{ width: "100%", marginBottom: "10px" }}
//           />
//         </div>
//         <div>
//           <label>Job:</label>
//           <input
//             type="text"
//             value={job}
//             onChange={(e) => setJob(e.target.value)}
//             required
//             style={{ width: "100%", marginBottom: "10px" }}
//           />
//         </div>
//         <button type="submit">Save</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// }

// export default PersonaJobForm;

import React, { useState,useEffect } from "react";

function PersonaJobForm({ selectedText }) {
  const [persona, setPersona] = useState("");
  const [job, setJob] = useState("");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(selectedText || "");

  // Update local selected whenever prop changes:
  useEffect(() => {
    setSelected(selectedText || "");
  }, [selectedText]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/save-input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona, job, selected_text: selected }),
      });
      setMessage(res.ok ? "✅ Input saved successfully!" : "❌ Failed to save input");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error connecting to server");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Enter Persona & Job</h2>
      {selected && (
        <div style={{ background: "#f5f5f5", padding: "6px 10px", marginBottom: 10 }}>
          <b>Selected PDF Text:</b><br />
          <textarea value={selected} onChange={e=>setSelected(e.target.value)} rows={3} style={{width:'100%'}} />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Persona:</label>
          <input
            type="text"
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            required
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </div>
        <div>
          <label>Job:</label>
          <input
            type="text"
            value={job}
            onChange={(e) => setJob(e.target.value)}
            required
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </div>
        <button type="submit">Save</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}


export default PersonaJobForm;

