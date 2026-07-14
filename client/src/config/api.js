export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const apiRequest = async (endpoint, options = {}, userId = null) => {
  const headers = {
    ...options.headers,
  };

  // Only set Content-Type JSON if not sending FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (userId) {
    headers["user-id"] = userId;
  }

  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }
  return data;
};
