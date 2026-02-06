import { endpoints } from '../constants/api';
import { apiClient } from './client';
import { SwapRequest, SwapResponse } from './types';

export async function getSwapSuggestions(
  ingredient: string,
  options?: Omit<SwapRequest, 'ingredient'>,
): Promise<SwapResponse> {
  const body: SwapRequest = { ingredient, ...options };
  return apiClient.post<SwapResponse>(endpoints.swaps, body);
}
