import { endpoints } from '../constants/api';
import { apiClient } from './client';
import {
  ExtractRequest,
  ExtractResponse,
  JobStatusResponse,
  ResultsResponse,
} from './types';

export async function submitExtraction(
  youtubeUrl: string,
): Promise<ExtractResponse> {
  const body: ExtractRequest = { youtube_url: youtubeUrl };
  return apiClient.post<ExtractResponse>(endpoints.extract, body);
}

export async function getJobStatus(
  jobId: string,
): Promise<JobStatusResponse> {
  return apiClient.get<JobStatusResponse>(endpoints.status(jobId));
}

export async function getJobResults(
  jobId: string,
): Promise<ResultsResponse> {
  return apiClient.get<ResultsResponse>(endpoints.results(jobId));
}
