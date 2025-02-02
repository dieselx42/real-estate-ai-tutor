const API_BASE_URL = "http://localhost:8000/api"; // ✅ Ensure this matches your backend

// ✅ Generic fetch function with error handling
export async function fetchData(endpoint: string) {
  console.log(`🔵 Fetching data from: ${API_BASE_URL}${endpoint}`);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error(`❌ HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`❌ Fetch failed for ${endpoint}:`, error);
    return null;
  }
}

// ✅ Fetch Exam Questions
export async function fetchQuestions(topic: string) {
  console.log("🔵 Fetching questions from backend...");
return fetchData(`/questions/?topic=${topic}`);  // ✅ Corrected API call
}

// ✅ Fetch AI Recommendations
export async function fetchAIRecommendations() {
  console.log("🔵 Fetching AI Recommendations...");
  return fetchData(`/ai-recommendations/`); // ✅ Added /
}

// ✅ Fetch User Progress
export async function fetchUserProgress(userId: string) {
  console.log(`🔵 Fetching progress for user: ${userId}`);
  return fetchData(`/user-progress/?userId=${userId}`); // ✅ Added /
}

// ✅ Fetch Upcoming Sessions
export async function fetchUpcomingSessions() {
  console.log("🔵 Fetching upcoming sessions...");
  return fetchData(`/upcoming-sessions/`); // ✅ Added /
}

