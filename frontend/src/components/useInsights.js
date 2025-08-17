// useInsights.js
export async function fetchInsights(selectedText) {
  if (!selectedText) return null;

  try {
    const response = await fetch("http://localhost:8000/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: selectedText }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch insights");
    }

    const data = await response.json();
    return data.insight;
  } catch (err) {
    console.error(err);
    return "Error fetching insights.";
  }
}
