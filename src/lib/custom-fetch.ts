export type ApiResponse<T> = {
  code: string;
  message: string;
  data: T;
};

export const customFetch = async <T>(
  endPoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> => {
  const BASE_URL =
    process.env.NODE_ENV === "development"
      ? "http://211.236.39.250:18090/api/v1/otz"
      : process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = new URL(endPoint, BASE_URL).toString();
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return res.json();
};
