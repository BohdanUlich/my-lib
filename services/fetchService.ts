import { RequestInit } from "next/dist/server/web/spec-extension/request";

type RequestMethods = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method: RequestMethods;
  data?: Record<string, unknown> | FormData;
  headers?: Record<string, unknown>;
}

export const fetchService = async (url: string, options: RequestOptions) => {
  const { method, data, headers } = options;

  const isServer = typeof window === "undefined";
  const isFormData = data instanceof FormData;

  const config: RequestInit = {
    method,
    headers: {
      ...(!isFormData ? { "Content-Type": "application/json" } : undefined),
      ...headers,
      "Cache-Control":
        "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
      "CDN-Cache-Control":
        "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
      "Surrogate-Control": "no-store",
    },
    ...(data
      ? isFormData
        ? { body: data }
        : { body: JSON.stringify(data) }
      : undefined),
    cache: "no-store",
  };

  try {
    const finalUrl = isServer
      ? `${process.env.API_BASE_URL}/${url}`
      : `/api/${url}`;
    const response = await fetch(finalUrl, config);
    const jsonData = await response.json();

    console.log("response", jsonData);

    return jsonData;
  } catch (error) {
    console.error("API Service Error:", error);
    throw error;
  }
};
