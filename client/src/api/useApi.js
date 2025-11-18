import { useState, useCallback } from 'react';

export default function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (fn) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error');
      setLoading(false);
      throw err;
    }
  }, []);

  return { request, loading, error };
}
