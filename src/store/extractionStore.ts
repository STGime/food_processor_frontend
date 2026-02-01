import { create } from 'zustand';
import { JobStatus, ResultsResponse } from '../api/types';

/** Normalize any ingredient key to a canonical form so "Olive Oil" and "olive_oil" match. */
export function normalizeItemKey(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9]/g, '');
}

interface ExtractionState {
  currentJobId: string | null;
  currentUrl: string | null;
  status: JobStatus | null;
  progress: number;
  results: ResultsResponse | null;
  error: string | null;
  checkedItems: Set<string>;
  setJob: (jobId: string, url: string) => void;
  setStatus: (status: JobStatus, progress: number) => void;
  setResults: (results: ResultsResponse) => void;
  setError: (error: string | null) => void;
  toggleCheckedItem: (ingredientName: string) => void;
  isItemChecked: (ingredientName: string) => boolean;
  reset: () => void;
}

export const useExtractionStore = create<ExtractionState>()((set, get) => ({
  currentJobId: null,
  currentUrl: null,
  status: null,
  progress: 0,
  results: null,
  error: null,
  checkedItems: new Set<string>(),
  setJob: (jobId, url) =>
    set({
      currentJobId: jobId,
      currentUrl: url,
      status: 'queued',
      progress: 0,
      results: null,
      error: null,
      checkedItems: new Set(),
    }),
  setStatus: (status, progress) => set({ status, progress }),
  setResults: (results) => set({ results, status: 'completed' }),
  setError: (error) => set({ error, status: error ? 'error' : null }),
  toggleCheckedItem: (ingredientName) => {
    const key = normalizeItemKey(ingredientName);
    const current = new Set(get().checkedItems);
    if (current.has(key)) {
      current.delete(key);
    } else {
      current.add(key);
    }
    set({ checkedItems: current });
  },
  isItemChecked: (ingredientName) => {
    return get().checkedItems.has(normalizeItemKey(ingredientName));
  },
  reset: () =>
    set({
      currentJobId: null,
      currentUrl: null,
      status: null,
      progress: 0,
      results: null,
      error: null,
      checkedItems: new Set(),
    }),
}));
