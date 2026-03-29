import { API_BASE_URL } from "../../config";
import { AppError } from "../lib/appError";
import { ApiResponse } from "../types/apiResponse.types";
export default async function api(
  path: string,
  options: RequestInit,
): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  const results: ApiResponse = await response.json();
  if(!response.ok){
    throw new AppError(results.error, results.meta)
  }
  return results;
}
