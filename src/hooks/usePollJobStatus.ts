import { useEffect, useRef, useCallback } from 'react';
import { getJobStatus } from '../api/extract';
import { useExtractionStore } from '../store/extractionStore';
import { JobStatus } from '../api/types';

const POLL_INTERVAL_MS = 1500;
const MAX_POLLS = 120; // ~3 minutes

interface UsePollJobStatusOptions {
  jobId: string | null;
  onCompleted?: () => void;
  onError?: (error: string) => void;
}

export function usePollJobStatus({
  jobId,
  onCompleted,
  onError,
}: UsePollJobStatusOptions) {
  const { setStatus, setError } = useExtractionStore();
  const pollCountRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(true);

  const stopPolling = useCallback(() => {
    activeRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!jobId) return;

    activeRef.current = true;
    pollCountRef.current = 0;

    async function poll() {
      if (!activeRef.current || !jobId) return;

      if (pollCountRef.current >= MAX_POLLS) {
        setError('Processing took too long. Please try again.');
        onError?.('Processing took too long. Please try again.');
        return;
      }

      try {
        const result = await getJobStatus(jobId);
        if (!activeRef.current) return;

        pollCountRef.current += 1;
        setStatus(result.status, result.progress, result.status_message);

        if (result.status === 'completed') {
          stopPolling();
          onCompleted?.();
          return;
        }

        if (result.status === 'error') {
          stopPolling();
          const msg = 'Processing failed. Please try another video.';
          setError(msg);
          onError?.(msg);
          return;
        }

        // Continue polling for queued/processing
        timerRef.current = setTimeout(poll, POLL_INTERVAL_MS);
      } catch (error) {
        if (!activeRef.current) return;
        const msg =
          error instanceof Error ? error.message : 'An error occurred';
        setError(msg);
        onError?.(msg);
      }
    }

    poll();

    return () => {
      stopPolling();
    };
  }, [jobId]);

  return { stopPolling };
}
