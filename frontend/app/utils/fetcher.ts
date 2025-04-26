const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://ihive.onrender.com/api"
    : "http://localhost:5000/api";

export const fetcher = async (
  path: string,
  method: string = "GET",
  body?: any,
  customHeaders: Record<string, string> = {},
  responseType: "json" | "blob" = "json"
) => {
  const isFormData = body instanceof FormData;

  const headers = isFormData
    ? customHeaders
    : {
        "Content-Type": "application/json",
        ...customHeaders,
      };

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    credentials: "include", // includes cookies (for Supabase auth)
    body: body
      ? isFormData
        ? body
        : JSON.stringify(body)
      : undefined,
  });

  let data;

  try {
    data = responseType === "blob"
      ? await response.blob()
      : await response.json();
  } catch (error) {
    data = {
      error: "Invalid server response",
    };
  }

  // Ensure the returned data always has an error property
  if (!data.error && !response.ok) {
    data.error = "An unknown error occurred";
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
};
