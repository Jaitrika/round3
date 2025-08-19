export async function fetchPodcast(selectedText) {
  if (!selectedText) return null;

  try {
    const response = await fetch("http://localhost:8000/generate-podcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selected_text: selectedText }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate podcast");
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    return audioUrl;
  } catch (err) {
    console.error(err);
    return "Error generating podcast.";
  }
}
