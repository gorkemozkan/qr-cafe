import { apiClient } from "@/lib/api-client";

export abstract class BaseRepository {
  protected abstract readonly baseUrl: string;

  protected async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return apiClient.get<T>(`${this.baseUrl}${endpoint}`, options);
  }

  protected async post<T>(endpoint: string, body?: Record<string, unknown>, options?: RequestInit): Promise<T> {
    return apiClient.post<T>(`${this.baseUrl}${endpoint}`, body, options);
  }

  protected async put<T>(endpoint: string, body?: Record<string, unknown>, options?: RequestInit): Promise<T> {
    return apiClient.put<T>(`${this.baseUrl}${endpoint}`, body, options);
  }

  protected async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return apiClient.delete<T>(`${this.baseUrl}${endpoint}`, options);
  }

  protected async patch<T>(endpoint: string, body?: Record<string, unknown>, options?: RequestInit): Promise<T> {
    return apiClient.patch<T>(`${this.baseUrl}${endpoint}`, body, options);
  }
}
