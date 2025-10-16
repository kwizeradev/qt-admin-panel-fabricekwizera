import { useState, useEffect, useCallback } from 'react';
import { DailyStats } from '../types';
import { getUserStats } from '../services/api';

interface UseStatsState {
  stats: DailyStats[];
  loading: boolean;
  error: string | null;
}

interface UseStatsActions {
  refetch: () => Promise<void>;
}

export const useStats = (): UseStatsState & UseStatsActions => {
  const [stats, setStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const statsData = await getUserStats();
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
      setStats([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};