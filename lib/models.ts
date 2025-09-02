export interface ApiRouteResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}
