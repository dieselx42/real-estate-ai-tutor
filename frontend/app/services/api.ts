// services/api.ts
const backendUrl = "http://127.0.0.1:8000";

export const fetchData = async (endpoint: string) => {
  const response = await fetch(`${backendUrl}${endpoint}`); // Combine base URL with endpoint
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
};
