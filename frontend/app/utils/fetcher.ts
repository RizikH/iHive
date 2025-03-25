// utils/fetcher.ts
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://ihive.onrender.com/api"
    : "http://localhost:5000/api";

export const fetcher = async (path: string, options: RequestInit = {}) => {
  console.log("Requesting:", `${API_URL}${path}`);
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include", // 🔐 Automatically include cookies
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || `Request failed: ${res.status}`);
  }

  return res.json();
};
