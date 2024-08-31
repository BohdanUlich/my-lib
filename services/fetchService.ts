import { RequestInit } from "next/dist/server/web/spec-extension/request";

type RequestMethods = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method: RequestMethods;
  data?: any;
  headers?: any;
}

export const fetchService = async (url: string, options: RequestOptions) => {
  const { method, data, headers } = options;

  const isServer = typeof window === "undefined";

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const finalUrl = isServer
      ? `${process.env.API_BASE_URL}/${url}`
      : `/api/${url}`;
    const response = await fetch(finalUrl, config);
    const jsonData = await response.json();

    return jsonData;
  } catch (error) {
    console.error("API Service Error:", error);
    throw error;
  }
};
