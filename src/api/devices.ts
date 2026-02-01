import { endpoints } from '../constants/api';
import { apiClient } from './client';
import {
  RegisterDeviceRequest,
  RegisterDeviceResponse,
  DeviceMeResponse,
} from './types';

export async function registerDevice(
  deviceId: string,
): Promise<RegisterDeviceResponse> {
  const body: RegisterDeviceRequest = { device_id: deviceId };
  const response = await apiClient.post<RegisterDeviceResponse>(
    endpoints.devices.register,
    body,
  );
  // Store the API key securely
  await apiClient.setApiKey(response.api_key);
  return response;
}

export async function getDeviceMe(): Promise<DeviceMeResponse> {
  return apiClient.get<DeviceMeResponse>(endpoints.devices.me);
}
