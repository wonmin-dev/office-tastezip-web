export type ApiResponse<T> = {
  code: string;
  message: string;
  data: T;
};

const customFetch = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> => {
  const BASE_URL =
    process.env.NODE_ENV === "development"
      ? "http://211.236.39.250:18090/api/v1/otz"
      : process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = BASE_URL + endpoint;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
};

export const apiClient = {
  get: <T>(endpoint: string, options?: Omit<RequestInit, "method" | "body">) =>
    customFetch<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(
    endpoint: string,
    data?: unknown,
    options?: Omit<RequestInit, "method" | "body">
  ) =>
    customFetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),
};
