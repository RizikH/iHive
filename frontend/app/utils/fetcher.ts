const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://ihive.onrender.com/api"
    : "http://localhost:5000/api";

export const fetcher = async (
  path: string,
  method: string = "GET",
  body?: any,
  customHeaders?: Record<string, string>
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
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Something went wrong");
  }

  return res.json();
};
