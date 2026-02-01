import { endpoints } from '../constants/api';
import { apiClient } from './client';
import { CheckoutResponse } from './types';

export async function getCheckoutUrl(): Promise<CheckoutResponse> {
  return apiClient.get<CheckoutResponse>(endpoints.checkout);
}
