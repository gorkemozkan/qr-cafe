// Simplified API client without unnecessary type wrapping
interface ApiClientOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl || "";
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...options.headers,
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      const contentType = response.headers.get("content-type");

      let data: any;

      if (contentType?.includes("application/json")) {
        try {
          data = await response.json();
        } catch (jsonError) {
          throw new Error(`Failed to parse response: ${jsonError instanceof Error ? jsonError.message : "Unknown error"}`);
        }
      } else {
        // Handle non-JSON responses
        const text = await response.text();
        if (text) {
          data = { error: text };
        } else {
          data = { error: "Empty response" };
        }
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred");
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(endpoint: string, body?: Record<string, unknown>, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: Record<string, unknown>, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  async patch<T>(endpoint: string, body?: Record<string, unknown>, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

export const apiClient = new ApiClient();
export { ApiClient };
export type { ApiClientOptions };
