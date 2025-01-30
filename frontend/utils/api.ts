export const API_BASE_URL = "http://127.0.0.1:8000/api";

/**
 * Fetches data from the backend with cache prevention.
 */
export const fetchData = async (endpoint: string) => {
  if (!endpoint) {
    console.error("❌ fetchData Error: No endpoint provided");
    return { error: "No endpoint provided" };
  }

  console.log(`🔵 Fetching data from: ${API_BASE_URL}${endpoint}`);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}?nocache=${new Date().getTime()}`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    if (!response.ok) {
      throw new Error(`❌ HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ fetchData Error:", error);
    return { error: "Failed to fetch data" };
  }
};

/**
 * Fetches multiple real estate exam questions from the backend.
 */
export const fetchQuestions = async (topic: string = "general real estate") => {
  const data = await fetchData(`/questions?topic=${encodeURIComponent(topic)}`);

  console.log("🔍 API Response (Questions):", JSON.stringify(data, null, 2));

  return data;
};

