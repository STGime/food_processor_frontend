import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../constants/api';
import { ApiError, ApiErrorResponse } from './types';

const API_KEY_STORAGE_KEY = 'fp_api_key';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async getApiKey(): Promise<string | null> {
    return SecureStore.getItemAsync(API_KEY_STORAGE_KEY);
  }

  async setApiKey(key: string): Promise<void> {
    await SecureStore.setItemAsync(API_KEY_STORAGE_KEY, key);
  }

  async clearApiKey(): Promise<void> {
    await SecureStore.deleteItemAsync(API_KEY_STORAGE_KEY);
  }

  async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const apiKey = await this.getApiKey();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let body: ApiErrorResponse | undefined;
      try {
        body = await response.json();
      } catch {
        // response body is not JSON
      }
      throw new ApiError(
        body?.error || `HTTP ${response.status}`,
        response.status,
        body,
      );
    }

    return response.json();
  }

  async get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'GET' });
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
