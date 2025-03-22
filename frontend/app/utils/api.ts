const API_URL = "http://localhost:5000/api";

// Reusable fetch helper
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API Error");
  }

  return response.json();
};

// ⬇️ UPDATED: Pass userId into this function
export const getIdeasByUser = (userId: string) =>
  fetchWithAuth(`/ideas/get/${userId}`);

// Leave the rest as-is
export const createIdea = (body: any) =>
  fetchWithAuth("/ideas", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updateIdea = (id: number, body: any) =>
  fetchWithAuth(`/ideas/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

export const deleteIdea = (id: number) =>
  fetchWithAuth(`/ideas/delete/${id}`, {
    method: "DELETE",
  });
