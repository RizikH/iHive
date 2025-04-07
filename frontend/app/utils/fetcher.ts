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

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...customHeaders,
    },
    credentials: "include",
    body: body
      ? isFormData
        ? body
        : JSON.stringify(body)
      : undefined,
  });

  if (!res.ok) {
    try {
      const error = await res.json();
      throw new Error(error.message || "Something went wrong");
    } catch {
      throw new Error("Something went wrong");
    }
  }

  return responseType === "blob" ? res.blob() : res.json();
<<<<<<< HEAD
};
=======
};
>>>>>>> 3db0a07ea6c002eef2169dd3a08d3b97afae6387
